var geet = require('users/elacerda/geet:geet');
var rio_2016 = ee.Image('COPERNICUS/S2/20161110T130242_20161110T165117_T23KPQ');
var rio_2016_ndvi = geet.sentinel2_indices(rio_2016, 'ndvi');
var newfc = urbano.merge(floresta).merge(agua).merge(pasto);
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'NDVI']
var rf_class = geet.rf(rio_2016_ndvi, bands, newfc, 'cobertura', 10, 30, 0.7);
var COLOR = {WATER: '0066ff', FOREST: '009933', PASTURE: '99cc00', URBAN: 'ff0000'};
Map.addLayer(rf_class, { min: 0, max: 3, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.WATER, COLOR.PASTURE] }, 'class');
