"use strict";
var L = require('leaflet');
var Config = require('./config.js');
var trailData = require('./trailData.js');
var trailHeadsFeature = require('./trailHeadsFeature.js');
var trailHeadsLayer = require('./trailHeadsLayer.js');
var trailSegmentsFeature = require('./trailSegmentsFeature.js');
var trailSegmentsLayer = require('./trailSegmentsLayer.js');
var trailSegmentsFilter = require('./trailSegmentsFilter.js');
var geoJsonFilter = require('./geoJsonFilter.js');

var trailMap = (function (){
  var elementId = 'trailMapLarge';
  var map = L.map(elementId).setView(Config.mapCenter, Config.defaultZoom);
  var thLayer = trailHeadsLayer.create();
  var tsLayer = trailSegmentsLayer.create();
  var tHeads = trailHeadsFeature.create();
  var tSegments = trailSegmentsFeature.create();
  var tSegmentsFilter = trailSegmentsFilter.create();

  thLayer.setOpenTrailFeature(tHeads);
  tsLayer.setTrailHeads(tHeads);
  tsLayer.setTrailSegments(tSegments);

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
    tsLayer.removeFrom(map);
    tsLayer.clear();
  }

  function buildTrailSegments() {
    var layers = tsLayer.build();
    for (var i in layers) {
      map.addLayer(layers[i]);
    }
  }

  function showTrails(e) {
    removeTrails();
    var markerLayer = e.target;
    tSegmentsFilter.setCurrentTrailHead(markerLayer.feature);
    tsLayer.setFilter(tSegmentsFilter.filterByTrailhead);
    buildTrailSegments();
  }

  var _unfilter = function(feature, layer) {
    return true;
  };

  var _addTrailSegmentsData = function(geoJson) {
    tSegments.updateGeoJson(geoJson.features);
  };

  var _addTrailNames = function(geoJson) {
    tSegments.addTrailNames(geoJson.features);
  };

  var _fetchTrailheads = function () {
    thLayer.removeFrom(map);
    thLayer.clear();
    trailData.fetchTrailheads(_buildTrailheads);
    trailData.fetchTrailSegments(_addTrailSegmentsData);
    trailData.fetchTrailNames(_addTrailNames);
  };

  var _buildTrailheadLayers = function() {
    var layers = thLayer.build();
    for (var i in layers) {
      map.addLayer(layers[i]);
    }
  };

  var _buildTrailheads = function(geoJson) {
    thLayer.removeFrom(map);
    tHeads.updateGeoJson(geoJson);
    _buildTrailheadLayers();
  };

  var _filterTrailheads = function(text) {
    removeTrails();
    thLayer.removeFrom(map);
    thLayer.clear();

    var filter = geoJsonFilter.create();
    filter.setCurrentValue(text);
    thLayer.setFilter(filter.byName);

    var filter2 = geoJsonFilter.create();
    filter2.setCurrentValue(text);
    filter2.setCurrentKey("trailNames");
    tsLayer.setFilter(filter2.byProperty);

    _buildTrailheadLayers();
    buildTrailSegments();
  };

  var _clearFilters = function() {
    removeTrails();
    thLayer.removeFrom(map);
    thLayer.setFilter(_unfilter);
    thLayer.clear();

    _buildTrailheadLayers();
  };

  thLayer.setClickHandler(showTrails);

  return {
    fetchTrailheads: _fetchTrailheads,
    filterTrailheads: _filterTrailheads,
    clearFilters: _clearFilters
  }
})();

module.exports = trailMap;