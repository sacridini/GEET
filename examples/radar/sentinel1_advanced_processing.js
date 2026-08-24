var geet = require('users/eduardolacerdageo/geet:geet');

// Define a Region of Interest (e.g., Houston, Texas - Hurricane Harvey 2017)
var roi = ee.Geometry.Point([-95.3, 29.8]).buffer(50000);
Map.centerObject(roi, 10);
Map.addLayer(roi, {color: 'red'}, 'ROI', false);

// ==============================================================================
// 1. TERRAIN FLATTENING & SPECKLE FILTERING
// ==============================================================================
print('Applying Terrain Flattening and Lee Speckle Filter...');

// Load a single Sentinel-1 image over a mountainous region
var s1_mountain = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2017-01-01', '2017-12-31')
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV', 'angle'])
  .first();

// Apply Radiometric Terrain Flattening (Converts Sigma0 to Gamma0 using Copernicus DEM)
var s1_flat = geet.s1_terrain_flattening(s1_mountain);

// Apply Adaptive Lee Speckle Filter (kernel size 3) to smooth the noise but preserve edges
var s1_lee = geet.s1_lee_filter(s1_flat, 3);

// Compare the visualizations (Toggle them on/off in the Map Layers tab)
Map.addLayer(s1_mountain.select('VV'), {min: -20, max: 0}, '1. Original SAR (Sigma0)', false);
Map.addLayer(s1_flat.select('VV'), {min: -20, max: 0}, '2. Terrain Flattened (Gamma0)', false);
Map.addLayer(s1_lee.select('VV'), {min: -20, max: 0}, '3. Lee Filtered (Smoothed)', false);


// ==============================================================================
// 2. FLOOD MAPPING (CHANGE DETECTION)
// ==============================================================================
print('Running Flood Detection Algorithm...');

// Let's map the catastrophic floods of Hurricane Harvey in Texas (August 2017)
var pre_flood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2017-08-01', '2017-08-20') // Before floods
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) // CRITICAL to avoid false positives!
  .select('VV')
  .mosaic(); 

var post_flood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2017-08-25', '2017-09-05') // Peak floods (Hurricane Harvey)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) // CRITICAL to avoid false positives!
  .select('VV')
  .mosaic(); 

// Run the Flood Mapping function using 'VV' band
var flooded_area = geet.s1_flood_mapping(pre_flood, post_flood, -4.0, 50, 'VV');

Map.addLayer(pre_flood, {min: -20, max: 0}, '4. Pre-Flood SAR', false);
Map.addLayer(post_flood, {min: -20, max: 0}, '5. Post-Flood SAR', false);

// Display the flooded areas in bright cyan
Map.addLayer(flooded_area, {palette: ['00FFFF']}, '6. Flooded Areas Mask');
