"use strict";
var L = require('leaflet');

var trailheads = (function (){
    var layer;
    var geoJson;
    var trailheadIcon = L.icon({
        iconUrl: 'img/icon_trailhead_active.png',
        iconSize:     [38, 38], // size of the icon
        iconAnchor:   [19, 37], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });

    return {
        updateGeoJson: function (data) {
            geoJson = data;
            return this;
        },
        buildTrailheads: function() {
            layer = L.geoJson(geoJson, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: trailheadIcon});
                },

                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.name + " @ " +
                        feature.geometry.coordinates);
                }
            });
            return layer;
        }
    }
})();

module.exports = trailheads;