"use strict";

var trailSegments = require('./trailSegments.js');
var trailHeads = require('./trailHeads.js');

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

    var _buildForTrailhead = function(trailHeadId) {
        var trailIds = trailHeads.getTrails(trailHeadId);
        for (var i in trailIds) {
            var trailId = trailIds[i];
            var segments = trailSegments.getSegmentsForTrail(trailId);
            for (var j in segments) {
                var segment = segments[j];
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
        buildForTrailhead: _buildForTrailhead,
        removeFrom: _removeFrom,
        clear: _clear
    }
})();

module.exports = trailSegmentsLayer;