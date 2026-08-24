var geet = require('users/eduardolacerdageo/geet:geet'); 

// ==============================================================================
// EXAMPLE: Advanced Features (STM, kNDVI, FVC, LSU, Time Bands)
// ==============================================================================

// 1. Define a Region of Interest (ROI) - Forest and Agriculture
var roi = ee.Geometry.Point([-52.3, -22.5]).buffer(10000); // Pontal do Paranapanema (Brazil)
Map.centerObject(roi, 11);

// 2. Load a filtered and masked Sentinel-2 Collection (Summer 2023)
var s2_col = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(roi)
  .filterDate('2023-01-01', '2023-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  // Simple cloud mask
  .map(function(img) {
    var scl = img.select('SCL');
    var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
    return img.updateMask(mask);
  });

// Get a clean image (median) for index and unmixing tests
var s2_img = s2_col.median().clip(roi);

// ==============================================================================
// TEST 1: kNDVI (Kernelized NDVI) and FVC (Fractional Vegetation Cover)
// ==============================================================================

// kNDVI deals better with biomass saturation than standard NDVI.
var s2_kndvi = geet.kndvi(s2_img, 'B8', 'B4'); // B8=NIR, B4=RED

// For FVC, we first need the pure NDVI (which already exists in GEET)
var s2_ndvi = s2_img.normalizedDifference(['B8', 'B4']).rename('NDVI');
s2_img = s2_img.addBands(s2_ndvi);
// Calculate Fractional Vegetation Cover (FVC) using default limits 0.15 to 0.90
var s2_fvc = geet.fvc(s2_img, 'NDVI');

Map.addLayer(s2_kndvi.select('kNDVI'), {min: 0, max: 1, palette: ['white', 'green', 'darkgreen']}, '1. kNDVI (Sentinel-2)');
Map.addLayer(s2_fvc.select('FVC'), {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, '2. FVC (Fractional Vegetation Cover)');

// ==============================================================================
// TEST 2: Linear Spectral Unmixing (LSU / unmix)
// ==============================================================================
// Creating typical "fictional" endmembers (e.g., Soil, Vegetation, Water) for RED, NIR, and SWIR1 bands
var endmembers = [
  [800, 1000, 1500],  // Soil Signature (B4, B8, B11)
  [300, 4000, 1000],  // Vegetation Signature
  [200, 100,  50]     // Water Signature
];

var unmixed = geet.unmix(s2_img, ['B4', 'B8', 'B11'], endmembers, ['soil', 'veg', 'water']);
Map.addLayer(unmixed.select(['soil', 'veg', 'water']), {min: 0, max: 1}, '3. Spectral Unmixing (RGB: Soil, Veg, Water)');

// ==============================================================================
// TEST 3: Addition of Time Bands (DOY and Millis)
// ==============================================================================
// Apply the DOY function to each image in the original collection
var s2_col_time = s2_col.map(function(img) {
  return geet.add_doy(geet.add_millis(img));
});

// Check the DOY band of a specific image
var first_img_with_doy = s2_col_time.first().clip(roi);
Map.addLayer(first_img_with_doy.select('DOY'), {min: 1, max: 100, palette: ['blue', 'cyan']}, '4. Time Band (DOY)');
print('Image with time bands added:', first_img_with_doy);

// ==============================================================================
// TEST 4: Spectral-Temporal-Metrics (STM Reducers)
// ==============================================================================
// Let's reduce our entire summer collection (S2_COL) by extracting 
// the 10th, 50th, 90th percentiles, Minimum, Maximum, and Standard Deviation for ALL bands!
var s2_stm = geet.stm_features(s2_col_time);

print('STM Image (Dozens of bands/Features for Machine Learning):', s2_stm);

// Visualizing the 90th Percentile of the NIR band (which indicates maximum cloud-free summer vigor)
Map.addLayer(s2_stm.select('B8_p90').clip(roi), {min: 1000, max: 4000, palette: ['black', 'lightgreen']}, '5. STM: NIR Percentil 90');


// ==============================================================================
// TEST 5: Time Series Gap-Filling & Outlier Removal (RBF)
// ==============================================================================

// Let's first calculate NDVI for our collection
var calculate_ndvi = function(img) {
  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return img.addBands(ndvi);
};

var s2_ndvi_col = s2_col_time.map(calculate_ndvi);

// Remove outliers using a 30-day window and 3 standard deviations
var s2_clean_col = geet.remove_outliers(s2_ndvi_col, 30, 3, ['NDVI']);
print('Cleaned Collection (Outliers Removed):', s2_clean_col);

// Gap fill the series using a Radial Basis Function (RBF)
// Search for valid pixels within a 60-day window, with a Gaussian standard deviation of 16 days
var s2_gap_filled = geet.tsi_rbf(s2_clean_col, 60, 16);
print('Gap Filled Collection (RBF Interpolated):', s2_gap_filled);


// ==============================================================================
// TEST 6: Land Surface Phenology (Polar Vectors)
// ==============================================================================

// Extract Phenology Metrics (Start of Season, Peak of Season, Magnitude) from the gap-filled NDVI series
var phenology = geet.phenology_metrics(s2_gap_filled, 'NDVI');

print('Land Surface Phenology (LSP) Metrics:', phenology);

// The Start of Season (SOS_DOY) returns the day of year!
Map.addLayer(phenology.select('SOS_DOY').clip(roi), {min: 90, max: 270, palette: ['blue', 'green', 'yellow', 'red']}, '6. Phenology: Start of Season (DOY)');

