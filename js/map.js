"use strict";
var L = require('leaflet');
var Config = require('./config.js');
var trailData = require('./trailData.js');
var trailheads = require('./trailHeads.js');
var trails = require('./trails.js');

var trailMap = (function (){
  var elementId = 'trailMapLarge';
  var map = L.map(elementId).setView(Config.mapCenter, Config.defaultZoom);
  var trailheadsLayer;
  var trailLayers = [];
  var trailLayerOptions = {
    style: {
      color: "#678729",
      weight: 3,
      opacity: 1,
      clickable: false,
      smoothFactor: 1.0
    }};

  map.removeControl(map.zoomControl);
  map.addControl(L.control.zoom({position: 'topright'}));

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
  }).addTo(map);


  function showTrails(e) {
    for (var i = 0; i < trailLayers.length; i++) {
      map.removeLayer(trailLayers[i]);
    }
    trailLayers.length = 0;

    var markerLayer = e.target;
    var feature = markerLayer.feature;
    var trailIds = trailheads.getTrails(feature.id);

    for (var i = 0; i < trailIds.length; i++) {
      var trailId = trailIds[i];
      var trailsGeoJson = trails.getTrailGeoJson(trailId);
      trailLayers.push(L.geoJson(trailsGeoJson, trailLayerOptions));
    }

    for (var i = 0; i < trailLayers.length; i++) {
      map.addLayer(trailLayers[i]);
    }
  }

  trailheads.setTrailMarkerClickHandler(showTrails);

  return {
    fetchTrailheads: function() {
      trailData.fetchTrailheads(this);
      trailData.fetchTrails(this);
    },
    clearTrailheads: function () {
      if (trailheadsLayer == null) {
        return;
      }

      map.removeLayer(trailheadsLayer);
      trailheadsLayer = null;
    },
    buildTrailheads: function(geoJson) {
      this.clearTrailheads();
      trailheads.updateGeoJson(geoJson);
      trailheadsLayer = trailheads.buildTrailheads();
      map.addLayer(trailheadsLayer);
    },
    filterTrailheads: function(text) {
      this.clearTrailheads();
      trailheads.clearFilters();
      trailheads.addFilter(text);
      trailheadsLayer = trailheads.buildTrailheads();
      map.addLayer(trailheadsLayer);
    },
    addTrailsData: function(geoJson) {
      trails.updateGeoJson(geoJson);
    }
  }
})();

module.exports = trailMap;