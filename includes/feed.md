#Data Collection

To obtain data from the feed, the following command seems to do the trick: 

`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=1482584539997`

Note: The `t` variable appears to be the last time, and is required in every server request after the first. 

The ouput of such a request is the following: 

```xml
<body copyright="All data copyright Toronto Transit Commission 2016.">
<vehicle id="8471" routeTag="60" dirTag="60_1_60C" lat="43.774132" lon="-79.500786" secsSinceReport="17" predictable="true" heading="252"/>
<vehicle id="8593" routeTag="60" dirTag="60_1_60D" lat="43.7594489" lon="-79.5932009" secsSinceReport="10" predictable="true" heading="274"/>
<vehicle id="8518" routeTag="60" dirTag="60_0_60C" lat="43.787815" lon="-79.417664" secsSinceReport="3" predictable="true" heading="170"/>
<vehicle id="8564" routeTag="60" dirTag="60_0_60D" lat="43.75935" lon="-79.596252" secsSinceReport="10" predictable="true" heading="64"/>
<vehicle id="8523" routeTag="60" dirTag="60_0_60C" lat="43.788368" lon="-79.464035" secsSinceReport="3" predictable="true" heading="74"/>
<vehicle id="8549" routeTag="60" dirTag="60_1_60D" lat="43.786968" lon="-79.417183" secsSinceReport="2" predictable="true" heading="350"/>
<vehicle id="8588" routeTag="60" dirTag="60_0_60D" lat="43.7783159" lon="-79.50782" secsSinceReport="8" predictable="true" heading="72"/>
<vehicle id="8439" routeTag="60" dirTag="60_1_60C" lat="43.792702" lon="-79.445114" secsSinceReport="8" predictable="true" heading="256"/>
<vehicle id="7963" routeTag="60" dirTag="60_0_60D" lat="43.792252" lon="-79.446098" secsSinceReport="10" predictable="true" heading="73"/>
<vehicle id="8527" routeTag="60" dirTag="60_0_si60" lat="43.746517" lon="-79.531319" secsSinceReport="30" predictable="true" heading="216"/>
<vehicle id="8548" routeTag="60" dirTag="60_1_60D" lat="43.781116" lon="-79.496681" secsSinceReport="8" predictable="true" heading="252"/>
<lastTime time="1482584574581"/>
</body>
```