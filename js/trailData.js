"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var _fetchTrails = function(trailMap, page) {
        if (page === undefined) {
            page = 1
        }

        $.getJSON(Config.trailsEndpoint + "/?page=" + page, function(trailsResponse){
            var paging = trailsResponse.paging;
            var geoJson = trailsResponse.data.features;

            trailMap.addTrailsData(geoJson);

            if (!paging.last_page) {
                page++;
                _fetchTrails(trailMap, page);
            }
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
    };

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
        fetchTrailheads: _fetchTrailheads,
        fetchTrails: _fetchTrails
    }
})();

module.exports = trailData;

