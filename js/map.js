"use strict";
var L = require('leaflet');
var Config = require('./config.js');
var trailData = require('./trailData.js');
var trailheads = require('./trailHeadsLayer.js');
var trailSegments = require('./trailSegments.js');
var trailSegmentsLayer = require('./trailSegmentsLayer.js');

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


  function removeTrails() {
    trailSegmentsLayer.removeFrom(map);
    trailSegmentsLayer.clear();
  }

  function addTrailsForTrailhead(markerLayer, trailheadId) {
    var layers = trailSegmentsLayer.buildSegmentsLayerForTrailhead(trailheadId);

    if (layers.length == 0) {
      var popup = L.popup()
          .setLatLng(markerLayer.getLatLng())
          .setContent('<p>Busy retrieving trails for ' + markerLayer.feature.properties.name + '<br />Click again in a few seconds.</p>')
          .openOn(map);
      return;
    }

    for (var i in layers) {
      map.addLayer(layers[i]);
    }
  }

  function showTrails(e) {
    removeTrails();
    var markerLayer = e.target;
    var feature = markerLayer.feature;
    addTrailsForTrailhead(markerLayer, feature.properties.id);
  }

  var _clearTrailheads = function () {
    if (trailheadsLayer == null) {
      return;
    }

    map.removeLayer(trailheadsLayer);
    trailheadsLayer = null;
  };

  var _buildTrailheads = function(geoJson) {
    _clearTrailheads();
    trailheads.updateGeoJson(geoJson);
    trailheadsLayer = trailheads.buildTrailheads();
    map.addLayer(trailheadsLayer);
  };

  var _addTrailSegmentsData = function(geoJson) {
    trailSegments.updateGeoJson(geoJson.features);
  };

  var _addTrailNames = function(geoJson) {
    trailSegments.addTrailNames(geoJson.features);
  };

  var _fetchTrailheads = function () {
    _clearTrailheads();
    trailData.fetchTrailheads(_buildTrailheads);
    trailData.fetchTrailSegments(_addTrailSegmentsData);
    trailData.fetchTrailNames(_addTrailNames);
  };

  trailheads.setTrailMarkerClickHandler(showTrails);

  return {
    fetchTrailheads: _fetchTrailheads,
    filterTrailheads: function(text) {
      removeTrails();
      _clearTrailheads();
      trailheads.clearFilters();
      trailheads.addFilter(text);
      trailheadsLayer = trailheads.buildTrailheads();
      map.addLayer(trailheadsLayer);
    }
  }
})();

module.exports = trailMap;