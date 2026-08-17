var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define ROI (e.g., an area in the Amazon that experienced early deforestation)
var roi = ee.Geometry.Point([-122.08, 37.38]).buffer(20000);
Map.centerObject(roi, 11);

// 2. Build Annual MSS Time Series (1972 - 1999)
// This GEET function automatically merges Landsat 1, 2, 3, 4, and 5 MSS collections.
// It renames the distinct bands into 'GREEN', 'RED', 'NIR1', 'NIR2', masks clouds, 
// and computes the NDVI before creating annual median mosaics.
var mss_mosaics = geet.build_annual_mss_timeseries(roi);
print('Annual MSS Collection:', mss_mosaics);

// 3. Visualize a specific historical year (e.g., 1985)
var mosaic_1985 = mss_mosaics.filter(ee.Filter.eq('year', 1985)).first();

// Display the False Color mosaic for 1985 using GEET Plot
// For MSS, standard False Color uses NIR1 (or NIR2), RED, and GREEN
geet.plot(mosaic_1985, 'false_color', 'MSS Mosaic (1985)', {bands: ['NIR1', 'RED', 'GREEN'], min: 0, max: 100});

// 4. Visualize the NDVI for that year
geet.plot(mosaic_1985.select('NDVI'), 'ndvi', 'MSS NDVI (1985)', {min: 0, max: 1});
