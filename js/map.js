"use strict";
var L = require('leaflet');
var Config = require('./config.js');
var trailData = require('./trailData.js');
var trailheads = require('./trailHeads.js');


var trailMap = (function (){
  var elementId = 'trailMapLarge';
  var map = L.map(elementId).setView(Config.mapCenter, Config.defaultZoom);
  var trailheadsLayer;

  map.removeControl(map.zoomControl);
  map.addControl(L.control.zoom({position: 'topright'}));

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
  }).addTo(map);

  return {
    fetchTrailheads: function() {
      trailData.fetchTrailheads(this)
    },
    buildTrailheads: function(geoJson) {
      trailheads.updateGeoJson(geoJson);
      if (trailheadsLayer == null) {
        trailheadsLayer = trailheads.buildTrailheads();
        map.addLayer(trailheadsLayer);
      }
      else {
        trailheads.buildTrailheads();
      }
    },
    filterTrailheads: function(text) {
      map.removeLayer(trailheadsLayer);
      trailheads.clearFilters();
      trailheads.addFilter(text);
      trailheadsLayer = trailheads.buildTrailheads();
      map.addLayer(trailheadsLayer);
    }
  }
})();

module.exports = trailMap;