"use strict";
var L = require('leaflet');

var trailSegments = (function () {
    var geoJsonMap = {};

    return {
        clear: function() {
            geoJsonMap = {};
        },
        updateGeoJson: function(features) {
            for (var i = 0; i < features.length; i++) {
                var trailIds = features[i].properties.trail_ids;
                for (var j = 0; j < trailIds.length; j++) {
                    if (geoJsonMap[trailIds[j]] == null) {
                        geoJsonMap[trailIds[j]] = [];
                    }
                    geoJsonMap[trailIds[j]].push(features[i]);
                }
            }
        },
        getSegmentsGeoJson: function(trailId) {
            return geoJsonMap[trailId];
        }
    }
})();

module.exports = trailSegments;