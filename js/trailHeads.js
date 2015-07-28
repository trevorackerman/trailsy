"use strict";

var trailHeads = (function(){
    var geoJson = [];
    var trailheadsToTrailsMap = {};

    var _updateGeoJson = function(data) {
        var features = data.features;
        for (var i = 0; i < features.length; i++) {
            var trailheadId = features[i].properties.id;
            var trailIds = features[i].properties.trail_ids;
            trailheadsToTrailsMap[trailheadId] = trailIds;
        }
        geoJson = geoJson.concat(data);
        return this;
    };

    var _getGeoJson = function () {
        return geoJson;
    };

    var _getTrails = function(trailHeadId) {
        return trailheadsToTrailsMap[trailHeadId];
    };

    var _clear = function() {
        geoJson = [];
        trailheadsToTrailsMap = {};
    };

    return {
        updateGeoJson: _updateGeoJson,
        getGeoJson: _getGeoJson,
        getTrails: _getTrails,
        clear: _clear
    }
})();

module.exports = trailHeads;