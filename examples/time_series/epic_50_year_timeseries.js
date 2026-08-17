var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define ROI (e.g., an area in the Amazon that experienced early deforestation)
var roi = ee.Geometry.Point([-122.08, 37.38]).buffer(5000);
Map.centerObject(roi, 11);

// 2. Build the HISTORICAL MSS Time Series (1972 - 1999)
var mss_mosaics = geet.build_annual_mss_timeseries(roi);

// 3. Build the MODERN Landsat Time Series (1985 - 2030)
var modern_mosaics = geet.build_annual_landsat_timeseries(roi);

// 4. Extract NDVI from both and merge them into a single Mega-Series!
// Map over MSS to keep only NDVI and the Year property
var mss_ndvi = mss_mosaics.map(function(img) {
  return img.select('NDVI').set('system:time_start', ee.Date.fromYMD(img.getNumber('year'), 1, 1).millis());
});

// Map over Modern Landsat to keep only NDVI and the Year property
var modern_ndvi = modern_mosaics.map(function(img) {
  return img.select('NDVI').set('system:time_start', ee.Date.fromYMD(img.getNumber('year'), 1, 1).millis());
});

// Merge them! (We filter modern_ndvi from 2000 onwards so they don't overlap in the 80s/90s)
var modern_ndvi_filtered = modern_ndvi.filter(ee.Filter.gte('year', 2000));
var mega_timeseries = mss_ndvi.merge(modern_ndvi_filtered);

// 5. Create an epic time series chart (1972 to Present)
var chart = ui.Chart.image.series({
  imageCollection: mega_timeseries,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 60, // Using 60m because of MSS
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Epic 50-Year NDVI Time Series (Landsat 1 to 9)',
  vAxis: {title: 'NDVI'},
  hAxis: {title: 'Year'},
  lineWidth: 2,
  pointSize: 4,
  colors: ['#2ca02c']
});

print(chart);

// 6. Visualize the contrast on the Map
var past = mss_mosaics.filter(ee.Filter.eq('year', 1985)).first();
var present = modern_mosaics.filter(ee.Filter.eq('year', 2022)).first();

geet.plot(past, 'false_color', '1. Past (1985 MSS)', {bands: ['NIR1', 'RED', 'GREEN'], min: 0, max: 80});
geet.plot(present, 'false_color', '2. Present (2022 OLI)', {bands: ['NIR', 'RED', 'GREEN'], min: 0, max: 0.3});
