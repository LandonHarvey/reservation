'use strict';

const v = require('@mapbox/fusspot');

const validateProvider = v.assert(
  v.strictShape({
    name: v.required(v.string)
  })
);

const validateSchedule = v.assert(
  v.strictShape({
    startDateTimeUTC: v.required(v.string),
    endDateTimeUTC: v.required(v.string)
  }),
  v.required(v.string)
);

const validateClient = v.assert(
  v.strictShape({
    name: v.required(v.string)
  })
);

const validateReservation = v.assert(
  v.strictShape({
    provider_id: v.required(v.string),
    startDateTimeUTC: v.required(v.string),
    endDateTimeUTC: v.required(v.string)
  }),
  v.required(v.string)
);

module.exports = { validateProvider, validateSchedule, validateClient, validateReservation };
