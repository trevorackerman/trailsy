"use strict";

var openTrailLayer = require('./openTrailLayer.js');

var trailSegmentsLayer = (function() {
    var _create = function() {
        var spec = {
            layerOptions: {
                filter: function(feature, layer) {
                    return false;
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("<h5>" + feature.properties.trailNames + "</h5>");
                },
                style: {
                    color: "#678729",
                    weight: 3,
                    opacity: 1,
                    smoothFactor: 1.0
                }
            }
        };

        var trailHeads;
        var trailSegments;
        var that = openTrailLayer.create(spec);

        that.setTrailHeads = function(tHeads) {
            trailHeads = tHeads;
        };

        that.setTrailSegments = function (tSegments) {
            trailSegments = tSegments;
            that.setOpenTrailFeature(trailSegments);
        };

        that.buildForTrailhead = function(trailHeadId) {
            var trailIds = trailHeads.getTrails(trailHeadId);
            trailSegments.setCurrentTrails(trailIds);
            return that.build();
        };

        return that;
    };

    return {
        create: _create
    };
})();

module.exports = trailSegmentsLayer;