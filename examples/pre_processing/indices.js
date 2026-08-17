var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(5000);
Map.centerObject(roi, 12);

var img = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_221071_20190805');

// Calculate multiple indices
var indices = geet.landsat_indices(img, 'L8');

Map.addLayer(indices.select('NDVI'), {min: 0, max: 1, palette: ['white', 'green']}, 'NDVI');
Map.addLayer(indices.select('NDWI'), {min: -1, max: 1, palette: ['white', 'blue']}, 'NDWI');
