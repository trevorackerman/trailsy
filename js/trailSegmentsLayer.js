"use strict";

var trailSegments = require('./trailSegments.js');
var trailHeadsLayer = require('./trailHeadsLayer.js');

var trailSegmentsLayer = (function() {
    var segmentLayers = [];

    var _segmentLayerOptions = {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h5>" + feature.properties.trailNames + "</h5>");
        },
        style: {
            color: "#678729",
            weight: 3,
            opacity: 1,
            smoothFactor: 1.0
        }};

    var _buildSegmentsLayerForTrailhead = function(trailheadId) {
        var trailIds = trailHeadsLayer.getTrails(trailheadId);
        for (var i in trailIds) {
            var trailId = trailIds[i];
            var segmentsGeoJson = trailSegments.getSegmentsGeoJson(trailId);
            for (var j in segmentsGeoJson.segments) {
                var segment = segmentsGeoJson.segments[j];
                segmentLayers.push(L.geoJson(segment, _segmentLayerOptions));
            }
        }

        return segmentLayers;
    };

    var _removeFrom = function(that) {
        for (var i in segmentLayers) {
            that.removeLayer(segmentLayers[i]);
        }
    };

    var _clear = function() {
        segmentLayers.length = 0;
    };

    return {
        buildSegmentsLayerForTrailhead: _buildSegmentsLayerForTrailhead,
        removeFrom: _removeFrom,
        clear: _clear
    }
})();

module.exports = trailSegmentsLayer;