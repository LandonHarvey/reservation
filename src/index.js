'use strict';

const express = require('express');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const shortid = require('shortid');
const hateoasLinker = require('express-hateoas-links');

const constants = require('./constants');
const { validateSchedule, validateReservation } = require('./validators');
const { convertDateToUTC, addMinutes, isGreaterThanXMinutesApart } = require('./utils');
const { MAX_SLOT_LENGTH_MIN } = require('./constants');
const port = process.env.PORT || 8000;

async function createApp(dbPath) {
  const app = express();
  app.use(express.json());
  app.use(hateoasLinker);

  const db = await lowdb(new FileAsync(dbPath));
  await db.read();

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  /* ----- Providers ----- */

  /**
   * Create a new schedule
   * POST
   */
  app.put('/providers/:id/schedules', async (req, res) => {
    try {
      validateSchedule(req.body, req.params.id);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    /* Future Validate the start and end times are in UTC format */
    /* Future Validate the provider_id actually exists against providers table */
    const newSchedule = {
      id: shortid.generate(),
      provider_id: req.params.id,
      ...req.body
    };

    await db.get('schedules')
      .push(newSchedule)
      .write();

    res.json(newSchedule, [
      { rel: 'self', method: 'GET', href: `http://localhost:${port}/providers/schedules/${newSchedule.id}` },
      { rel: 'create', method: 'POST', title: 'Create Schedule', href: `http://localhost:${port}/providers/${req.params.id}/schedules` }
    ]);
  });

  /**
   * Create a reservation
   * PUT
   */
  app.put('/clients/:id/reservations', async (req, res) => {
    try {
      validateReservation(req.body, req.params.id);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    /* Future Validate the start and end times are in UTC format */
    /* Future Validate the provider_id and client_id actually exists against providers and clients tables */
    if (isGreaterThanXMinutesApart(new Date(req.body.startDateTimeUTC), new Date(req.body.endDateTimeUTC), MAX_SLOT_LENGTH_MIN)){
      return res.status(400).json({ error: `${MAX_SLOT_LENGTH_MIN} minute required spot` });
    }
    if (!isGreaterThanXMinutesApart(new Date(req.body.startDateTimeUTC), convertDateToUTC(new Date()), 1440)){
      return res.status(400).json({ error: '24 Hour Notice Required' });
    }
    /* Future Validate the provider has available slot time */
    const newReservation = {
      id: shortid.generate(),
      client_id: req.params.id,
      createDateTimeUTC : convertDateToUTC(new Date()).toISOString(),
      expirationDateTimeUTC: convertDateToUTC(addMinutes(new Date(), 30)).toISOString(),
      confirmed: false,
      ...req.body
    };

    await db.get('reservations')
      .push(newReservation)
      .write();

    res.json(newReservation, [
      { rel: 'self', method: 'GET', href: `http://localhost:${port}/clients/${req.params.id}/reservations/${newReservation.id}` },
      { rel: 'client', method: 'GET', href: `http://localhost:${port}/clients/${req.params.id}` },
      { rel: 'provider', method: 'GET', href: `http://localhost:${port}/providers/${newReservation.provider_id}` },
      { rel: 'create', method: 'POST', title: 'Create Review', href: `http://localhost:${port}/clients/${req.params.id}/reservations` }
    ]);
  });

  /**
   * Reservation Confirmation
   * PATCH
   */
  app.patch('/clients/:id/reservations/:r_id', async (req, res) => {

    const reservation = await db.get('reservations')
      .find({ id: req.params.r_id })
      .value();

    if (convertDateToUTC(new Date()) > new Date(Date.parse(reservation.expirationDateTimeUTC))){
      return res.status(400).json({ error: 'Reservation has expired' });
    }

    reservation.confirmed = true;
    await db.get('reservations').find({ id: req.params.r_id }).assign(reservation).value();

    return res.status(204).send();
  });

  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp(constants.DB_PATH);

    app.listen(port, () => {
      console.log(`Reservation API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
