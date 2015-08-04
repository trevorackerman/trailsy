"use strict";

var geoJsonFilter = (function () {
    var _create = function() {
        var that = {};

        var currentValue;

        that.setCurrentValue = function(value) {
            currentValue = value;
        };

        that.featureFilter = function (feature, key) {
            if (feature.properties == null || feature.properties[key] == null) {
                return false;
            }

            return feature.properties[key].toLowerCase().indexOf(currentValue.toLowerCase()) != -1;
        };

        that.byName = function (feature, layer) {
            return that.featureFilter(feature, "name");
        };

        return that;
    };

    return {
        create: _create
    };
})();

module.exports = geoJsonFilter;
