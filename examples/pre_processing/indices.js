var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(10000);
Map.centerObject(roi, 12);

// Fetch a valid Landsat 8 TOA image
var img = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2019-08-01', '2019-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .first();

// Calculate multiple indices
var indices = geet.landsat_indices(img, 'L8');

// Use GEET's smart plot!
geet.plot(img, 'rgb', 'Original Image (RGB)', {sensor: 'L8'});
geet.plot(indices.select('NDVI'), 'ndvi', 'NDVI Index');
geet.plot(indices.select('NDWI'), 'ndwi', 'NDWI Index');
