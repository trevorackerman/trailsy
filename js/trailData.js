"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var trailheads = {};
    var _fetchTrailheads = function(trailMap, page) {
        if (page === undefined) {
            page = 1
        }

        if (page == 1) {
            trailMap.clearTrailheads();
        }

        $.getJSON(Config.trailheadEndpoint + "/?page=" + page, function(trailheadResponse){
            var paging = trailheadResponse.paging;
            var geoJson = trailheadResponse.data;

            for (var i = 0; i < geoJson.length; i++) {
                geoJson[i].type = 'Feature'
            }

            trailMap.buildTrailheads(geoJson);

            if (!paging.last_page) {
                page++;
                _fetchTrailheads(trailMap, page);
            }
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
    };

    return {
        fetchTrailheads: _fetchTrailheads
    }
})();

module.exports = trailData;

