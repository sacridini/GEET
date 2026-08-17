var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define a ROI in a highly mountainous region (e.g., The Andes, Peru)
var roi = ee.Geometry.Point([-72.545, -13.163]).buffer(20000); // Near Machu Picchu
Map.centerObject(roi, 11);

// ==========================================
// A. TOPOGRAPHIC ILLUMINATION CORRECTION
// ==========================================

// Load a Landsat 8 image over the mountains
var img = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2021-05-01', '2021-09-30')
  .sort('CLOUD_COVER')
  .first()
  .clip(roi);

// Apply GEET Topographic Correction
var corrected_img = geet.topographic_correction(img);

// Visualize the Before & After
Map.addLayer(img, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, '1. Original Image (with Shadows)');
Map.addLayer(corrected_img, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, '2. Topographically Corrected Image');


// ==========================================
// B. ADVANCED TERRAIN INDICES
// ==========================================

// Calculate Topographic Wetness Index (TWI)
var twi = geet.calculate_twi(roi);
Map.addLayer(twi, {min: 3, max: 15, palette: ['red', 'yellow', 'green', 'blue', 'darkblue']}, '3. Topographic Wetness Index (TWI)');


// Calculate Topographic Position Index (TPI) & Terrain Ruggedness Index (TRI)
var terrain_indices = geet.calculate_tpi_tri(roi);
var tpi = terrain_indices.select('TPI');
var tri = terrain_indices.select('TRI');

// TPI visualization: Red = Ridges/Peaks, Blue = Valleys
Map.addLayer(tpi, {min: -30, max: 30, palette: ['blue', 'white', 'red']}, '4. Topographic Position Index (TPI)');

// TRI visualization: White = Flat, Black/Dark = Highly Rugged
Map.addLayer(tri, {min: 0, max: 50, palette: ['ffffff', 'ffaa00', 'cc0000', '000000']}, '5. Terrain Ruggedness Index (TRI)');


// ==========================================
// C. DRAINAGE / STREAM EXTRACTION
// ==========================================

// Extract the river network (Threshold 1000 pixels of flow accumulation)
var rivers = geet.extract_drainage(roi, 1000);
Map.addLayer(rivers, {palette: ['00ffff']}, '6. Extracted Drainage Network');

// Tip: You can toggle the layers in the Map window to see how 
// the rivers align perfectly with the blue valley zones in the TPI map!
