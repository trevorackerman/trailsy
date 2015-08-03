var geoJson = (function () {

    var _featureFilter = function (feature, key, value) {
        if (feature.properties == null || feature.properties[key] == null) {
            return false;
        }

        return feature.properties[key].toLowerCase().indexOf(value.toLowerCase()) != -1;
    };

    var _filterByName = function (feature, value) {
        return _featureFilter(feature, "name", value);
    };

    return {
        featureFilter: _featureFilter,
        filterByName: _filterByName
    }
})();

module.exports = geoJson;