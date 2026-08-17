var geet = require('users/eduardolacerdageo/geet:geet');

// 1. Define ROI (e.g., an area in the Amazon or Cerrado)
var roi = ee.Geometry.Point([-53.2, -10.5]).buffer(20000);
Map.centerObject(roi, 11);

// 2. Build Annual Landsat Time Series (Mosaics)
// This GEET function automatically fetches, clouds-masks, and creates a median mosaic 
// for EACH year from 1985 to the present!
// It only requires your ROI as a parameter.
var annual_mosaics = geet.build_annual_landsat_timeseries(roi);
print('Annual Mosaics Collection:', annual_mosaics);

// 3. Visualize a specific year (e.g., 2018)
// Filter the collection to get just the 2018 mosaic
var mosaic_2018 = annual_mosaics.filter(ee.Filter.eq('year', 2018)).first();

// Use the GEET plot function to visualize the 2018 False Color mosaic
// Note: Since this function standardizes all bands across L5, L7, and L8 into 
// names like 'BLUE', 'GREEN', 'RED', 'NIR', we specify these explicit bands.
geet.plot(mosaic_2018, 'false_color', 'Landsat Mosaic (2018)', {bands: ['NIR', 'RED', 'GREEN'], min: 0, max: 0.5});

// 4. Create a custom composite for a specific season using create_mosaic
// For example, a dry season mosaic from July to September 2021
var dry_season = geet.create_mosaic('2021-07-01', '2021-09-30', roi, false, 'L8');
geet.plot(dry_season, 'rgb', 'Dry Season Mosaic (2021)', {sensor: 'L8'});
