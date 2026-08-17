var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define ROI
var roi = ee.Geometry.Point([-47.92, -15.86]).buffer(5000);
Map.centerObject(roi, 12);

// 2. Get Landsat Time Series (e.g., NDVI over a year)
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(roi)
  .filterDate('2020-01-01', '2020-12-31')
  .map(function(img) {
    return geet.landsat_indices(img, 'L8').select('NDVI');
  });

// 3. Create a time series chart (using EE's built-in charting, adapted for GEET)
var chart = ui.Chart.image.series({
  imageCollection: collection,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 30
}).setOptions({
  title: 'NDVI Time Series',
  vAxis: {title: 'NDVI'},
  hAxis: {title: 'Date'}
});

print(chart);
