"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var fetchingTrailSegments = false;
    var fetchingTrailHeads = false;
    var _fetchTrailSegments = function(trailMap, page) {
        fetchingTrailSegments = true;
        if (page === undefined) {
            page = 1
        }

        $.getJSON(Config.trailSegmentsEndpoint + "/?page=" + page, function(trailsResponse){
            var paging = trailsResponse.paging;
            var geoJson = trailsResponse.data.features;

            trailMap.addTrailSegmentsData(geoJson);

            if (!paging.last_page) {
                page++;
                _fetchTrailSegments(trailMap, page);
            }
            else {
                fetchingTrailSegments = false;
            }
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
    };

    var _fetchTrailheads = function(trailMap, page) {
        fetchingTrailHeads = true;
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
            else {
                fetchingTrailHeads = false;
            }
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
    };

    return {
        fetchTrailheads: _fetchTrailheads,
        fetchTrailSegments: _fetchTrailSegments,
        isFetchingTrailheads: function() {
            return fetchingTrailHeads == true;
        },
        isFetchingTrailSegments: function() {
            return fetchingTrailSegments == true;
        }
    }
})();

module.exports = trailData;

