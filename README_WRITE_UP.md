##Instructions

NPM Install
```npm install```

Init database
```npm run init-db```

Run Application
```npm run watch```

## Dependencies
express-hateoas-links: I chose to utilize HATEOS(Hypermedia as the engine of application state) in this implementation of the APIs.
HATEOS was chosen because APIs such as this one I believe it's best to provide information to 
clients dynamically using hypermedia. This allows the clients consuming the API to make single requests and be able to understand 
every following step without needing to code urls, paths or overly reference documentation for the API. When APIs grow larger than
simple scheduling HATEOS can begin to seem like a daunting task but can still prove highly beneficial to end clients in my opinion.
HATEOS was also chosen because with the three tasks presented its very easy to not stand out from the rest. The tasks are simple and straight forward but I believe
sometimes thinking outside the box (as long as its justified and has work to back it up) can prove great.


## Tasks

### Allow a provider to create a schedule

Request Type chose: PUT
In this case a PUT request method was chosen because ultimately a schedule is being created not updated(PATCH).

Path chose: /providers/:id/schedules
I chose this path because I believe the schedule exists on the provider, as if the provider did not exist the schedule would not either.
If you put it instead on the client I believe that would be incorrect as again without a provider the client has nothing to schedule against.

Request Body: startDateTimeUTC, endDateTimeUTC
Request Param: provider_id

Potential Future Enchantments: Validating the time format as there is not a check to make sure it's in UTC format. Validate the provider exists as there 
is currently not a check. For time constraints these were not added. Also, a validation that they do not already have a schedule between
the time they are trying to schedule.


### Allow client to Create a reservation

Request Type chose: PUT
In this case a PUT request method was chosen because ultimately a reservation is being created not updated(PATCH)

Path chose: /clients/:id/reservations
I chose this path because it's a reservations belong to the client and not the provider. A provider would never have a reservation
if they did not have clients. 

Request Body: startDateTimeUTC, endDateTimeUTC, provider_id
Request Param: client_id

Potential Future Enchantments: Validating the time format as there is not a check to make sure it's in UTC format. Validate the provider and client exist as there
is currently not a check. Also, a validation that they do not already have a reservation between
the time they are trying to reserve. And validate the provider has a schedule that contains that time. 

### Allow client to Confirm a reservation

Request Type chose: PATCH
In this case a PATCH request method was chosen because a reservation is being updated not created(PUT/POST)

Path chose: /clients/:id/reservations/:r_id

Request Param: client_id, reservation_id

Potential Future Enchantments: Validate the client exists.


### Additional Thoughts

With the time constraints did not implement a lot of the validations that would exist in a production API of this type. I believe I still showed
the understanding needed to develop those in the future. 
