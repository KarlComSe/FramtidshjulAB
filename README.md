# Framtidshjul AB - electrical scooter control emulator (ESCe) project


## Installing, deploying and running the application

### Development setup 
**Prereq:**
* Docker and Docker Compose
* Repo cloned / initiated

**Start the dev server:**
* `docker compose -f docker-compose-dev.yml up --build`

Server is now available at http://localhost:5174

### Installation (Standard Svelte: manual setup)
**Prereq:**
- Node.js
- npm

Clone the repository and install the dependencies:
```bash
npm install
```

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building (Standard Svelte)

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Installation (Docker)

TBD

### Deployment (Docker compose)

TBD

### Initiate the repository

Create a folder for the repo and initiate the git repository with the following commands:

```bash
git clone git@github.com:KarlComSe/FramtidshjulAB.git
cd FramtidsHjulAB
```

## Todo / focus


- Testing, code quality metrics, eslint, prettier? :| ?
- Clean the README
-- Fix the deployment section

- Implement the speed zone service (remote or local calculations?) ==> Done
- Beautify the trip log ==> Done
- Report of position : to implement this, there is a need to:
  - Send updates to the server with the bike sync service. ==> done
  - Update GPS position of bike every x-seconds. 
    - Get geolocation data ==> Done
    - Run simulated GPS data ==> Done
    - Possibility to mock with simple text fields ==> Will be deferred
- Implement the trip store
  - Stop button / start / return buttons ==> Done
  - Display trip data in the log screen ==> Done
- Implement the speed/moving/stationary logic ==> Done

## Enhancements

- Make the bike sync service reactive, enabling presentation of all syncers running and their frequencies. 
- Implement websockets instead of frequent REST-API polling

## Introduction
This is an emulator for controlling and monitoring electrical scooters. The emulator is intended to run in each bike and control/monitor it.

The emulator is built in SvelteKit. The intention is to write Svelte 5 idiomatic code and to use the latest features of SvelteKit. The key reasons for this choice are:

- SvelteKit makes it easy to manage the state of the application and there is a lot of "reactivity" / state-changes in the application.
- Svelte manage the DOM updates efficiently, without re-rendering the whole DOM.
- Opportunity to learn something new and relevant: "Developers consistently rank Svelte as the framework they’re most excited about using".
- Svelte 5 is just released into stable (Oct, 22, 2024?), so it is a good time to start using it.
- A wider knowledge outside mainstream frameworks (React, Angular, Vue) allows for flexibility and a nuanced understanding of the strengths and weaknesses of different frameworks.

## Code coverage

SCRUTINIZER COVERAGE BADGE

## Requirements
- [x] This program is intended to run in each bike and control/monitor it.
- [x] The bike reports its position at regular intervals.
- [x] The bike reports whether it is moving or stationary and its speed.
- [x] It should be possible to turn off/stop a bike so that it can no longer be ridden.
- [x] When a customer rents the bike, it is possible to start and ride it.
- [x] The customer can return a bike and relinquish control over it.
- [x] The bike warns when it needs to be charged.
- [x] The bike saves a log of its trips with start (location, time) and end (location, time) as well as the customer.
- [x] When the bike is taken in for maintenance or charging, it is marked as being in maintenance mode. A bike that is charging at a charging station cannot be rented by a customer and a red light indicates that it is not available.

## Additional features
- [x] Geo-fencing / speed zones

## Implementation
- The ESCe is represented as a Single Page Application (SPA) that runs in a web browser.
- The user selects which bike to control from a list of bikes.
- The user can interact with the bike as if it were a real bike. 
- The bike's position is simulated by either:
  - The navigator.geolocation API.
  - Pre-recorded GPS data.

## General structure

The bike keeps an internal state, which partially and periodically is sent as an external state. Part of the state is saved in the local storage (trip log). 

The update of internal state is triggered by user interaction or by the GPS position. The update of external state is triggered by user actions or by a set interval.

## Requirements implementation 

### UI:

The user has 2 main screens:

1. Bike screen: User can select bike, get bike information, and interact with the bike.
2. Log screen: User can view the log of trips for current emulator session.

Additional screen:

- Map and simulation screen: Possible to watch and play with multiple bikes. Built as a way to test the complete application, end 2 end. 

### Selecting a bike:

