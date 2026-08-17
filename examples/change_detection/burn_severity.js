var geet = require('users/eduardolacerdageo/geet:geet');

var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(5000);
Map.centerObject(roi, 12);

// Calculate Burn Severity (dNBR)
var preFire = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_221071_20190805');
var postFire = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_221071_20190906');

// Convert to GEET dNBR
var dnbr = geet.burn_severity(preFire, postFire, 'L8');

Map.addLayer(dnbr, {min: -500, max: 1000, palette: ['green', 'white', 'red']}, 'Burn Severity');
