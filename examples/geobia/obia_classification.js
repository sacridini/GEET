// ==============================================================================
// TEST SCRIPT: GEET OBIA CLASSIFICATION (v1.0)
// ==============================================================================
// Copy and paste this script into the Google Earth Engine Code Editor to test
// the new Object-Based Image Analysis (GEOBIA) pipeline.

var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Setting up a standard Region of Interest (ROI)
var roi = ee.Geometry.Point([-54.8, -10.5]).buffer(10000); 
Map.centerObject(roi, 12);

// 2. Grabbing a Sentinel-2 image
var img = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(roi)
  .filterDate('2020-08-01', '2020-09-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .first()
  .select(['B4', 'B3', 'B2', 'B8']); // RGB + NIR

Map.addLayer(img, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, '1. Original Image (RGB)', false);

// 3. Creating dummy Training Samples
// (Class 1 = Forest/Vegetation, Class 2 = Bare Soil / Deforestation)
var samples = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-54.81, -10.51]), {'class': 1}), // Veg
  ee.Feature(ee.Geometry.Point([-54.79, -10.49]), {'class': 1}), // Veg
  ee.Feature(ee.Geometry.Point([-54.82, -10.48]), {'class': 2}), // Bare
  ee.Feature(ee.Geometry.Point([-54.78, -10.52]), {'class': 2})  // Bare
]);

// 4. Running the full GEOBIA Pipeline!
print('Running OBIA Classification...');
var obia_results = geet.obia_classification(img, samples, 'class', {
    snicSize: 20,           // Size of superpixels
    snicCompactness: 1,     // Compactness
    includeGeometry: true,  // Adds Area, Perimeter, and Shape Index
    includeTexture: true,   // Adds GLCM Texture (Entropy, Contrast, etc.)
    classifier: 'rf',       // Random Forest
    scale: 10               // Sentinel-2 scale
});

print('OBIA Results generated!', obia_results);

// 5. Visualizing the Results
var clusters = obia_results.select('clusters');
var classified = obia_results.select('classification');

Map.addLayer(clusters.randomVisualizer(), {}, '2. SNIC Superpixels', false);
Map.addLayer(classified, {min: 1, max: 2, palette: ['green', 'red']}, '3. OBIA Classification');

print('Done! The image was classified by Objects, not by Pixels.');
