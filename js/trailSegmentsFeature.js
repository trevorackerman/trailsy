"use strict";

var openTrailFeature = require('./openTrailFeature.js');

var trailSegmentsFeature = (function () {
    var _create = function() {
        var geoJsonMap = {};
        var allSegments = [];
        var currentTrailIds = [];

        var that = openTrailFeature.create();

        that.updateGeoJson = function(data) {
            allSegments = allSegments.concat(data);
            _updateGeoJsonMap(allSegments);
        };

        that.getGeoJson = function() {
            var segments = [];
            for (var i in currentTrailIds) {
                segments = segments.concat(that.getSegmentsForTrail(currentTrailIds[i]));
            }

            return segments;
        };

        that.clear = function () {
            geoJsonMap = {};
            allSegments.length = 0;
        };

        that.getSegmentsForTrail = function (trailId) {
            if (geoJsonMap[trailId] == null || geoJsonMap[trailId].features == null) {
                return [];
            }
            return geoJsonMap[trailId];
        };

        that.setCurrentTrails = function(trailIds) {
            currentTrailIds.length = 0;
            currentTrailIds = currentTrailIds.concat(trailIds);
        };

        var getMapEntry = function(trailId) {
            if (geoJsonMap[trailId] == null) {
                geoJsonMap[trailId] = {
                    type: "FeatureCollection",
                    features: []
                }
            }

            return geoJsonMap[trailId];
        };

        var _addTrailName = function(segment, trailName) {
            var properties = segment.properties;

            if (properties.trailNames == null) {
                properties.trailNames = [];
            }

            var trailNames = properties.trailNames;

            var index = -1;
            for (var i in trailNames) {
                if (trailNames[i] == trailName) {
                    index = i;
                }
            }

            if (index == -1) {
                trailNames.push(trailName);
            }

            return segment;
        };

        that.addTrailNames = function (trails) {
            for (var i in trails) {
                var trailId = trails[i].properties.id;
                var trailName = trails[i].properties.name;

                var mapEntry = getMapEntry(trailId);

                mapEntry.name = trailName;

                for (var j in mapEntry.features) {
                    var segment = mapEntry.features[j];
                    _addTrailName(segment, trailName);
                }
            }
        };

        var _updateGeoJsonMap = function(segments) {
            for (var i in segments) {
                var segment = segments[i];
                var trailIds = segment.properties.trail_ids;

                for (var j in trailIds) {
                    var trailId = trailIds[j];
                    var mapEntry = getMapEntry(trailId);

                    if (mapEntry.name != null) {
                        _addTrailName(segment, mapEntry.name);
                    }

                    mapEntry.features.push(segment);
                }
            }
        };

        return that;
    };

    return {
        create: _create
    };

})();

module.exports = trailSegmentsFeature;