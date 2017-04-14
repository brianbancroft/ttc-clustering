# Gather real time clustering

## The Low-Down

Recently, people close to me have observed some clustering issues with the TTC Busses. There exist high-demand routes where busses are supposed to arrive within ten minutes. However being the periphery of the TTC, and the traffic on this road being particularly bad, the busses have a tendency to cluster instead, leaving service gaps of up to 40-minutes from stories. 

This app is being developed to prove the hypothesis that _"TTC Busses on the 60 route have a tendency to cluster and cause service disruption at a systematic level_". 

I intend the stack to be Node with Express or Koa, PostGres with PostGIS. 

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

### Additions:

#### CRON
Intent is to do further actions through cron jobs in Express:

https://www.npmjs.com/package/node-schedule

#### XML TO JSON

https://github.com/Leonidas-from-XIV/node-xml2js

#### HTTP GET

https://nodejs.org/api/http.html#http_http_get_options_callback





### API Point

First request: http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60
Subsequent: http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=1491104874326

t is obtained from the prior request. 

### API Reply:

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

### SCHEMA AND SETUP

table: `ttc_clustering_development`
First condition: `CREATE EXTENSION postgis;`


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

#### SELECT ALL AS GEOJSON
```
SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points;
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



Table: ttc_cluster_points

- id INT UNIQUE PRIMARY KEY
- geom SRID 4326 (or not. maybe I UTM zone 17N) - EPSG:26917
- route String
- direction_tag String
- heading int
- time time, (usually time of ingest). 
- is_clustered boolean