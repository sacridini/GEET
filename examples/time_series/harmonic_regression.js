var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define a Region of Interest (e.g. an agricultural area)
var roi = ee.Geometry.Point([-52.2, -12.5]).buffer(5000); // Mato Grosso, Brazil
Map.centerObject(roi, 12);

// 2. Get a 5-year time series of NDVI
// We map the ndvi_l8 function over the collection to ensure the NDVI band exists
var timeseries = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(roi)
    .filterDate('2018-01-01', '2023-12-31')
    .map(function(img) { return img.addBands(img.normalizedDifference(['B5', 'B4']).rename('NDVI')) })
    .map(function (image) { return geet.cloudmask(image); });

// 3. Run the Harmonic Regression!
// We ask for 2 harmonics because this region often has double-cropping (2 seasons per year).
var num_harmonics = 2;
var trend = geet.harmonic_trend(timeseries, 'NDVI', num_harmonics);

// The `trend` image contains coefficients, phase, and amplitude for each harmonic.

// 4. Visualizing Phase and Amplitude (Harmonic 1: Annual cycle)
// Phase tells us WHEN the peak of the season occurs.
// Amplitude tells us HOW STRONG the vegetation growth is.
var hsv = ee.Image.cat([
  trend.select('phase_1').unitScale(-Math.PI, Math.PI), // Hue (Time of peak)
  trend.select('amplitude_1').multiply(2.5),            // Saturation (Vigor)
  trend.select('constant')                              // Value (Overall mean NDVI)
]).hsvToRgb();

Map.addLayer(hsv.clip(roi), {}, 'Seasonality (Phase/Amp/Mean)');

// 5. Visualizing the Second Harmonic (Double-cropping)
Map.addLayer(trend.select('amplitude_2').clip(roi), {min: 0, max: 0.15, palette: ['black', 'yellow', 'green']}, 'Double-Crop Vigor (Amp 2)', false);
