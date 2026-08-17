var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define ROI (e.g., an area undergoing deforestation)
var roi = ee.Geometry.Point([-53.2, -10.5]).buffer(10000);
Map.centerObject(roi, 12);

// 2. Fetch Two Images (Past and Present)
// Using GEET's mosaic builder to ensure cloud-free images for comparison
var past_img = geet.create_mosaic('2018-06-01', '2018-09-30', roi, false, 'L8');
var present_img = geet.create_mosaic('2022-06-01', '2022-09-30', roi, false, 'L8');

// Visualize the Before/After
geet.plot(past_img, 'rgb', '1. Past (2018)', {sensor: 'L8'});
geet.plot(present_img, 'rgb', '2. Present (2022)', {sensor: 'L8'});

// 3. Run Automatic NDVI Change Detection
// This function calculates NDVI for both images, computes the difference,
// and classifies areas into: Deforestation, Degradation, Stable, Recovery.
var ndvi_change = geet.ndvi_change_detection(past_img, present_img, 'L8');

// The function returns an Image with discrete classes representing change.
// 1: High Loss (Deforestation)
// 2: Low Loss (Degradation)
// 3: Stable
// 4: Low Gain (Regrowth)
// 5: High Gain (Reforestation)

// Use GEET's smart plot with the 'class' type to automatically color the categorical changes
geet.plot(ndvi_change, 'class', '3. NDVI Change Detection Map');
