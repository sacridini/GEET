var geet = require('users/elacerda/geet:geet');
var rio_2015 = geet.load_image('TOA', 2015);
var idx = geet.landsat_indices(rio_2015, 'L5');
var newfc = urbano.merge(verde).merge(agua).merge(pasto);
var cart_class = geet.cart(idx, newfc, 'landcover');
var COLOR = { WATER: '0066ff', FOREST: '009933', PASTURE: '99cc00', URBAN: 'ff0000' };
Map.addLayer(cart_class, { min: 0, max: 3, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.PASTURE, COLOR.WATER] }, 'class');
Map.setCenter(-43.25, -22.90, 10);
geet.export_image(cart_class, 'rio2015_cart', 30, 1e13, rio);