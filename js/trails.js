"use strict";
var L = require('leaflet');

var trails = (function () {
    var geoJsonMap = {};

    return {
        clear: function() {
            geoJsonMap = {};
        },
        updateGeoJson: function(features) {
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                geoJsonMap[feature.properties.id] = feature;
            }
        },
        getTrailGeoJson: function(trailId) {
            return geoJsonMap[trailId];
        }
    }
})();

module.exports = trails;