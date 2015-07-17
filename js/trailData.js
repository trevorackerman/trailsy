"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var trailheads = {};

    return {
        fetchTrailheads: function(consumer) {
            $.getJSON(Config.trailheadEndpoint, function(trailheadResponse){
                var trailheads = trailheadResponse.data;
                for (var i = 0; i < trailheads.length; i++) {
                    trailheads[i].type = 'Feature'
                }
                consumer.addTrailheads(trailheads);
            })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
        }
    }
})();

module.exports = trailData;

