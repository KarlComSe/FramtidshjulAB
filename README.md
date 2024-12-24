# Framtidshjul AB - electrical scooter control emulator (ESCe) project

## Development setup 
**Prereq:**
* Docker and Docker Compose
* Repo cloned / initiated

**Start the dev server:**
* `docker compose -f docker-compose-dev.yml up --build`

Server is now available at http://localhost:5174


## Initiate the repository

Create a folder for the repo and initiate the git repository with the following commands:

```bash
git clone git@github.com:KarlComSe/FramtidshjulAB.git
cd SvenskaElsparkcyklarAB
```
## Todo / focus

- Report of position : to implement this, there is a need to:
  - Send updates to the server with the bike sync service. ==> done
  - Update GPS position of bike every x-seconds.
    - Get geolocation data ==> Done
    - Run simulated GPS data ==> Done
    - Possibility to mock with simple text fields ==> Will be deferred
- Implement the trip store
  - Stop button / start buttons ==> Next step
  - Display trip data in the log screen
- Implement the speed zone service
- Implement the speed/moving/stationary logic ==> Done
- Testing :| ?
- Clean the README

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
- [ ] It should be possible to turn off/stop a bike so that it can no longer be ridden.
- [ ] When a customer rents the bike, it is possible to start and ride it.
- [ ] The customer can return a bike and relinquish control over it.
- [ ] The bike warns when it needs to be charged.
- [ ] The bike saves a log of its trips with start (location, time) and end (location, time) as well as the customer.
- [ ] When the bike is taken in for maintenance or charging, it is marked as being in maintenance mode. A bike that is charging at a charging station cannot be rented by a customer and a red light indicates that it is not available.

## Implementation
- The ESCe is represented as a Single Page Application (SPA) that runs in a web browser.
- The user selects which bike to control from a list of bikes.
- The user can interact with the bike as if it were a real bike. 
- The bike's position is simulated by either:
  - The navigator.geolocation API.
  - Pre-recorded GPS data.

## General structure

The bike keeps an internal state, which partially and periodically is sent as an external state. The state is saved in the local storage. 

The update of internal state is triggered by user interaction or by the GPS position. The update of external state is triggered by user actions or by a set interval.

- External state:
  - startUpdate(bikeId, interval)
  - stopUpdate(bikeId) 

## Requirements implementation 

### UI:

The user has 2 main screens:

1. Bike screen: User can select bike, get bike information, and interact with the bike.
2. Log screen: User can view the log of trips for current emulator session.

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
  - ~~Rent~~/return the bike.
  - View the bike's log of trips.

__*Start the bike*__: The user can only start the bike if it is rented. The bike will check that it is rented and save the customer id of the renter.

- Internal state: Save {bike-id}: renter id, pos and start-time.
- External state: Report bike/{id} : start-time, start-pos.

__*Stop the bike*__: The user can stop the bike at any time. When the bike is stopped, the location will not be updated and the bike will be considered stationary. If a simulated GPS is used, the bike will stop moving.

- Internal state: Stop updating position / read recorded GPS-file, {bike-id}: speed = 0, isMoving = false.  
- External state: N/A.

__*Return the bike*__: The user can return the bike at any time. When the bike is returned, the GPS position is saved to a log, along with the customer id and the time. 

- Internal state: Save {bike-id}: renter id, pos and stop-time.
- External state: Report bike/{id} : stop-time, stop-pos.

### Logging trips in bike memory

- The bike saves a log of its trips with start (location, time) and end (location, time) as well as the customer.
- When the start button is pressed, the bike saves the start time and position, and the renter, if it isn't already saved, and communicates the same to the server.
- When the return button is pressed, the bike saves the stop time and position, and communicates the same to the server, and asks the state of the bike to be updated.

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

Pseudocode:
```javascript

watchPosition(callback, options);

// this is initiated by the user, then the callback is continuously updating the bike data
navigator.geolocation.watchPosition(callback, options? errorCallback?);

// the bike's current position is sent to the server every x millisecond
if bike is selected and GPS position is available:
    every x ms:
        sendPositionToServer(bike.position);

```

### Determine if moving / stationary and calculate speed

The speed is calculated from the distance between two consecutive GPS coordinates and the time between them. The bike is considered stationary if the speed is below 0.5 km/h.

- Internal state: Save {bike-id}: isMoving, speed.
- External state: N/A.

Pseudocode:
```javascript

if bike is selected and GPS position is available:
    every 1000 ms:
        bike.speed = calculateSpeed();
        if speed < 0.5 km/h:
            bike.isMoving = false
        else:
            bike.isMoving = true

function calculateSpeed():
    // need to decide on position format
    distance = distance(bike.position, newGPSPosition);
    time = calculateTime(bike.position.timestamp, newGPSPosition.timestamp);
    speed = distance / time;
    return speed;

//https://jsperf.app/haversine-salvador/32
function distance(lat1, lon1, lat2, lon2) {
  var deg2rad = 0.017453292519943295; // === Math.PI / 180
  var cos = Math.cos;
  lat1 *= deg2rad;
  lon1 *= deg2rad;
  lat2 *= deg2rad;
  lon2 *= deg2rad;
  var diam = 12742; // Diameter of the earth in km (2 * 6371)
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;
  var a = (
    (1 - cos(dLat)) +
    (1 - cos(dLon)) * cos(lat1) * cos(lat2)
  ) / 2;

  return diam * Math.asin(Math.sqrt(a));
}

```

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
uuid - for generating unique ids (can use browswer function instead?)

### File and folder structure

Components:

- BikeSelector
- BikeInfo
- BikeControl
- BatterySimulator
- QrCode
- Log
  - Trip snippet (1 trip)
  - Trip list (sorting, filtering)

Routes:

- +page.svelte : bike screen
- log/+page.svelte : log

Models:

- Bike
- Trip
- Routes

Services:

- gpsService
- speedZoneService

## Installing, deploying and running the application

### Prerequisites

- Node.js
- npm

### Installation (manual setup)

Clone the repository and install the dependencies:
```bash
npm install
```

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Installation (Docker)

TBD

### Deployment (Docker compose)

TBD