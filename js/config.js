var mapCenter = [40.00605, -105.26413];
var defaultZoom = 12;

var appId = "6"; // OuterSpatial assigns a unique id for each customer
var url = "http://www.outerspatial.com";
var baseEndpoint = url + "/v0";
var trailsyBaseEndpoint = url + '/api/v0/applications/' + appId;

module.exports = {
  baseEndpoint: baseEndpoint,
  trailEndpoint: trailsyBaseEndpoint + '/cached_trails_csv',
  //trailheadEndpoint: baseEndpoint + "/cached_trailheads",
  trailheadEndpoint: trailsyBaseEndpoint + "/trailheads",
  trailsEndpoint: trailsyBaseEndpoint + "/trails.geojson",
  trailSegmentEndpoint: trailsyBaseEndpoint + "/cached_trail_segments",
  mapCenter: mapCenter,
  defaultZoom: defaultZoom
};
