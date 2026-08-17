var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define a Region of Interest (e.g. an agricultural area)
var roi = ee.Geometry.Point([-52.2, -12.5]).buffer(5000); // Mato Grosso, Brazil
Map.centerObject(roi, 12);

// 2. Get a historical baseline collection (e.g. 5 years of LST data)
var baseline_col = geet.landsat_timeseries_by_roi('TOA', roi)
    .filterDate('2015-01-01', '2020-12-31')
    .map(geet.calculate_lst);

// 3. Get a target image (e.g. a heatwave event in 2023)
var target_image = geet.landsat_timeseries_by_roi('TOA', roi)
    .filterDate('2023-09-01', '2023-11-30') // Extreme spring heatwave
    .map(geet.calculate_lst)
    .mean() // Average of the period
    .clip(roi);

// 4. Calculate the Z-Score Anomaly!
// Z-Score tells us how many standard deviations the target is from the historical mean
var anomaly_image = geet.anomaly(target_image, baseline_col, 'LST');

// 5. Visualization
Map.addLayer(target_image.select('LST'), {min: 25, max: 45, palette: ['blue', 'yellow', 'red']}, 'Target LST (Celsius)', false);

// Anomaly Visualization: 
// Negative values (Blue) = Cooler than normal
// Zero (White) = Normal
// Positive values (Red/Dark Red) = Hotter than normal (Heatwave)
var z_vis = {min: -3, max: 3, palette: ['blue', 'white', 'red', 'darkred']};
Map.addLayer(anomaly_image.select('LST_z_score'), z_vis, 'LST Anomaly (Z-Score)');
