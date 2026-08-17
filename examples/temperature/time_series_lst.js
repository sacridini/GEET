var geet = require('users/eduardolacerdageo/geet:geet');

// Define a Region of Interest (e.g., a city to see the Urban Heat Island effect)
var roi = ee.Geometry.Point([-46.633, -23.550]).buffer(15000); // São Paulo
Map.centerObject(roi, 11);

// Build a RAW time series of ALL Landsat images from 1985 to 2023!
// We use the raw TOA collection so we don't lose the satellite metadata (SPACECRAFT_ID, K1/K2 constants)
var timeseries = geet.landsat_timeseries_by_roi('TOA', roi).filterDate('1985-01-01', '2023-12-31');

// ---------------------------------------------------------
// NEW CAPABILITY: Calculate LST for the ENTIRE time series
// ---------------------------------------------------------
// Map the unified `calculate_lst` function over all 38 years of data!
var lst_timeseries = timeseries.map(geet.calculate_lst);

// Let's visualize the results!
// 1. Show the LST from 1985 (Landsat 5)
var lst_1985 = lst_timeseries.filterDate('1985-01-01', '1985-12-31').first().select('LST');
Map.addLayer(lst_1985.clip(roi), {min: 15, max: 40, palette: ['blue', 'green', 'yellow', 'orange', 'red']}, 'LST 1985 (L5)', false);

// 2. Show the LST from 2023 (Landsat 8/9)
var lst_2023 = lst_timeseries.filterDate('2023-01-01', '2023-12-31').first().select('LST');
Map.addLayer(lst_2023.clip(roi), {min: 15, max: 40, palette: ['blue', 'green', 'yellow', 'orange', 'red']}, 'LST 2023 (L8/9)');

// Create a chart to see how the temperature changed over 38 years!
var chart = ui.Chart.image.series({
  imageCollection: lst_timeseries.select('LST'),
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 100
}).setOptions({
  title: 'Average Land Surface Temperature (1985-2023)',
  vAxis: {title: 'LST (°C)'},
  hAxis: {title: 'Year'}
});

print(chart);
