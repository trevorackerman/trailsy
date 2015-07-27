"use strict";
var L = require('leaflet');

var trailSegments = (function () {
    var geoJsonMap = {};

    return {
        clear: function() {
            geoJsonMap = {};
        },
        updateGeoJson: function(segments) {
            for (var i = 0; i < segments.length; i++) {
                var segment = segments[i];
                var trailIds = segment.properties.trail_ids;
                for (var j = 0; j < trailIds.length; j++) {
                    var trailId = trailIds[j];
                    if (geoJsonMap[trailId] == null) {
                        geoJsonMap[trailId] = {};
                        geoJsonMap[trailId].segments = [];
                    }
                    if (geoJsonMap[trailId].name != null) {
                        segment.properties.trailNames = [];
                        segment.properties.trailNames.push(geoJsonMap[trailId].name);
                    }
                    geoJsonMap[trailId].segments.push(segment);
                }
            }
        },
        getSegmentsGeoJson: function(trailId) {
            return geoJsonMap[trailId];
        },
        addTrailNames: function(trails) {
            for (var i in trails) {
                var id = trails[i].properties.id;
                var trailName = trails[i].properties.name;
                if (geoJsonMap[id] == null) {
                    geoJsonMap[id] = {};
                    geoJsonMap[id].segments = [];
                }

                geoJsonMap[id].name = trailName;

                for (var i in geoJsonMap[id].segments) {
                    var segment = geoJsonMap[id].segments[i];
                    if (segment.properties.trailNames == null) {
                        segment.properties.trailNames = [];
                    }
                    segment.properties.trailNames.push(trailName);
                }
            }
        }
    }
})();

module.exports = trailSegments;