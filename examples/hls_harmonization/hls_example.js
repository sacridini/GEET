var geet = require('users/eduardolacerdageo/geet:geet');

// Define a Region of Interest (e.g., Mato Grosso do Sul or anywhere)
// We'll use a coordinate near Campo Grande, MS.
var roi = ee.Geometry.Point([-54.62, -20.44]).buffer(10000); 
Map.centerObject(roi, 12);

// 1. Generate the Harmonized Landsat/Sentinel-2 (HLS) Composite
var start_date = '2019-10-01';
var end_date = '2019-10-31';

print('Generating HLS composite for October 2019...');
var hls_composite = geet.build_hls_composite(roi, start_date, end_date);

// The output composite has a median 'ndvi' band computed from all harmonized images
var ndvi_vis = {min: 0, max: 1, palette: ['white', 'green']};
Map.addLayer(hls_composite.select('ndvi'), ndvi_vis, 'HLS Median NDVI');


// 2. Demonstrate using the sub-functions independently
print('Testing independent helper functions...');

// Fetch Landsat 8 Level 2 collection and map the functions
var names_band_in_landsat8 = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'QA_PIXEL'];
var names_band_out_landsat8 = ['blue','green','red','nir', 'swir1', 'swir2', 'qa_band'];

var ls8_c = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(roi)
  .filterDate(start_date, end_date)
  .select(names_band_in_landsat8, names_band_out_landsat8)
  .map(function(img) { return geet.cs_mask_landsat(img, img.select('qa_band')); })
  .map(geet.rescale_landsat_c2) // Rescale to [0, 1] reflectance
  .map(geet.apply_brdf_landsat); // L8 is the anchor, so no band adjustment needed!

// Take the temporal median to guarantee valid pixels across the ROI
var ls8_adjusted = ls8_c.median();

print('Pre-processed L8 Image Collection (Cloud Mask + BRDF + Band Adjusted):', ls8_c);

// Use GEET's smart plot to show the independent Landsat 8 median
geet.plot(ls8_adjusted, 'rgb', 'L8 Harmonized (RGB)', {sensor: 'L8', bands: ['red', 'green', 'blue'], min: 0.0, max: 0.3});