- The user selects which bike to control from a list of bikes.
- The user is presented with the bike-id (as QR-code) and the bike's current status.

### Show bike information:

When a bike is selected, the user is presented with the following information:

- Bike-id
- Bike status: Available / Rented / Service
- Battery status: Green: > 20% / Yellow: 10-20% / Red: < 10% (or something similar)
- Position
  - Latitude
  - Longitude
- Speed
- Moving/stationary
- Speed zone: Freie Fahrt für freie Bürger | or speed limit in km/h

### Interacting with the bike

- The user can interact with the bike as if it were a real bike.
- The user can:
  - Start/stop the bike.
  - Return the bike.
  - View the bike's log of trips. (Likely only for technicians in reality)

__*Start the bike*__: The user can only start the bike if it is rented. The bike will check that it is rented and save the customer id of the renter.

- Internal state: Save {bike-id}: renter id, pos and start-time in log (if not already saved). Set status to "Startad".
- External state: No update is being made. The update in external state is triggered in customer app.

__*Stop the bike*__: The user can stop the bike at any time. When the bike is stopped, the location will not be updated and the bike will be considered stationary. If a simulated GPS is used, the bike will stop moving.

- Internal state: Set status to "Pausad". GPS position will keep being updated, even if bike is paused, this doesn't hinder someone from running with the bike...
- External state: N/A.

__*Return the bike*__: The user can return the bike at any time. When the bike is returned, the GPS position is saved to a log, along with the customer id and the time. 

- Internal state: Save {bike-id}: renter id, pos and stop-time in log. Update bike status to available.
- External state: Stop active bike rental.

### Logging trips in bike memory

- The bike saves a log of its trips with start (location, time) and end (location, time) as well as the customer.
- When the return button is pressed, the bike saves the stop time and position in the log.

#### Example Trip Log

| Bike ID | Start Time       | Start Position (Lat, Long) | Stop Time        | Stop Position (Lat, Long) | Renter ID |
|---------|------------------|----------------------------|------------------|---------------------------|-----------|
| 1       | 2024-10-01 08:00 | 59.3293, 18.0686           | 2024-10-01 08:30 | 59.3326, 18.0649          | 123       |
| 2       | 2024-10-01 09:15 | 59.3293, 18.0686           | 2024-10-01 09:45 | 59.3350, 18.0700          | 456       |
| 3       | 2024-10-01 10:00 | 59.3293, 18.0686           | 2024-10-01 10:30 | 59.3310, 18.0650          | 789       |



### Report of position

- The bike's position is simulated by either:
  - The navigator.geolocation API.
  - Pre-recorded GPS data.

- Internal state: Save {bike-id}: pos, timestamp.
- External state: Report bike/{id} : pos, timestamp.

### Determine if moving / stationary and calculate speed

The speed is calculated from the distance between two consecutive GPS coordinates and the time between them. The bike is considered stationary if the speed is below 0.5 km/h.

- Internal state: Save {bike-id}: isMoving, speed.
- External state: N/A.

### Determine speed zone

The bike's speed zone is determined by the speed limit in the area. The speed limit is displayed to the user. If there is no speed limit, the bike is in "Freie Fahrt für freie Bürger" mode.

- Internal state: {bike-id}: speedZone.
- External state: N/A.

The API provide speed zones, which are defined as polygons with a speed limit. The bike's position is checked against the speed zones to determine the speed limit.

There is no emphasis on the efficiency of the algorithm, as the number of speed zones is expected to be low.

Pseudocode:
```javascript

if bike is selected and GPS position is available:
    every 1000 ms:
        bike.speedZone = getSpeedZone(bike.position);

function getSpeedZone(position):
    for zone in speedZones:
        if position is inside zone:
            return zone.speedLimit;
    return "Freie Fahrt für freie Bürger";


```

### Packages reminder

QRCode - for generating QR-codes
Turf.js - for intersection of polygons
uuid - for generating unique ids (can use browswer function instead?) ==> Not needed anymore. To be deleted.

### File and folder structure

Components
Routes
Models
Services
Stores
Types
Providers


## Possible feature enhancement and improvements

### Performance optimization
#### Webworker

It could be interesting to offload state managemement to a webworker, e.g. the position management and syncing

#### Batch call / Implement web sockets

There is a limitation in number of concurrent HTTP requests that is allocated by a browser to a single domain.

### Refactoring

...