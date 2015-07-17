var trailData = require('./trailData.js');
var layers = require('./layers.js');
var trailMap = require('./map.js');

trailMap.trailData = trailData;
trailMap.layers = layers;
trailMap.fetchTrailheads();