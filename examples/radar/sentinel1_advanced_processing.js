var geet = require('users/eduardolacerdageo/geet:geet');

// Define a Region of Interest (e.g., a region in Rio Grande do Sul, Brazil)
var roi = ee.Geometry.Point([-51.2, -29.8]).buffer(15000);
Map.centerObject(roi, 11);
Map.addLayer(roi, {color: 'red'}, 'ROI', false);

// ==============================================================================
// 1. TERRAIN FLATTENING & SPECKLE FILTERING
// ==============================================================================
print('Applying Terrain Flattening and Lee Speckle Filter...');

// Load a single Sentinel-1 image over a mountainous region
var s1_mountain = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2023-01-01', '2023-12-31')
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

// Let's map the historical floods in Rio Grande do Sul (Brazil) in May 2024
var pre_flood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2023-01-01', '2024-04-20') // Massive baseline to guarantee data
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .median();

var post_flood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate('2024-05-01', '2024-06-30') // Expanded flood peak window
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .median();

// Run the Flood Mapping function
// We look for a -3.0 dB drop in backscatter, apply a 50m smoothing radius, using 'VV' band
// It automatically masks out permanent rivers and lakes using the JRC Global Surface Water dataset!
var flooded_area = geet.s1_flood_mapping(pre_flood, post_flood, -3.0, 50, 'VV');

Map.addLayer(pre_flood, {min: -20, max: 0}, '4. Pre-Flood SAR', false);
Map.addLayer(post_flood, {min: -20, max: 0}, '5. Post-Flood SAR', false);

// Display the flooded areas in bright cyan
Map.addLayer(flooded_area, {palette: ['00FFFF']}, '6. Flooded Areas Mask');
