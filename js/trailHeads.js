"use strict";
var L = require('leaflet');

var trailheads = (function (){
    var layer = {};
    var geoJson = [];
    var trailheadIcon = L.icon({
        iconUrl: 'img/icon_trailhead_active.png',
        iconSize:     [40, 41], // size of the icon
        iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
        shadowUrl: 'img/icon_trailhead_shadow.png',
        shadowSize: [90, 30],
        shadowAnchor: [-2,25],
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
        for (var i = 0; i < trailhead.trailhead_attributes.length; i++) {
            var name = trailhead.trailhead_attributes[i].attribute.name;
            var value = trailhead.trailhead_attributes[i].value;

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
        return "<h5>" + trailhead.name + "</h5>" + getTrailheadAmenities(trailhead);
    };

    var layerOptions = {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: trailheadIcon});
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(generatePopupContent(feature));
        }
    };

    return {
        clear: function() {
            if (geoJson.length == null) {
                return;
            }
            geoJson = [];
            layer = {};
        },
        updateGeoJson: function(data) {
            geoJson = geoJson.concat(data);
            return this;
        },
        buildTrailheads: function() {
            layer = L.geoJson(geoJson, layerOptions);
            return layer;
        },
        addFilter: function(text) {
            layerOptions.filter = function (feature, layer) {
                return (feature.name.toLowerCase().indexOf(text.toLowerCase()) != -1);
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