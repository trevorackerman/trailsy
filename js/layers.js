"use strict";
var L = require('leaflet');

var layers = (function (){
    var trailheadIcon = L.icon({
        iconUrl: 'img/icon_trailhead_active.png',
        iconSize:     [38, 38], // size of the icon
        iconAnchor:   [19, 37], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });

    return {
        addTrailheads: function(trailheads, map) {
            var trailheadLayer = L.geoJson(trailheads, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: trailheadIcon});
                },

                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.name + " @ " +
                        feature.geometry.coordinates);
                }
            });
            trailheadLayer.addTo(map);
        }
    }
})();

module.exports = layers;