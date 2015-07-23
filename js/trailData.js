"use strict";
var Config = require('./config.js');
var start = new Date().getTime();

var trailData = (function (){
    var fetchingTrailSegments = false;
    var fetchingTrailHeads = false;
    var _fetchTrailSegments = function(callback, page) {
        fetchingTrailSegments = true;
        if (page === undefined) {
            page = 1
        }

        $.getJSON(Config.trailSegmentsEndpoint + "/?page=" + page, function(trailsResponse){
            var paging = trailsResponse.paging;
            var geoJson = trailsResponse.data.features;

            //trailMap.addTrailSegmentsData(geoJson);
            callback(geoJson);

            if (!paging.last_page) {
                page++;
                _fetchTrailSegments(callback, page);
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

    var _fetchTrailheads = function(callback, page) {
        fetchingTrailHeads = true;
        if (page === undefined) {
            page = 1
        }

        $.getJSON(Config.trailheadEndpoint + "/?page=" + page, function(trailheadResponse){
            var paging = trailheadResponse.paging;
            var geoJson = trailheadResponse.data;

            callback(geoJson);

            if (!paging.last_page) {
                page++;
                _fetchTrailheads(callback, page);
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

