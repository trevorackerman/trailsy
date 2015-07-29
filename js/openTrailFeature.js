"use strict";

var openTrailFeature = (function() {
    var _create = function(spec) {
        var geoJson = [];
        var that = {};

        that.updateGeoJson = function(data) {
            geoJson = geoJson.concat(data);
        };

        that.getGeoJson = function() {
            return geoJson;
        };

        that.clear = function() {
            geoJson.length = 0;
        };

        return that;
    };

    return {
        create: _create
    };
})();

module.exports = openTrailFeature;