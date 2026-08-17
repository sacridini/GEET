var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(10000);
Map.centerObject(roi, 12);

// Calculate Burn Severity (dNBR)
// Fetch a pre-fire image from early 2019
var preFire = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2019-01-01', '2019-07-30')
  .filter(ee.Filter.lt('CLOUD_COVER', 5))
  .first();

// Fetch a post-fire image from late 2019
var postFire = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2019-09-01', '2019-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 5))
  .first();

// Use the new GEET unified plot function to show the True Color images!
geet.plot(preFire, 'rgb', '1. Pre-Fire (RGB)', {sensor: 'L8'});
geet.plot(postFire, 'rgb', '2. Post-Fire (RGB)', {sensor: 'L8'});

// Convert to GEET dNBR. It returns an image with 4 bands: NBR_pre, NBR_post, dNBR, Severity_Class
var results = geet.burn_severity(preFire, postFire, 'L8');

// Display the continuous dNBR index
Map.addLayer(results.select('dNBR'), {min: -0.5, max: 1.0, palette: ['green', 'white', 'red']}, '3. Burn Severity (dNBR)');

// Display the discrete Severity Classes
geet.plot(results.select('Severity_Class'), 'class', '4. Burn Severity (Classes)');
