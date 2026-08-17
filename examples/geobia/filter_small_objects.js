var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(5000);
Map.centerObject(roi, 12);

// Filter Small Objects from a classification image
// (Simulating a classification image)
var img = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(roi)
  .filterDate('2020-01-01', '2021-01-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .first();
var ndvi = geet.sentinel2_indices(img, 'ndvi');
var classification = ndvi.gt(0.4); // Simple threshold classification

Map.addLayer(classification, {min: 0, max: 1}, 'Original Classification');

// Apply filter small objects (minimum mapping unit)
var filtered = geet.filter_small_objects(classification, 100); // 100 pixels

Map.addLayer(filtered, {min: 0, max: 1}, 'Filtered Classification');
