# TABLE SCHEMAS
## DB ttc_clustering_dev

### Table: temp_records
<table>
    <tr>
        <th>id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>route_id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>bus_id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>time</th>
        <td>TIME</td>
    </tr>
    <tr>
        <th>geometry</th>
        <td>PostGIS Point (EPSG: 4326)</td>
    </tr>
</table>

### Table: cluster_record
<table>
    <tr>
        <th>id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>route_id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>bus_id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>time</th>
        <td>TIME</td>
    </tr>
    <tr>
        <th>geometry</th>
        <td>PostGIS Point (EPSG: 4326)</td>
    </tr>
    <tr>
        <th>cluster_id</th>
        <td>INT</td>
    </tr>
</table>

### Table: clusters
<table>
    <tr>
        <th>id</th>
        <td>INT</td>
    </tr>
    <tr>
        <th>start_time</th>
        <td>TIME</td>
    </tr>
    <tr>
        <th>end_time</th>
        <td>TIME</td>
    </tr>
</table>