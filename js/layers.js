var L = require('leaflet');
var $ = require('jquery');

var Config = require('./config.js');
var map = require('./map.js');

var trailheadIcon = L.icon({
    iconUrl: 'img/icon_trailhead_active.png',
    iconSize:     [38, 38], // size of the icon
    iconAnchor:   [19, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});


var layers = {};

var start = new Date().getTime();

console.log("fetching trailheads");
$.getJSON(Config.trailheadEndpoint, function(trailheadResponse){
    var time1 = new Date().getTime();
    console.log("Got data in " + (time1 - start) + " msec");

    var trailheadFeatures = trailheadResponse.data;
    for (var i = 0; i < trailheadFeatures.length; i++) {
        trailheadFeatures[i].type = 'Feature'
    }

    var layer = L.geoJson(trailheadFeatures, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: trailheadIcon});
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.name + " @ " +
                feature.geometry.coordinates);
        }
    });

    layer.addTo(map);
    layers.trailheads = layer;
})
.fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});


//$.getJSON(Config.trailSegmentEndpoint, function(data){
//    var layer = L.geoJson(data, {});
//
//    layer.addTo(map);
//    layers.trailSegments = layer;
//});

module.exports = layers;