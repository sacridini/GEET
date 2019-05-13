// Create a Land Surface Temperature Layer using Landsat 5 image
var geet = require('users/elacerda/geet:geet');
var image_col = ee.ImageCollection(l5)
        .filterBounds(roi)
        .filterDate('2010-01-01', '2010-12-31')
        .sort('CLOUD_COVER');
var image = image_col.first();
var toa = geet.toa_radiance(image, 6);
var ndvi = geet.ndvi_l5(toa);
var bt = geet.brightness_temp_l5c(ndvi, true);
var propVeg = geet.prop_veg(bt);
var lse = geet.surface_emissivity(propVeg);
var lst = geet.surface_temperature_tm(lse);
var lst_only = lst.select('LST');
Map.addLayer(lst_only);
