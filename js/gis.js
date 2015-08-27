"use strict";

var gis = function (spec) {
    var that = {};

    function toRad(x) {
        return x * Math.PI / 180;
    }

    that.haversineDistance = function (coordinatesA, coordinatesB) {
        var longitudeA = coordinatesA[0];
        var latitudeA = coordinatesA[1];
        var longitudeB = coordinatesB[0];
        var latitudeB = coordinatesB[1];

        var deltaLatitude = toRad(latitudeB - latitudeA);
        var deltaLongitude = toRad(longitudeB - longitudeA);

        var a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.cos(toRad(latitudeA)) * Math.cos(toRad(latitudeB)) *
            Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // meters
        var d = 6371 * 1000 * c;
        return d;
    };

    that.pathDistance = function (coordinatesArray) {
        var distance = 0;
        var s = "";
        for (var i = 0; i < coordinatesArray.length - 1; i++) {
            var tmp = that.haversineDistance(coordinatesArray[i], coordinatesArray[i + 1]);
            s += " " + tmp.toFixed(0);
            distance += tmp;
        }
        s += " = " + distance;
        console.log(s);
        return distance;
    };

    return that;
};

module.exports = gis;