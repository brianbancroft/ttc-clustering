# Gather real time clustering

## The Low-Down

Recently, people close to me have observed some clustering issues with the TTC Busses. There exist high-demand routes where busses are supposed to arrive within ten minutes. However being the periphery of the TTC, and the traffic on this road being particularly bad, the busses have a tendency to cluster instead, leaving service gaps of up to 40-minutes from stories. 

This app is being developed to prove the hypothesis that _"TTC Busses on the 60 route have a tendency to cluster and cause service disruption at a systematic level_". 

I intend the stack to be Node with Express, PostGres with PostGIS. Pages to be rendered will be with Vue. Mapping to be done with leaflet, for now. 

## Stages

- [x] Determine End Points of the TTC Real-Time Feed
- [x] Create back-end Framework that scrapes feed on command
- [] Upload to PostGIS, using a `ST_Within` for each point to determine every point
- [] Create Cron Job that scrapes feed at certain times of day automatically
- [] Setup Admin Panel which sets the tasks
- [] Determine whether systematic clustering is ongoing
- [] Create dataviz
- [] Rebuild from mobile-first design
- [] Seek assistance from a Civic Tech community to do the following:
  1. Figure out better use strategy
  2. Improve user experience
  3. Determine better strategy for bringing forward to higher powers

## Disclaimer. 

I'm usually a rails dev, so making this happen will be tricky for me. It will be new. I'm always happy to get assistance where I can, but I may get cranky based on whatever technical problem I'm trying to solve. Don't worry, it's not you as you're a pretty awesome fellow.

## Setup
_This setup assumes that you understand at least a little about NodeJS, and have NPM and PostGRES 9.4 or later installed._

To get where I currently am with this, do the following from a terminal in Linux or OS X:
1. `git clone https://github.com/brianbancroft/ttc-clustering.git`
2. `cd ttc-clustering && npm i`
3. `psql`
4. `CREATE DATABASE ttc_clustering_development`
5. `\q`
6. `psql ttc_clustering_development`
7. `CREATE EXTENSION POSTGIS`
8. Do the following:
```
CREATE TABLE cluster_points(
  id SERIAL,
  route TEXT,
  direction_tag TEXT,
  heading INT,
  time TIMESTAMP,
  is_clustered BOOLEAN,
  location geography(POINT, 4326)
);
```
9. Finally you're set up: `npm start`

Once here, you're going to be at the same stage where I am at the tip of the master branch. 

## Additions:
This might end up being a large project. As this is the case, there's a lot of To-do's that are happening. Here are some, and some tutorials I'll be running through to understand them better - when the time comes:

### CRON - SERVER-SIDE TASKS AT CERTAIN TIMES
Intent is to do further actions through cron jobs in Express:

https://www.npmjs.com/package/node-schedule


## Using TTC NVAS
There is a lovely documement that explains the process available to run all the REST queries for the Toronto Transit Commission's Next Vehicle Arrival System (NVAS). This is what I got: 


### First request for a bus: 
[http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60]([http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60])

### Subsequent requests for the same bus:
 [http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=1491104874326](http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=1491104874326)

--- 

The difference between the two is that subsequent requests want you to place in the last time a request was made. 

### API Reply:
The following is an excerpt of the reply, around a single vehicle.

```
{ id: '1226',
  lon: '-79.467018',
  routeTag: '60',
  predictable: 'true',
  dirTag: '60_1_60B',
  heading: '256',
  lat: '43.787998',
  secsSinceReport: '9' }
```

### Sample Queries and Schema

The following are queries that are parameterized in this app. 

#### Create Table Command
```
CREATE TABLE cluster_points(
  id SERIAL,
  route TEXT,
  direction_tag TEXT,
  heading INT,
  time TIMESTAMP,
  is_clustered BOOLEAN,
  location geography(POINT, 4326)
);
```

#### Insert Into Table Command
```
INSERT INTO cluster_points(route, direction_tag, heading, time, is_clustered, location)
VALUES('60', 'up', 0, current_timestamp, false, ST_GeomFromText('POINT(-79.526535 43.774467)', 4326));
```

#### SELECT ALL
```
SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points;
```
#### SELECT ALL ON DATE FOR ROUTE
```
SELECT (id, route, direction_tag, heading, time, is_clustered, ST_AsGeoJSON(location)) FROM cluster_points
WHERE route='60'
AND extract(month from time) = '4'
AND extract(day from time) = '15'
;
```

#### UPDATE into record by ID
```
UPDATE cluster_points
SET is_clustered = true
WHERE id=2;

```
#### Select One
```
SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE id=2;
```

#### Select within 1000 meters
```
SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE ST_DWithin(ST_GeomFromText('POINT(-79.526535 43.774467)'), location, 1000);

``` 

#### Select within 1000m as JSON (not working)

```
SELECT row_to_json(id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE ST_DWithin(ST_GeomFromText('POINT(-79.526535 43.774467)'), location, 1000);

```


#### SCHEMA

*Table: ttc_cluster_points*

Column Name | Data Type | Notes
--- | --- | ---
id | int | *
location | geography | Point, EPSG 4326
route | string |
direction_tag | string |
heading | integer | 
time | time | 
is_clustered | boolean | 
