"use strict";
var L = require('leaflet');
var trailData = require("./trailData.js");
var trails = require("./trails.js");

var trailheads = (function (){
    var layer = {};
    var geoJson = [];
    var trailheadsToTrailsMap = {};
    var trailheadMarkerClickHandler = null;

    var trailheadIcon = L.icon({
        iconUrl: 'img/icon_trailhead_active.png',
        iconSize:     [40, 41], // size of the icon
        iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
        shadowUrl: 'img/icon_trailhead_shadow.png',
        shadowSize: [90, 30],
        shadowAnchor: [0,27],
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });

    var amenityIconMap = {
        "Drinking Water": ["icon_drinking_water_green.png", "icon_drinking_water_no.png"],
        "Kiosk":          ["icon_kiosk_green.png", "icon_kiosk_no.png"],
        "Parking":        ["icon_parking_green.png", "icon_parking_no.png"],
        "Restrooms":      ["icon_restroom_green.png", "icon_restroom_no.png"]
    };

    var getTrailheadAmenities = function(trailhead) {
        var amenityContent = "";
        var amenities = trailhead.properties.trailhead_attributes;
        for (var i = 0; i < amenities.length; i++) {
            var name = amenities[i].attribute.name;
            var value = amenities[i].value;

            if (amenityIconMap[name] != null) {
                amenityContent += "<img class='popup-icon' src='img/";
                if (value == "yes") {
                    amenityContent += amenityIconMap[name][0];
                }
                else {
                    amenityContent += amenityIconMap[name][1];
                }
                amenityContent += "'/>";
            }
        }
        return amenityContent;
    };

    var generatePopupContent = function(trailhead) {
        return "<h5>" + trailhead.properties.name + "</h5>" + getTrailheadAmenities(trailhead);
    };

    var layerOptions = {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: trailheadIcon});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(generatePopupContent(feature));
            layer.on({
                click: trailheadMarkerClickHandler
            });
        }
    };

    return {
        setTrailMarkerClickHandler: function(handler) {
            trailheadMarkerClickHandler = handler;
        },
        getTrails: function(trailheadId) {
            return trailheadsToTrailsMap[trailheadId];
        },
        clear: function() {
            if (geoJson.length == null) {
                return;
            }
            geoJson = [];
            layer = {};
            trailheadsToTrailsMap = {};
        },
        updateGeoJson: function(data) {
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var trailheadId = features[i].properties.id;
                var trailIds = features[i].properties.trail_ids;
                trailheadsToTrailsMap[trailheadId] = trailIds;
            }
            geoJson = geoJson.concat(data);
            return this;
        },
        buildTrailheads: function() {
            layer = L.geoJson(geoJson, layerOptions);
            return layer;
        },
        addFilter: function(text) {
            layerOptions.filter = function (feature, layer) {
                return (feature.properties.name.toLowerCase().indexOf(text.toLowerCase()) != -1);
            }
        },
        clearFilters: function() {
            layerOptions.filter = function (feature, layer) {
                return true;
            }
        }
    }
})();

module.exports = trailheads;