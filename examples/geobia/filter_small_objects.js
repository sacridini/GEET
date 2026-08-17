var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(5000);
Map.centerObject(roi, 12);

// Filter Small Objects from a classification image
// (Simulating a classification image)
var img = ee.Image('COPERNICUS/S2_SR/20200801T133231_20200801T133227_T22KGV');
var ndvi = geet.sentinel2_indices(img, 'ndvi');
var classification = ndvi.gt(0.4); // Simple threshold classification

Map.addLayer(classification, {min: 0, max: 1}, 'Original Classification');

// Apply filter small objects (minimum mapping unit)
var filtered = geet.filter_small_objects(classification, 100); // 100 pixels

Map.addLayer(filtered, {min: 0, max: 1}, 'Filtered Classification');
