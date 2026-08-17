// ==============================================================================
// TEST SCRIPT: GEET SMART PLOT VISUALIZATION (v1.0)
// ==============================================================================
// Copy and paste this script into the Google Earth Engine Code Editor to test
// the new unified geet.plot() function.

var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Setting up a standard Region of Interest (ROI)
var roi = ee.Geometry.Point([-54.8, -10.5]).buffer(15000); 
Map.centerObject(roi, 11);

// 2. Grabbing a Landsat 8 image (TOA)
var img_l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2020-08-01', '2020-09-30')
  .filter(ee.Filter.lt('CLOUD_COVER', 5))
  .first();

// 3. Calculating Indices using GEET
var indices = geet.landsat_indices(img_l8, 'L8', 'all');
var ndvi = indices.select('NDVI');
var ndwi = indices.select('NDWI');

// ==============================================================================
// 4. THE MAGIC OF GEET.PLOT()
// ==============================================================================

// Example A: Plotting RGB for Landsat 8
// Notice we don't need to pass bands or min/max. We just pass {sensor: 'L8'}
geet.plot(img_l8, 'rgb', '1. Landsat 8 RGB', {sensor: 'L8'});

// Example B: Plotting False Color for Landsat 8 (NIR, R, G)
geet.plot(img_l8, 'false_color', '2. Landsat 8 False Color', {sensor: 'L8'});

// Example C: Plotting NDVI
// GEET automatically applies the standard green-yellow-red palette and normalizes from -1 to 1!
geet.plot(ndvi, 'ndvi', '3. Vegetation (NDVI)');

// Example D: Plotting NDWI
// GEET automatically applies the standard blue-white-brown palette and normalizes from -1 to 1!
geet.plot(ndwi, 'ndwi', '4. Water (NDWI)');

// Example E: K-Means Classification (Unsupervised)
// Generating a quick classification map with 5 classes to show the discrete palette
var kmeans_class = geet.kmeans(img_l8.select(['B4', 'B3', 'B2', 'B5']), roi, 5, 30);
// GEET automatically pulls a random diverse palette perfect for categorical maps!
geet.plot(kmeans_class, 'class', '5. K-Means (5 Classes)');

print('All layers plotted successfully using the new geet.plot() function!');
