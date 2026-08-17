var geet = require('users/eduardolacerdageo/geet:geet');

// Define a Region of Interest (e.g., an area of deforestation in the Amazon)
var roi = ee.Geometry.Point([-55.4, -11.8]).buffer(10000);
Map.centerObject(roi, 12);

// Load two Landsat 8 images from different years
var img1 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(roi)
    .filterDate('2015-06-01', '2015-08-31')
    .sort('CLOUD_COVER')
    .first()
    .clip(roi);

var img2 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(roi)
    .filterDate('2021-06-01', '2021-08-31')
    .sort('CLOUD_COVER')
    .first()
    .clip(roi);

Map.addLayer(img1, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Image 1 (2015)');
Map.addLayer(img2, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Image 2 (2021)');

// ---------------------------------------------------------
// 1. iMAD (Iteratively Reweighted MAD) Change Detection
// ---------------------------------------------------------
// We stack the two images and initialize the iteration dictionary.
// The iMAD algorithm iteratively finds the canonical correlations.

var image = img1.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7'])
      .addBands(img2.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']));
var nbands = 6;
var inputlist = ee.List.sequence(1, 10); // 10 max iterations
var first = ee.Dictionary({
    'done': ee.Number(0),
    'image': image,
    'allrhos': [ee.List.sequence(1, nbands)],
    'chi2': ee.Image.constant(0),
    'MAD': ee.Image.constant(0)
});

// Iterate the algorithm
var result = ee.Dictionary(inputlist.iterate(function(current, prev) {
    return geet.imad(current, prev);
}, first));

// Extract the Change Image (Chi-Square image)
// Pixels with high chi-square values indicate significant change
var chi2 = ee.Image(result.get('chi2')).rename('Change_Probability');

// Visualize the changes! (Red means high change, blue means no change)
Map.addLayer(chi2, {min: 0, max: 20, palette: ['blue', 'green', 'yellow', 'red']}, 'Changes (iMAD Chi-Square)');
