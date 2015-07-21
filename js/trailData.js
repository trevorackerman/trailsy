"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var trailheads = {};

    return {
        fetchTrailheads: function(trailMap) {
            $.getJSON(Config.trailheadEndpoint, function(trailheadResponse){
                var geoJson = trailheadResponse.data;
                for (var i = 0; i < geoJson.length; i++) {
                    geoJson[i].type = 'Feature'
                }
                trailMap.buildTrailheads(geoJson);
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
        }
    }
})();

module.exports = trailData;

