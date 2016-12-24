var initStaticSixtyFeed = function () {
    return 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60'
};
var subsequentStaticSixtyFeed = function (time) {
    return `http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=${time}`
};
var initBusFeed = function (routeNum) {
    return `http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=${routeNum}`
}
var subsequentBusFeed = function (routeNum, time) {
    return `http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=${route}&t=${time}`
}