/** 
 * Google Earth Engine Toolbox (GEET)
 * Description: Lib to write small EE apps or big/complex apps with a lot less code.
 * Version: 0.5.5
 * Eduardo Ribeiro Lacerda <elacerda@id.uff.br>
 */

// Error Handling function
function error(funcName, msg) {
    print("------------------  GEET  --------------------");    
    print("GEET Error in function: " + funcName.toString());
    print(msg.toString());
    print("----------------------------------------------");
}


/*
  svm:
  Function to apply SVM classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples). 
  (string) fieldName - The name of the column that contains the class names.
  optional (string) kernelType - the kernel type of the classifier. Default is 'RBF'.
  optional (number) scale - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.svm(image, samplesfc, landcover);
*/
var svm = function (image, trainingData, fieldName, kernelType, scale) {
    // Error Handling
    if (image === undefined) error('svm', 'You need to specify an input image.');  
    if (trainingData === undefined) error('svm', 'You need to specify the training data.');  
    if (fieldName === undefined) error('svm', 'You need to specify the field name.');  

    // Default params
    kernelType = typeof kernelType !== 'undefined' ? kernelType : 'RBF';
    scale = typeof scale !== 'undefined' ? scale : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: scale
    });

    var classifier = ee.Classifier.svm({
        kernelType: kernelType,
        cost: 10
    });

    var trained = classifier.train(training, fieldName);
    var classified = image.classify(trained);
    return classified;
};


/*
  cart:
  Function to apply CART classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) scale - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.cart(image, samplesfc, landcover);
*/
var cart = function (image, trainingData, fieldName, scale) {
    // Error Handling
    if (image === undefined) error('cart', 'You need to specify an input image.');
    if (trainingData === undefined) error('cart', 'You need to specify the training data.');
    if (fieldName === undefined) error('cart', 'You need to specify the field name.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: scale
    });

    var classifier = ee.Classifier.cart().train({
        features: training,
        classProperty: fieldName
    });

    var classified = image.classify(classifier);
    return classified;
};


/*
  rf:
  Function to apply Random Forest classification to an image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - the name of the column that contains the class names.
  optional (ee.Number) numOfTrees - the number of trees that the model will create. Default is 10.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.rf(image, samplesfc, landcover, 10);
*/
var rf = function (image, trainingData, fieldName, numOfTrees) {
    // Error Handling
    if (image === undefined) error('rf', 'You need to specify an input image.');
    if (trainingData === undefined) error('rf', 'You need to specify the training data.');
    if (fieldName === undefined) error('rf', 'You need to specify the field name.');

    // Default params
    numOfTrees = typeof numOfTrees !== 'undefined' ? numOfTrees : 10;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: 30
    });

    var classifier = ee.Classifier.randomForest(numOfTrees).train({
        features: training,
        classProperty: fieldName
    });

    var classified = image.classify(classifier);
    return classified;
};


/*
  naive_bayes:
  Function to apply the Fast Naive Bayes classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) scale - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.naive_bayes(image, samplesfc, landcover);
*/
var naive_bayes = function (image, trainingData, fieldName, scale) {
    // Error Handling
    if (image === undefined) error('naive_bayes', 'You need to specify an input image.');
    if (trainingData === undefined) error('naive_bayes', 'You need to specify the training data.');
    if (fieldName === undefined) error('naive_bayes', 'You need to specify the field name.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: scale
    });

    var classifier = ee.Classifier.naive_bayes().train({
        features: training,
        classProperty: fieldName
    });

    var classified = image.classify(classifier);
    return classified;
};


/*
  gmo_max_ent:
  Function to apply the GMO Maximum Entropy classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) scale - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.gmo_max_ent(image, samplesfc, landcover);
*/
var gmo_max_ent = function (image, trainingData, fieldName, scale) {
    // Error Handling
    if (image === undefined) error('gmo_max_ent', 'You need to specify an input image.');
    if (trainingData === undefined) error('gmo_max_ent', 'You need to specify the training data.');
    if (fieldName === undefined) error('gmo_max_ent', 'You need to specify the field name.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: scale
    });

    var classifier = ee.Classifier.gmo_max_ent().train({
        features: training,
        classProperty: fieldName
    });

    var classified = image.classify(classifier);
    return classified;
};


/*
  kmeans:
  Function to apply kmeans classification to an image.

  Params:
  (ee.Image) image - The input image to classify.
  (list) roi - A polygon containing the study area.
  optional (number) numClusters - the number of clusters that will be used. Default is 15.
  optional (number) scale - the scale number. The scale is related to the spatial resolution of the image. Landsat is 30, sou the default is 30 also.
  optional (number) numPixels - the number of pixels that the classifier will take samples from the roi. Default is set to 5000.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.kmeans(image, roi);

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var imgClass = geet.kmeans(image, roi, 20, 10, 6000);
*/
var kmeans = function (image, roi, numClusters, scale, numPixels) {
    // Error Handling
    if (image === undefined) error('kmeans', 'You need to specify an input image.');
    if (roi === undefined) error('kmeans', 'You need to define and pass a roi as argument to collect the samples for the classfication process.');

    // Default params
    numClusters = typeof numClusters !== 'undefined' ? numClusters : 15;
    scale = typeof scale !== 'undefined' ? scale : 30;
    numPixels = typeof numPixels !== 'undefined' ? numPixels : 5000;


    // Make the training dataset.
    var training = image.sample({
        region: roi,
        scale: scale,
        numPixels: numPixels
    });

    // Instantiate the clusterer and train it.
    var clusterer = ee.Clusterer.wekaKMeans(numClusters).train(training);

    // Cluster the input using the trained clusterer.
    var result = image.cluster(clusterer);
    Map.addLayer(ee.Image().paint(roi, 0, 2), {}, 'roi_kmeans');
    Map.addLayer(result.randomVisualizer(), {}, 'clusters');
    return result;
}

/*
  ndvi_change_detection:
  Function to detect changes between two input images using the NDVI index 
  and a threshold paramter. 
  The function adds the two masked indices and return the sum of the two.
  Its a good choice to call the plotClass function to visualize the result.
  Ex: geet.plotClass(ndviChange, 3, 'change_detection');
  
  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/elacerda/geet:geet'); 
  var ndviChange = geet.ndvi_change_detection(image_2014, image_2015, 'L8', 0.5);
*/
var ndvi_change_detection = function (img1, img2, sensor, threshold) {
    // Error Handling
    if (img1 === undefined) error('ndvi_change_detection', 'You need to specify an input image.');
    if (img2 === undefined) error('ndvi_change_detection', 'You need to specify an input image.');
    if (sensor === undefined) error('ndvi_change_detection', 'You need to specify the sensor name.');
    if (threshold === undefined) error('ndvi_change_detection', 'You need to specify the threshold number.');

    if (sensor === 'L8') {
        var i_ndvi_1 = img1.normalizedDifference(['B5', 'B4']).rename('NDVI');
        var i_ndvi_2 = img2.normalizedDifference(['B5', 'B4']).rename('NDVI');
    } else if (sensor === 'L5' || sensor === 'L7') {
        var i_ndvi_1 = img1.normalizedDifference(['B4', 'B3']).rename('NDVI');
        var i_ndvi_2 = img2.normalizedDifference(['B4', 'B3']).rename('NDVI');
    } else if (sensor === 'S2') {
        var i_ndvi_1 = img1.normalizedDifference(['B8', 'B4']).rename('NDVI');
        var i_ndvi_2 = img2.normalizedDifference(['B8', 'B4']).rename('NDVI');
    } else {
        print('Error: Wrong sensor. Choose between L5, L7, L8 or S2');
        return;
    }
    var i_ndvi_1_mask = i_ndvi_1.select('NDVI').gte(threshold);
    var i_ndvi_2_mask = i_ndvi_2.select('NDVI').gte(threshold);
    var imgSoma = i_ndvi_1_mask.add(i_ndvi_2_mask);
    Map.addLayer(imgSoma, { min: 0, max: 2, palette: [COLOR.SHADOW, COLOR.URBAN, COLOR.PASTURE] }, 'ndvi_cd');
    return imgSoma;
}

/*
  ndwi_change_detection:
  Function to detect changes between two input images using the NDWI index 
  and a threshold paramter. 
  The function adds the two masked indices and return the sum of the two.
  Its a good choice to call the plotClass function to visualize the result.
  Ex: geet.plotClass(ndwiChange, 3, 'change_detection');

  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/elacerda/geet:geet'); 
  var ndwiChange = geet.ndwi_change_detection( image_2014, image_2015, 'L8', 0.5);
*/
var ndwi_change_detection = function (img1, img2, sensor, threshold) {
    // Error Handling
    if (img1 === undefined) error('ndwi_change_detection', 'You need to specify an input image.');
    if (img2 === undefined) error('ndwi_change_detection', 'You need to specify an input image.');
    if (sensor === undefined) error('ndwi_change_detection', 'You need to specify the sensor name.');
    if (threshold === undefined) error('ndwi_change_detection', 'You need to specify the threshold number.');

    if (sensor === 'L8') {
        var i_ndwi_1 = img1.normalizedDifference(['B4', 'B6']).rename('NDWI');
        var i_ndwi_2 = img2.normalizedDifference(['B4', 'B6']).rename('NDWI');
    } else if (sensor === 'L5' || sensor === 'L7') {
        var i_ndwi_1 = img1.normalizedDifference(['B3', 'B5']).rename('NDWI');
        var i_ndwi_2 = img2.normalizedDifference(['B3', 'B5']).rename('NDWI');
    } else if (sensor === 'S2') {
        var i_ndwi_1 = img1.normalizedDifference(['B4', 'B11']).rename('NDWI');
        var i_ndwi_2 = img2.normalizedDifference(['B4', 'B11']).rename('NDWI');
    } else {
        print('Error: Wrong sensor. Choose between L5, L7, L8 or S2');
        return;
    }
    var i_ndwi_1_mask = i_ndwi_1.select('NDWI').gte(threshold);
    var i_ndwi_2_mask = i_ndwi_2.select('NDWI').gte(threshold);
    var imgSoma = i_ndwi_1_mask.add(i_ndwi_2_mask);
    Map.addLayer(imgSoma, { min: 0, max: 2, palette: [COLOR.SHADOW, COLOR.URBAN, COLOR.PASTURE] }, 'ndwi_cd');
    return imgSoma;
}

/*
  ndbi_change_detection:
  Function to detect changes between two input images using the NDBI index 
  and a threshold paramter. 
  The function adds the two masked indices and return the sum of the two.
  Its a good choice to call the plotClass function to visualize the result.
  Ex: geet.plotClass(ndbiChange, 3, 'change_detection');

  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/elacerda/geet:geet'); 
  var ndbiChange = geet.ndbi_change_detection(image_2014, image_2015, 'L8', 0.5);
*/
var ndbi_change_detection = function (img1, img2, sensor, threshold) {
    // Error Handling
    if (img1 === undefined) error('ndbi_change_detection', 'You need to specify an input image.');
    if (img2 === undefined) error('ndbi_change_detection', 'You need to specify an input image.');
    if (sensor === undefined) error('ndbi_change_detection', 'You need to specify the sensor name.');
    if (threshold === undefined) error('ndbi_change_detection', 'You need to specify the threshold number.');

    if (sensor === 'L8') {
        var i_ndbi_1 = img1.normalizedDifference(['B6', 'B5']).rename('NDBI');
        var i_ndbi_2 = img2.normalizedDifference(['B6', 'B5']).rename('NDBI');
    } else if (sensor === 'L5' || sensor === 'L7') {
        var i_ndbi_1 = img1.normalizedDifference(['B5', 'B4']).rename('NDBI');
        var i_ndbi_2 = img2.normalizedDifference(['B5', 'B4']).rename('NDBI');
    } else if (sensor === 'S2') {
        var i_ndbi_1 = img1.normalizedDifference(['B11', 'B8']).rename('NDBI');
        var i_ndbi_2 = img2.normalizedDifference(['B11', 'B8']).rename('NDBI');
    } else {
        print('Error: Wrong sensor. Choose between L5, L7, L8 or S2');
        return;
    }
    var i_ndbi_1_mask = i_ndbi_1.select('NDBI').gte(threshold);
    var i_ndbi_2_mask = i_ndbi_2.select('NDBI').gte(threshold);
    var imgSoma = i_ndbi_1_mask.add(i_ndbi_2_mask);
    Map.addLayer(imgSoma, { min: 0, max: 2, palette: [COLOR.SHADOW, COLOR.URBAN, COLOR.PASTURE] }, 'ndbi_cd');
    return imgSoma;
};

/*
  Texture:
  Function generate a texture filter on the image.

  Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
  Bigger numbers generalize more the result. 
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var texture = geet.texture(image_from_rio, 1);
*/
var texture = function (image, radius) {
    // Error Handling
    if (image === undefined) error('texture', 'You need to specify an input image.');
    if (radius === undefined) error('texture', 'You need to specify the radius number.');

    var texture = image.reduceNeighborhood({
        reducer: ee.Reducer.stdDev(),
        kernel: ee.Kernel.circle(radius),
    });
    return texture;
};

/*
  Majority:
  Function to filter the final classification image and clear the salt n' pepper effect.

  Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
  Bigger numbers generalize more the result. 
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var majority = geet.majority(image_from_rio, 1);
*/
var majority = function (image, radius) {
    // Error Handling
    if (image === undefined) error('majority', 'You need to specify an input image.');
    if (radius === undefined) error('majority', 'You need to specify the radius number.');

    var majority = image.reduceNeighborhood({
        reducer: ee.Reducer.mode(),
        kernel: ee.Kernel.circle(radius),
    });
    return majority;
};

// COLOR OBJECT
var COLOR = {
    WATER: '0066ff',
    FOREST: '009933',
    PASTURE: '99cc00',
    URBAN: 'ff0000',
    SHADOW: '000000',
    NULL: '808080'
};

/*
  color:
  Function to return a valid color value from the object COLOR.

  Params:
  (string) color - the name of the desired color.
  Valid options are water, forest, pasture, urban, shadow or null

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.color('water');
*/
var color = function (_color) {
    // Error Handling
    if (_color === undefined) error('color', 'You need to specify the color name.');

    var color = _color.toLowerCase();
    switch (color) {
    case 'water':
        return COLOR.WATER;
    case 'forest':
        return COLOR.FOREST;
    case 'pasture':
        return COLOR.PASTURE;
    case 'urban':
        return COLOR.URBAN;
    case 'shadow':
        return COLOR.SHADOW;
    case 'null':
        return COLOR.NULL;
    default:
        return 'Error: Valid options are water, forest, pasture, urban, shadow or null! Remember to pass the argument as a string.';
    }
};

/*
  plot_rgb:
  Function to plot a RGB image.

  Params:
  (ee.Image) image - the image to display.
  optional (string) title - the layer title.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.plot_rgb(image, 'rgb_image');
*/
var plot_rgb = function (image, title) {
    // Error Handling
    if (image === undefined) error('plot_rgb', 'You need to specify an input image.');

    // Default params
    title = typeof title !== 'undefined' ? title : 'image_RGB';
    

    var vizParams = {
        'bands': 'B4,B3,B2',
        'min': 5000,
        'max': 30000,
        'gamma': 1.6
    };

    Map.addLayer(image, vizParams, title);
};

/*
  plot_ndvi:
  Function to plot a NDVI image index.

  Params:
  (ee.Image) image - the image to display.
  (string) title - the layer title.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.plot_ndvi(ndvi, 'ndvi_image');
*/
var plot_ndvi = function (image, title) {
    // Error Handling
    if (image === undefined) error('plot_ndvi', 'You need to specify an input image.');

    Map.addLayer(image, { min: -1, max: 1, palette: ['FF0000', '00FF00'] }, title);
};

/*
  plot_ndwi:
  Function to plot a NDWI image index.

  Params:
  (ee.Image) image - the image to display.
  (string) title - the layer title.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.plot_ndwi(ndwi, 'ndwi_image');
*/
var plot_ndwi = function (image, title) {
    // Error Handling
    if (image === undefined) error('plot_ndwi', 'You need to specify an input image.');

    Map.addLayer(image, { min: -1, max: 1, palette: ['00FFFF', '0000FF'] }, title);
};

/*
  plot_class:
  Function to plot the final classification map.
  
  Params:
  (ee.Image) image - the image to process
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.
  optional (string) title - the layer title. 
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.plot_class(classified, 4, 'class_final');
*/
var plot_class = function (image, numClasses, title) {
    // Error Handling
    if (image === undefined) error('plot_class', 'You need to specify an input image.');
    if (numClasses === undefined) error('plot_class', 'You need to specify the number of classes to plot.');

    // Default params
    title = typeof title !== 'undefined' ? title : 'class_final';

    switch (numClasses) {
    case 2:
        Map.addLayer(image, { min: 0, max: numClasses - 1, palette: [COLOR.SHADOW, COLOR.NULO] }, title);
        break;
    case 3:
        Map.addLayer(image, { min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.WATER] }, title);
        break;
    case 4:
        Map.addLayer(image, { min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.PASTURE, COLOR.WATER] }, title);
        break;
    case 5:
        Map.addLayer(image, { min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.PASTURE, COLOR.WATER, COLOR.SHADOW] }, title);
        break;
    default:
        print("Error: Wrong number of classes. plotClass supports a number of classes from 2 to 5 only.");
        break;
    }
};


/*
  landsat_indices:
  Function to take an input image and generate indexes using the landsat (5, 7 and 8) dataset like:
  NDVI, NDWI, NDBI...
  
  More indices and features will be added in the future!

  Supported indices:
  NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI

  Params:
  (ee.Image) image - the image to process.
  (string) sensor - the sensor that you are working on Landsat 5 ('L5'), 7 ('L7') or 8 ('L8').
  optional (string or string array) index  - you can specify the index that you want
  if you dont specify any index the function will create all possible indices.
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/indexGen');
  var result = geet.landsat_indices(image, 'L5'); // Will create all possible indices.

  or specifying the index to generate:
  var geet = require('users/elacerda/geet:geet'); 
  var result = geet.landsat_indices(image, 'L5', 'savi'); // This will create only SAVI.
*/
var landsat_indices = function (image, sensor, index) {
    // Error Handling
    if (image === undefined) error('landsat_indices', 'You need to specify an input image.');
    if (sensor === undefined) error('landsat_indices', 'You need to specify the sensor name.');

    if (index != null) {
        switch (index.toLowerCase()) {
        case 'ndvi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
				var newImage = image.addBands(i_ndvi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
				var newImage = image.addBands(i_ndvi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
				var newImage = image.addBands(i_ndvi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'ndwi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_ndwi = image.normalizedDifference(['B3', 'B5']).rename('NDWI');
				var newImage = image.addBands(i_ndwi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_ndwi = image.normalizedDifference(['B4', 'B6']).rename('NDWI');
				var newImage = image.addBands(i_ndwi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_ndwi = image.normalizedDifference(['B4', 'B11']).rename('NDWI');
				var newImage = image.addBands(i_ndwi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'ndbi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_ndbi = image.normalizedDifference(['B5', 'B4']).rename('NDBI');
				var newImage = image.addBands(i_ndbi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_ndbi = image.normalizedDifference(['B6', 'B5']).rename('NDBI');
				var newImage = image.addBands(i_ndbi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');
				var newImage = image.addBands(i_ndbi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'nrvi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_nrvi = image.expression(
					'(RED/NIR - 1) / (RED/NIR + 1)', {
						'NIR': image.select('B4'),
						'RED': image.select('B3')
					}).rename('NRVI');
				var newImage = image.addBands(i_nrvi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_nrvi = image.expression(
					'(RED/NIR - 1) / (RED/NIR + 1)', {
						'NIR': image.select('B5'),
						'RED': image.select('B4')
					}).rename('NRVI');
				var newImage = image.addBands(i_nrvi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'gli':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_gli = image.expression(
					'(2 * GREEN - RED - BLUE) / (2 * GREEN + RED + BLUE)', {
						'BLUE': image.select('B1'),
						'GREEN': image.select('B2'),
						'RED': image.select('B3')
					}).rename('GLI');
				var newImage = image.addBands(i_gli);
				return newImage;
            } else if (sensor == 'L8') {
                var i_gli = image.expression(
					'(2 * GREEN - RED - BLUE) / (2 * GREEN + RED + BLUE)', {
						'BLUE': image.select('B2'),
						'GREEN': image.select('B3'),
						'RED': image.select('B4')
					}).rename('GLI');
				var newImage = image.addBands(i_ndbi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'evi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_evi = image.expression(
					'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
						'NIR': image.select('B4'),
						'RED': image.select('B3'),
						'BLUE': image.select('B1')
					}).rename('EVI');
				var newImage = image.addBands(i_evi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_evi = image.expression(
					'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
						'NIR': image.select('B5'),
						'RED': image.select('B4'),
						'BLUE': image.select('B2')
					}).rename('EVI');
				var newImage = image.addBands(i_evi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_evi = image.expression(
					'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
						'NIR': image.select('B8'),
						'RED': image.select('B4'),
						'BLUE': image.select('B2')
					}).rename('EVI');
				var newImage = image.addBands(i_evi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'savi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_savi = image.expression(
					'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
						'NIR': image.select('B4'),
						'RED': image.select('B3'),
						'L': 0.2
					}).rename('SAVI');
				var newImage = image.addBands(i_savi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_savi = image.expression(
					'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
						'NIR': image.select('B5'),
						'RED': image.select('B4'),
						'L': 0.2
					}).rename('SAVI');
				var newImage = image.addBands(i_savi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_savi = image.expression(
					'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
						'NIR': image.select('B8'),
						'RED': image.select('B4'),
						'L': 0.2
					}).rename('SAVI');
				var newImage = image.addBands(i_savi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        case 'gosavi':
            if (sensor == 'L5' || sensor == 'L7') {
				var i_gosavi = image.expression(
					'(NIR - GREEN) / (NIR + GREEN + Y)', {
						'NIR': image.select('B4'),
						'GREEN': image.select('B2'),
						'Y': 0.16
					}).rename('GOSAVI');
				var newImage = image.addBands(i_gosavi);
				return newImage;
            } else if (sensor == 'L8') {
				var i_gosavi = image.expression(
					'(NIR - GREEN) / (NIR + GREEN + Y)', {
						'NIR': image.select('B5'),
						'GREEN': image.select('B3'),
						'Y': 0.16
					}).rename('GOSAVI');
				var newImage = image.addBands(i_gosavi);
				return newImage;
            } else if (sensor == 'S2') {
				var i_gosavi = image.expression(
					'(NIR - GREEN) / (NIR + GREEN + Y)', {
						'NIR': image.select('B8'),
						'GREEN': image.select('B3'),
						'Y': 0.16
					}).rename('GOSAVI');
				var newImage = image.addBands(i_gosavi);
				return newImage;
            } else {
				print('Error: Wrong sensor!');
            }
            break;
        }
    } else { // END OF SWITCH 
        // Gen ALL indices
        if (sensor == 'L5' || sensor == 'L7') {
			var i_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
			var i_ndwi = image.normalizedDifference(['B2', 'B5']).rename('NDWI');
			var i_ndbi = image.normalizedDifference(['B5', 'B4']).rename('NDBI');
			var i_gli = image.expression(
				'(2 * GREEN - RED - BLUE) / (2 * GREEN + RED + BLUE)', {
					'BLUE': image.select('B1'),
					'GREEN': image.select('B2'),
					'RED': image.select('B3')
				}).rename('GLI');
			var i_nrvi = image.expression(
				'(RED/NIR - 1) / (RED/NIR + 1)', {
					'NIR': image.select('B4'),
					'RED': image.select('B3')
				}).rename('NRVI');
			var i_evi = image.expression(
				'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
					'NIR': image.select('B4'),
					'RED': image.select('B3'),
					'BLUE': image.select('B1')
				}).rename('EVI');
			var i_savi = image.expression(
				'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
					'NIR': image.select('B4'),
					'RED': image.select('B3'),
					'L': 0.2
				}).rename('SAVI');
			var i_gosavi = image.expression(
				'(NIR - GREEN) / (NIR + GREEN + Y)', {
					'NIR': image.select('B4'),
					'GREEN': image.select('B2'),
					'Y': 0.16
				}).rename('GOSAVI');
			var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_nrvi, i_evi, i_savi, i_gosavi]);
			return newImage;
        } else if (sensor == 'L8') {
			var i_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
			var i_ndwi = image.normalizedDifference(['B3', 'B6']).rename('NDWI');
			var i_ndbi = image.normalizedDifference(['B6', 'B5']).rename('NDBI');
			var i_gli = image.expression(
				'(2 * GREEN - RED - BLUE) / (2 * GREEN + RED + BLUE)', {
					'BLUE': image.select('B2'),
					'GREEN': image.select('B3'),
					'RED': image.select('B4')
				}).rename('GLI');
			var i_nrvi = image.expression(
				'(RED/NIR - 1) / (RED/NIR + 1)', {
					'NIR': image.select('B5'),
					'RED': image.select('B4')
				}).rename('NRVI');
			var i_evi = image.expression(
				'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
					'NIR': image.select('B5'),
					'RED': image.select('B4'),
					'BLUE': image.select('B2')
				}).rename('EVI');
			var i_savi = image.expression(
				'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
					'NIR': image.select('B5'),
					'RED': image.select('B4'),
					'L': 0.2
				}).rename('SAVI');
			var i_gosavi = image.expression(
				'(NIR - GREEN) / (NIR + GREEN + Y)', {
					'NIR': image.select('B5'),
					'GREEN': image.select('B3'),
					'Y': 0.16
				}).rename('GOSAVI');
			var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_nrvi, i_evi, i_savi, i_gosavi]);
			return newImage;
        } else if (sensor == 'S2') {
			var i_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
			var i_ndwi = image.normalizedDifference(['B3', 'B11']).rename('NDWI');
			var i_ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');
			var i_evi = image.expression(
				'2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
					'NIR': image.select('B8'),
					'RED': image.select('B4'),
					'BLUE': image.select('B2')
				}).rename('EVI');
			var i_savi = image.expression(
				'(1 + L) * (NIR - RED) / (NIR + RED + L)', {
					'NIR': image.select('B8'),
					'RED': image.select('B4'),
					'L': 0.2
				}).rename('SAVI');
			var i_gosavi = image.expression(
				'(NIR - GREEN) / (NIR + GREEN + Y)', {
					'NIR': image.select('B8'),
					'GREEN': image.select('B3'),
					'Y': 0.16
				}).rename('GOSAVI');
			var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_evi, i_savi, i_gosavi]);
			return newImage;
        } else {
			print("Error: Wrong sensor input!");
			print("Choose 'L5' to process Landsat 5 images, 'L8' for Landsat 8 and S2 for Sentinel 2");
        }
    }
};


/*
  sentinel2_indices:
  Function to take an input image and generate indexes using the Sentinel 2 dataset.

  Supported indices:
  ndvi: Normalized Difference Vegetation Index
  ndwi: Normalized Difference Water Index
  ndbi: Normalized Difference Built-Up Index
  mndwi: Modifed Normalized Difference Water Index
  mndvi: Modified Normalized Difference Vegetation Index
  ngrdi: Normalized Difference Green/Red Edge Index. (Aka VIgreen)
  ndsi: Normalized Difference Salinity Index
  ri: Redness Index
  ndmi: Normalized Difference Moisture Index
  gndvi: Green NDVI
  bndvi: Coastal Blue NDVI
  nbr: Normalized Burn Ratio
  ppr: Plant Pigment Ratio
  ndre: Normalized Difference Red Edge
  lci: Leaf Chlorophyll Index
  savi: Soil Adjusted Vegetation Index
  gosavi: Green Optimized Soil Adjusted Vegetation Index
  evi: Enhanced Vegetation Index
  evi2: Enhanced Vegetation Index 2
  gemi: Global Environmental Monitoring Index
  rvi: Ratio Vegetation Index
  logr: Log Ratio
  tvi: Transformed Vegetation Index

  Params:
  (ee.Image) image - the image to process.
  optional (string or string array) index  - you can specify the index that you want
  if you dont specify any index the function will create all possible indices.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/indexGen');
  var result = geet.sentinel2_indices(image); // Will create all possible indices.

  or specifying the index to generate:
  var geet = require('users/elacerda/geet:geet'); 
  var result = geet.sentinel2_indices(image, 'savi'); // This will create only SAVI.
*/
var sentinel2_indices = function (image, index) {
    // Error Handling
    if (image === undefined) error('sentinel2_indices', 'You need to specify an input image.');
    
    if (index !== undefined) {
        switch (index.toLowerCase()) {
        case 'ndvi': // Normalized Difference Vegetation Index
            var i_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
            var newImage = image.addBands(i_ndvi);
            return newImage;
        case 'ndwi': // Normalized Difference Water Index
            var i_ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
            var newImage = image.addBands(i_ndwi);
            return newImage;
        case 'ndbi': // Normalized Difference Built-Up Index
            var i_ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');
            var newImage = image.addBands(i_ndbi);
            return newImage;
        case 'mndwi': // Modifed Normalized Difference Water Index
            var i_mndwi = image.normalizedDifference(['B3', 'B12']).rename('MNDWI');
            var newImage = image.addBands(i_mndwi);
            return newImage;
        case 'mndvi': // Modified Normalized Difference Vegetation Index
            var i_mndvi = image.normalizedDifference(['B9', 'B12']).rename('MNDVI');
            var newImage = image.addBands(i_mndvi);
            return newImage;
        case 'ngrdi': // Normalized Difference Green/Red Edge Index. Aka. VIgreen 
            var i_ngrdi = image.normalizedDifference(['B3', 'B5']).rename('NGRDI');
            var newImage = image.addBands(i_ngrdi);
            return newImage;
        case 'ndsi': // Normalized Difference Salinity Index
            var i_ndsi = image.normalizedDifference(['B11', 'B12']).rename('NDSI');
            var newImage = image.addBands(i_ndsi);
            return newImage;
        case 'ri': // Redness Index
            var i_ri = image.normalizedDifference(['B5', 'B3']).rename('RI');
            var newImage = image.addBands(i_ri);
            return newImage;
        case 'ndmi': // Normalized Difference Moisture Index
            var i_ndmi = image.normalizedDifference(['B9', 'B12']).rename('NDMI');
            var newImage = image.addBands(i_ndmi);
            return newImage;
        case 'gndvi': // Green NDVI
            var i_gndvi = image.normalizedDifference(['B9', 'B3']).rename('GNDVI');
            var newImage = image.addBands(i_gndvi);
            return newImage;
        case 'bndvi': // Coastal Blue NDVI
            var i_bndvi = image.normalizedDifference(['B9', 'B1']).rename('BNDVI');
            var newImage = image.addBands(i_bndvi);
            return newImage;
        case 'nbr': // Normalized Burn Ratio
            var i_nbr = image.normalizedDifference(['B9', 'B12']).rename('NBR');
            var newImage = image.addBands(i_nbr);
            return newImage;
        case 'ppr': // Plant Pigment Ratio
            var i_ppr = image.normalizedDifference(['B9', 'B12']).rename('PPR');
            var newImage = image.addBands(i_ppr);
            return newImage;
        case 'ndre': // Normalized Difference Red Edge
            var i_ndre = image.normalizedDifference(['B9', 'B5']).rename('NDRE');
            var newImage = image.addBands(i_ndre);
            return newImage;
        case 'lci': // Leaf Chlorophyll Index
            var i_lci = image.normalizedDifference(['B8', 'B5']).rename('LCI');
            var newImage = image.addBands(i_lci);
            return newImage;
        case 'savi': // Soil Adjusted Vegetation Index
            var i_savi = image.expression('(1 + L) * (NIR - RED) / (NIR + RED + L)',
										  {
											  'NIR': image.select('B8'),
											  'RED': image.select('B4'),
											  'L': 0.5
										  }).rename('SAVI');
            var newImage = image.addBands(i_savi);
            return newImage;
        case 'gosavi': // Green Optimized Soil Adjusted Vegetation Index
            var i_gosavi = image.expression('(NIR - GREEN) / (NIR + GREEN + Y)',
											{
												'NIR': image.select('B8'),
												'GREEN': image.select('B3'),
												'Y': 0.16
											}).rename('GOSAVI');
            var newImage = image.addBands(i_gosavi);
            return newImage;
        case 'evi': // Enhanced Vegetation Index
            var i_evi = image.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 10000))',
										 {
											 'NIR': image.select('B8'),
											 'RED': image.select('B4'),
											 'BLUE': image.select('B2')
										 }).rename('EVI');
			var newImage = image.addBands(i_evi);
            return newImage;
        case 'evi2': // Enhanced Vegetation Index 2 (Without the blue band)
            var i_evi2 = image.expression('2.4 * ((NIR - RED) / (NIR + 2.4 * RED + 1))',
										  {
											  'NIR': image.select('B8'),
											  'RED': image.select('B4')
										  }).rename('EVI2');
            var newImage = image.addBands(i_evi2);
            return newImage;
        case 'gemi': // Global Environmental Monitoring Index
            var i_gemi = image.expression('(((NIR_POW - RED_POW) * 2 + (NIR * 1.5) + (RED * 0.5))/(NIR + RED + 0.5)) * (1 - ((((NIR_POW - RED_POW) * 2 + (NIR * 1.5) + (RED * 0.5)) / (NIR + RED + 0.5)) * 0.25)) - ((RED - 0.125) / (1 - RED))',
										  {
											  'RED': image.select('B4'),
											  'NIR': image.select('B8'),
											  'RED_POW': image.select('B4').pow(2),
											  'NIR_POW': image.select('B8').pow(2)
										  }).rename('GEMI');
            var newImage = image.addBands(i_gemi);
            return newImage;
        case 'rvi': // Ratio Vegetation Index
            var i_rvi = image.expression('RED / NIR',
										 {
											 'NIR': image.select('B8'),
											 'RED': image.select('B4')
										 }).rename('RVI');
            var newImage = image.addBands(i_rvi);
            return newImage;
        case 'logr': // Log Ratio
            var i_logr_semlog = image.expression('RED / NIR',
												 {
													 'NIR': image.select('B8'),
													 'RED': image.select('B4')
												 });
            var i_logr_comlog = i_logr_semlog.log().rename('logR');
            var newImage = image.addBands(i_logr_comlog);
            return newImage;
        case 'tvi': // Transformed Vegetation Index
            var i_ndvi_temp = image.normalizedDifference(['B8', 'B4']);
            var i_tvi_temp = image.expression('NDVI + 0.5',
											  {
												  'NDVI': i_ndvi_temp
											  });
            var i_tvi = i_tvi_temp.sqrt().rename('TVI');
            var newImage = image.addBands(i_tvi);
            return newImage;
        }
    } else { // END OF SWITCH 
        // Gen ALL indices
        var i_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
        var i_ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
        var i_ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');
        var i_mndwi = image.normalizedDifference(['B3', 'B12']).rename('MNDWI');
        var i_mndvi = image.normalizedDifference(['B9', 'B12']).rename('MNDVI');
        var i_ngrdi = image.normalizedDifference(['B3', 'B5']).rename('NGRDI');
        var i_ndsi = image.normalizedDifference(['B11', 'B12']).rename('NDSI');
        var i_ri = image.normalizedDifference(['B5', 'B3']).rename('RI');
        var i_ndmi = image.normalizedDifference(['B9', 'B12']).rename('NDMI');
        var i_gndvi = image.normalizedDifference(['B9', 'B3']).rename('GNDVI');
        var i_bndvi = image.normalizedDifference(['B9', 'B1']).rename('BNDVI');
        var i_nbr = image.normalizedDifference(['B9', 'B12']).rename('NBR');
        var i_ppr = image.normalizedDifference(['B9', 'B12']).rename('PPR');
        var i_ndre = image.normalizedDifference(['B9', 'B5']).rename('NDRE');
        var i_lci = image.normalizedDifference(['B8', 'B5']).rename('LCI');
        var i_savi = image.expression('(1 + L) * (NIR - RED) / (NIR + RED + L)',
									  {
										  'NIR': image.select('B8'),
										  'RED': image.select('B4'),
										  'L': 0.5
									  }).rename('SAVI');
        var i_gosavi = image.expression('(NIR - GREEN) / (NIR + GREEN + Y)',
										{
											'NIR': image.select('B8'),
											'GREEN': image.select('B3'),
											'Y': 0.16
										}).rename('GOSAVI');
        var i_evi = image.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 10000))',
									 {
										 'NIR': image.select('B8'),
										 'RED': image.select('B4'),
										 'BLUE': image.select('B2')
									 }).rename('EVI');
        var i_evi2 = image.expression('2.4 * ((NIR - RED) / (NIR + 2.4 * RED + 1))',
									  {
										  'NIR': image.select('B8'),
										  'RED': image.select('B4')
									  }).rename('EVI2');
        var i_rvi = image.expression('RED / NIR',
									 {
										 'NIR': image.select('B8'),
										 'RED': image.select('B4')
									 }).rename('RVI');
        var i_logr_semlog = image.expression('RED / NIR',
											 {
												 'NIR': image.select('B8'),
												 'RED': image.select('B4')
											 });
        var i_logr_comlog = i_logr_semlog.log().rename('logR');
        var i_ndvi_temp = image.normalizedDifference(['B8', 'B4']);
        var i_tvi_temp = image.expression('NDVI + 0.5',
										  {
											  'NDVI': i_ndvi_temp
										  });
        var i_tvi = i_tvi_temp.sqrt().rename('TVI');
        var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_mndwi, i_mndvi, i_ngrdi,
                                       i_ndsi, i_ri, i_ndmi, i_gndvi, i_bndvi, i_nbr, i_ppr,
                                       i_ndre, i_lci, i_savi, i_gosavi, i_evi, i_evi2, i_rvi,
                                       i_logr_comlog, i_tvi]);
        return newImage;
    }
}


/*
  load_image:
  Function to get an example image to debug or test some code. 

  Params:
  optional (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.
  optional (number) year - the year of the image that you want to get.
  optional (list) roi - the latitude and longitude of a roi.
  optional (bool) cloudFree - true for cloud mask processing and mean calculation. 
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var image = geet.load_image(); // Returns a TOA image

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var image = geet.load_image('SR', 2015); // Returns a SR image
*/
var load_image = function (collection, year, roi, cloudFree) {
    // Setup
    var visParams = { bands: ['B4', 'B3', 'B2'], max: 0.3 };

    // Default params
    collection = typeof collection !== 'undefined' ? collection : 'TOA';
    roi = typeof roi !== 'undefined' ? roi : ee.Geometry.Point(-43.25, -22.90);
    year = typeof year !== 'undefined' ? year : 2015;
    cloudFree = typeof cloudFree !== 'undefined' ? cloudFree : true;
    
    // Check collection
    if (year >= 2013) {
        if (collection === 'RAW') {
			collection = 'LANDSAT/LC08/C01/T1';
			visParams = {
				bands: ['B4', 'B3', 'B2'], min: 6809, max: 12199
			};
        } else if (collection === 'TOA') {
			collection = 'LANDSAT/LC08/C01/T1_TOA';
        } else if (collection === 'SR') {
			collection = 'LANDSAT/LC08/C01/T1_SR';
			visParams = {
				bands: ['B4', 'B3', 'B2'], min: 104, max: 1632
			};
        } else {
			print("Error: Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
        }
    } else if (year < 2013 && year >= 1985) {
        if (collection === 'RAW') {
			collection = 'LANDSAT/LT05/C01/T1';
			visParams = {
				bands: ['B4', 'B3', 'B2'], min: 6809, max: 12199
			};
        } else if (collection === 'TOA') {
			collection = 'LANDSAT/LT05/C01/T1_TOA';
        } else if (collection === 'SR') {
			collection = 'LANDSAT/LT05/C01/T1_SR';
			visParams = {
				bands: ['B4', 'B3', 'B2'], min: 104, max: 1632
			};
        } else {
			print("Error: Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
        }
    } else {
        print('Error: Wrong year parameter');
    }

    var start = '-01-01';
    var finish = '-12-31';
    var ic = ee.ImageCollection(collection);

    if (cloudFree === true) {
        var noclouds = function (image) {
			// var mask = image.select(['fmask']).neq(4);
			// return image.updateMask(mask);
			var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
			var mask = scored.select(['cloud']).lte(20);
			return image.updateMask(mask);
        };

        var image = ee.ImageCollection(ic
									   .filterBounds(roi)
									   .filterDate(year.toString() + start, year.toString() + finish)
									   .sort('CLOUD_COVER'))
			.map(noclouds);
        
        var result_image = image.median();
    } else {
        var result_image = ee.Image(ic
									.filterBounds(roi)
									.filterDate(year.toString() + start, year.toString() + finish)
									.sort('CLOUD_COVER')
									.first());
    }

    var title = "load_image";
    var titleName = title + '_' + year.toString();
    Map.addLayer(result_image, visParams, titleName);
    print(result_image);
    return result_image;
};


/*
  collection2image:
  Function to merge all imagens of one image collection into a single band. 

  Params:
  (ee.Image) image - The image of the image collection to add as a band.
  (ee.Image) previous - The output image.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var merged_image = image_collection.iterate(geet.collection2image, ee.Image([]));
*/
var collection2image = function (image, previous) {
    return ee.Image(previous).addBands(image);
};


/*
  toa_radiance:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var new_toa_radiance = geet.toa_radiance_ls5(img, 10); // ee.Image

  Information:
  Formula:     Lλ = MLQcal + AL
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)
  Qcal         = Quantized and calibrated standard product pixel values (DN)
*/
var toa_radiance = function (image, band) {
    // Error Handling
    if (image === undefined) error('toa_radiance', 'You need to specify an input image.');
    if (band === undefined) error('toa_radiance', 'You need to specify the number of the band that you want to process.');

    var band_to_toa = image.select('B' + band.toString());
    var radiance_multi_band = ee.Number(image.get('RADIANCE_MULT_BAND_' + band.toString())); // Ml
    var radiance_add_band = ee.Number(image.get('RADIANCE_ADD_BAND_' + band.toString())); // Al
    var toa_radiance = band_to_toa.expression(
        '(Ml * band) + Al', {
			'Ml': radiance_multi_band,
			'Al': radiance_add_band,
			'band': band_to_toa
        }).rename('TOA_Radiance');
    var img_radiance = image.addBands(toa_radiance);
    return img_radiance;
}


/*
  toa_reflectance:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var new_toa_reflectance = geet.toa_reflectance(img, 10); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)
*/
var toa_reflectance = function (image, band) {
    // Error Handling
    if (image === undefined) error('toa_reflectance', 'You need to specify an input image.');
    if (band === undefined) error('toa_reflectance', 'You need to specify the number of the band that you want to process.');

    var band_to_toa = image.select('B' + band.toString());
    var reflectance_multi_band = ee.Number(image.get('REFLECTANCE_MULT_BAND_' + band.toString())); // Mp
    var reflectance_add_band = ee.Number(image.get('REFLECTANCE_ADD_BAND_' + band.toString())); // Ap
    var toa = band_to_toa.expression(
        '(Mp * image) + Ap', {
			'Mp': reflectance_multi_band,
			'Ap': reflectance_add_band,
			'image': band_to_toa
        }).rename('B' + band.toString() + '_TOA_Reflectance');
    return toa;
}

// Solar Angle function for Landsat 8 Reflectance correction processing (Local sun elevation angle)
function solarAngleElevation(original_img, raw_reflectance) {
    var sun_elevation = ee.Number(original_img.get('SUN_ELEVATION'));
    var sin_sun_elevation = sun_elevation.sin();
    var toa = raw_reflectance.divide(sin_sun_elevation).rename('TOA_Reflectance_SE');
    return toa;
}

// Solar Angle function for Landsat 8 Reflectance correction processing (Local solar zenith angle)
function solarAngleZenith(original_img, raw_reflectance) {
    var sun_elevation = ee.Number(original_img.get('SUN_ELEVATION'));
    var solar_zenith = ee.Number(90).subtract(sun_elevation);
    var cos_sun_elevation = solar_zenith.cos();
    var toa = raw_reflectance.divide(cos_sun_elevation).rename('TOA_Reflectance_SZ');
    return toa;
}

/*
  toa_reflectance_l8:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance
  Landsat 8 version with Solar Angle correction.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var new_toa_reflectance_sz = geet.toa_reflectance_l8(img, 10, 'SZ'); // ee.Image

  or

  var geet = require('users/elacerda/geet:geet'); 
  var new_toa_reflectance_se = geet.toa_reflectance_l8(img, 10, 'SE'); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)

  SE = Local sun elevation angle. The scene center sun elevation angle in degrees is provided in the metadata (SUN_ELEVATION).
  SZ = Local solar zenith angle: SZ = 90° - SE
*/
var toa_reflectance_l8 = function (image, band, _solarAngle) {
    // Error Handling
    if (image === undefined) error('toa_reflectance_l8', 'You need to specify an input image.');
    if (band === undefined) error('toa_reflectance_l8', 'You need to specify the number of the band that you want to process.');
    if (_solarAngle === undefined) error('toa_reflectance_l8', 'You need to specify the solar angle mode.');

    if (_solarAngle !== undefined) {
        var solarAngle = _solarAngle;
        if (solarAngle !== 'SZ' && solarAngle !== 'SE') {
			print("Error: You need to choose one of two modes:");
			print("Error: 'SE' for the local sun elevation angle or 'SZ' for the Local solar zenith angle.");
			print("Warning: 'SZ' will be set as default mode.")
			solarAngle = 'SZ';
        }
    } else {
        solarAngle = 'SZ';
    }

    if (solarAngle === 'SE') {
        var band_to_toa = image.select('B' + band.toString());
        var reflectance_multi_band = ee.Number(image.get('REFLECTANCE_MULT_BAND_' + band.toString())); // Mp
        var reflectance_add_band = ee.Number(image.get('REFLECTANCE_ADD_BAND_' + band.toString())); // Ap
        var toa = band_to_toa.expression(
			'(Mp * image) + Ap', {
				'Mp': reflectance_multi_band,
				'Ap': reflectance_add_band,
				'image': band_to_toa
			}).rename('B' + band.toString() + '_TOA_Reflectance_SE');
        var img_se = solarAngleElevation(image, toa);
        return img_se;
    }

    if (solarAngle === 'SZ') {
        var band_to_toa = image.select('B' + band.toString());
        var reflectance_multi_band = ee.Number(image.get('REFLECTANCE_MULT_BAND_' + band.toString())); // Mp
        var reflectance_add_band = ee.Number(image.get('REFLECTANCE_ADD_BAND_' + band.toString())); // Ap
        var toa = band_to_toa.expression(
			'(Mp * image) + Ap', {
				'Mp': reflectance_multi_band,
				'Ap': reflectance_add_band,
				'image': band_to_toa
			}).rename('B' + band.toString() + '_TOA_Reflectance_SZ');
        var img_sz = solarAngleZenith(image, toa);
        return img_sz;
    }
}


/*
  brightness_temp_l5k:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 5 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l5k(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l5k = function (image) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l5k', 'You need to specify an input image.');

    // landsat 5 constants
    var K1 = 607.76
    var K2 = 1260.56

    var brightness_temp_semlog = image.expression(
        'K1 / B6 + 1', {
			'K1': K1,
			'B6': image.select('TOA_Radiance')
        });

    var brightness_temp_log = brightness_temp_semlog.log();

    var brightness_temp = image.expression(
        'K2 / brightness_temp_log', {
			'K2': K2,
			'brightness_temp_log': brightness_temp_log
        }).rename('Brightness_Temperature');

    var img_brightness_temp = image.addBands(brightness_temp);
    return img_brightness_temp;
}


/*
  brightness_temp_l5c:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 5 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l5c(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l5c = function (image) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l5c', 'You need to specify an input image.');

    // landsat 5 constants
    var K1 = 607.76
    var K2 = 1260.56

    var brightness_temp_semlog = image.expression(
        'K1 / B6 + 1', {
			'K1': K1,
			'B6': image.select('TOA_Radiance')
        });

    var brightness_temp_log = brightness_temp_semlog.log();

    var brightness_temp = image.expression(
        'K2 / brightness_temp_log', {
			'K2': K2,
			'brightness_temp_log': brightness_temp_log
        }).rename('Brightness_Temperature');

    var brightness_temp_celsius = brightness_temp.subtract(273.5);
    var img_brightness_temp = image.addBands(brightness_temp_celsius);
    return img_brightness_temp;
}

/*
  brightness_temp_l7k:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 7 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l7k(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l7k = function (image) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l7k', 'You need to specify an input image.');

    // landsat 7 constants
    var K1 = 666.09
    var K2 = 1282.71

    var brightness_temp_semlog = image.expression(
        'K1 / B6 + 1', {
			'K1': K1,
			'B6': image.select('TOA_Radiance')
        });

    var brightness_temp_log = brightness_temp_semlog.log();

    var brightness_temp = image.expression(
        'K2 / brightness_temp_log', {
			'K2': K2,
			'brightness_temp_log': brightness_temp_log
        }).rename('Brightness_Temperature');

    var img_brightness_temp = image.addBands(brightness_temp);
    return img_brightness_temp;
}


/*
  brightness_temp_l7c:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 7 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l7c(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l7c = function (image) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l7c', 'You need to specify an input image.');

    // landsat 7 constants
    var K1 = 666.09
    var K2 = 1282.71

    var brightness_temp_semlog = image.expression(
        'K1 / B6 + 1', {
			'K1': K1,
			'B6': image.select('TOA_Radiance')
        });

    var brightness_temp_log = brightness_temp_semlog.log();

    var brightness_temp = image.expression(
        'K2 / brightness_temp_log', {
			'K2': K2,
			'brightness_temp_log': brightness_temp_log
        }).rename('Brightness_Temperature');

    var brightness_temp_celsius = brightness_temp.subtract(273.5);
    var img_brightness_temp = image.addBands(brightness_temp_celsius);
    return img_brightness_temp;
}


/*
  brightness_temp_l8k:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 8 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  (boolean) two_channel - if false, will process only the B10 band, if true, will consider B11 too. Default its true!
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l8k(toa_image); // ee.Image

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l8k(toa_image, false); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l8k = function (image, two_channel) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l8k', 'You need to specify an input image.');
    if (two_channel === undefined) error('brightness_temp_l8k', 'You need to specify an boolean value to process only B10 or B10 and B11.');

    var two_channel = (arguments[1] !== void 1 ? false : true);
    // default is true - double band (B10 and B11) processing
    if (two_channel === true) {
        var K1_10 = ee.Number(image.get('K1_CONSTANT_BAND_10'));
        var K2_10 = ee.Number(image.get('K2_CONSTANT_BAND_10'));
        var K1_11 = ee.Number(image.get('K1_CONSTANT_BAND_11'));
        var K2_11 = ee.Number(image.get('K2_CONSTANT_BAND_11'));

        var brightness_temp_semlog = image.expression(
			'K1 / B10 + 1', {
				'K1': K1_10,
				'B10': image.select('TOA_Radiance')
			});

        var brightness_temp_log = brightness_temp_semlog.log();

        var brightness_temp = image.expression(
			'K2 / brightness_temp_log', {
				'K2': K2_10,
				'brightness_temp_log': brightness_temp_log
			}).rename('Brightness_Temperature');

        var img_brightness_temp = image.addBands(brightness_temp);
        return img_brightness_temp;
    } else {
        // false - single band (B10) processing
        var K1_10 = ee.Number(image.get('K1_CONSTANT_BAND_10'));
        var K2_10 = ee.Number(image.get('K2_CONSTANT_BAND_10'));

        var brightness_temp_semlog = image.expression(
			'K1 / B10 + 1', {
				'K1': K1_10,
				'B10': image.select('TOA_Radiance')
			});

        var brightness_temp_log = brightness_temp_semlog.log();

        var brightness_temp = image.expression(
			'K2 / brightness_temp_log', {
				'K2': K2_10,
				'brightness_temp_log': brightness_temp_log
			}).rename('Brightness_Temperature');

        var img_brightness_temp = image.addBands(brightness_temp);
        return img_brightness_temp;
    }
}


/*
  brightness_temp_l8c:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 8 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  (boolean) two_channel - if false, will process only the B10 band, if true, will consider B11 too. Default its true!
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l8c(toa_image); // ee.Image

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var brightness_temp_img = geet.brightness_temp_l8c(toa_image, false); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
var brightness_temp_l8c = function (image, two_channel) {
    // Error Handling
    if (image === undefined) error('brightness_temp_l8c', 'You need to specify an input image.');
    if (two_channel === undefined) error('brightness_temp_l8c', 'You need to specify an boolean value to process only B10 or B10 and B11.');

    var two_channel = (arguments[1] !== void 1 ? false : true);
    // false - double band (B10 and B11) processing
    if (two_channel === false) {
        var K1_10 = ee.Number(image.get('K1_CONSTANT_BAND_10'));
        var K2_10 = ee.Number(image.get('K2_CONSTANT_BAND_10'));
        var K1_11 = ee.Number(image.get('K1_CONSTANT_BAND_11'));
        var K2_11 = ee.Number(image.get('K2_CONSTANT_BAND_11'));

        var brightness_temp_semlog = image.expression(
			'K1 / B10 + 1', {
				'K1': K1_10,
				'B10': image.select('TOA_Radiance')
			});

        var brightness_temp_log = brightness_temp_semlog.log();

        var brightness_temp = image.expression(
			'K2 / brightness_temp_log', {
				'K2': K2_10,
				'brightness_temp_log': brightness_temp_log
			}).rename('Brightness_Temperature');

        var brightness_temp_celsius = brightness_temp.subtract(273.5);
        var img_brightness_temp = image.addBands(brightness_temp_celsius);
        return img_brightness_temp;
    } else {
        // default is true - single band (B10) processing
        var K1_10 = ee.Number(image.get('K1_CONSTANT_BAND_10'));
        var K2_10 = ee.Number(image.get('K2_CONSTANT_BAND_10'));

        var brightness_temp_semlog = image.expression(
			'K1 / B10 + 1', {
				'K1': K1_10,
				'B10': image.select('TOA_Radiance')
			});

        var brightness_temp_log = brightness_temp_semlog.log();

        var brightness_temp = image.expression(
			'K2 / brightness_temp_log', {
				'K2': K2_10,
				'brightness_temp_log': brightness_temp_log
			}).rename('Brightness_Temperature');

        var brightness_temp_celsius = brightness_temp.subtract(273.5);
        var img_brightness_temp = image.addBands(brightness_temp_celsius);
        return img_brightness_temp;
    }
}

/*
  resample:
  Function to resample an input image.

  Params:
  (ee.Image) image - the image to resample.
  (number) scale - the number of the spatial resolution that you
  want to use to  resample the input image.
  (string) mode - The interpolation mode to use. One of 'bilinear' or 'bicubic'.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var landsat_10m = geet.resample(L8_img, 10, 'bilinear'); 
*/
var resample = function (image, scale, mode) {
    // Error Handling
    if (image === undefined) error('resample', 'You need to specify an input image.');
    if (scale === undefined) error('resample', 'You need to specify the scale number.');
    if (mode === undefined) error('resample', 'You need to specify the resample mode (bilinear or bicubic).');

    // Get the projection information from a band.
    var band = image.select('B2');

    var resampled_image = image.resample(mode).reproject({
        crs: band.projection().crs(),
        scale: scale
    });

    return resampled_image;
}

/*
  resample_band:
  Function to resample just a single band.

  Params:
  (ee.Image) band - the band to resample.
  (number) scale - the number of the spatial resolution that you
  want to use to  resample the input band.
  (string) mode - The interpolation mode to use. One of 'bilinear' or 'bicubic'.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var landsatB10_60m = geet.resample_band(b10, 60);
*/
var resample_band = function (band, scale, mode) {
    // Error Handling
    if (image === undefined) error('resample_band', 'You need to specify an input image.');
    if (scale === undefined) error('resample_band', 'You need to specify the scale number.');
	if (mode === undefined) error('resample', 'You need to specify the resample mode (bilinear or bicubic).');

    var resampled_band = band.resample(mode).reproject({
        crs: band.projection().crs(),
        scale: scale
    });
    return resampled_band;
}

/*
  load_id_s2:
  Function to filter the Sentinel-2 collection by Product ID obtained from the
  Copernicus Open Access Hub.

  Params:
  (string) id - the id of the Sentinel 2 image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var s2_image = geet.load_id_s2('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');
*/
var load_id_s2 = function (id) {
    // Error Handling
    if (id === undefined) error('load_id_s2', 'You need to specify the id number.');

    var id = id.toString();
    var s2 = ee.ImageCollection("COPERNICUS/S2");
    var s2_filtered = s2.filterMetadata('PRODUCT_ID', 'equals', id);
    return s2_filtered;
}


/*
  build_landsat_timeseries:
  Function to build a annual Landsat surface reflectance timeseries from 1985 to 2017.
  The function also mask clouds and shadow and create some indices bands like NDVI, NDWI and SAVI.

  Params:
  (ee.Point) roi - the region of interest that will define the study area and the landsat path row  

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var ls_timeserie = geet.build_landsat_timeseries(roi);
*/
var build_landsat_timeseries = function (roi) {

	roi = typeof roi !== 'undefined' ? roi : ee.Geometry.Point([-43.0879, -22.8632]);

	var ls5_sr = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR"),
		ls7_sr = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR"),
		ls8_sr = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");
		
	var ls5_ic = ee.ImageCollection(ls5_sr)
		.filterBounds(roi)
		.filterDate('1985-01-01', '2011-12-31')

	var ls7_ic = ee.ImageCollection(ls7_sr)
		.filterBounds(roi)
		.filterDate('1999-01-01', '2017-12-31')

	var ls8_ic = ee.ImageCollection(ls8_sr)
		.filterBounds(roi)
		.filterDate('2013-05-01', '2017-12-31')

	
	function rename_bands_tm(image) {
		var bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'NDVI', 'NDWI', 'SAVI'];
		var new_bands = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'NDVI', 'NDWI', 'SAVI'];
		return image.select(bands).rename(new_bands);
	}

	function rename_bands_oli(image) {
		var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'NDVI', 'NDWI', 'SAVI'];
		var new_bands = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'NDVI', 'NDWI', 'SAVI'];
		return image.select(bands).rename(new_bands);
	}
	
	function calc_indices(image, satellite) {
		var ls_idx = landsat_indices(image, satellite);
		return ls_idx;
	}

	function mask_clouds(original_image, qa_band) {
		var masked_image = cloudmask_sr(original_image, qa_band);
		return masked_image;
	}

	function merge_bands (image, previous) {
		return ee.Image(previous).addBands(image);
	};

	
	var ls5_ic_idx = ls5_ic.map(function (image) { return calc_indices(image, "L5"); })
		.map(function (image) { return mask_clouds(image, image.select("pixel_qa")); })
		.map(rename_bands_tm);

	var ls7_ic_idx = ls7_ic.map(function (image) { return calc_indices(image, "L7"); })
		.map(function (image) { return mask_clouds(image, image.select("pixel_qa")); })
		.map(rename_bands_tm);

	var ls8_ic_idx = ls8_ic.map(function (image) { return calc_indices(image, "L8"); })
		.map(function (image) { return mask_clouds(image, image.select("pixel_qa")); })
		.map(rename_bands_oli);

	
	function collection_by_year_tm(collection_ls5, collection_ls7) {
		var start = '-01-01';
		var finish = '-12-31';
		var year_col_list = ee.List([]);
		
		
		for (var year = 1985; year <= 2012; year++) {
			
			var temp_col_list = ee.List([]);
			
			if (year >= 1999)
			{
				var year_col_ls5 = collection_ls5.filterDate(year.toString() + start, year.toString() + finish);
				var year_col_ls7 = collection_ls7.filterDate(year.toString() + start, year.toString() + finish);
				var collection = year_col_ls5.merge(year_col_ls7);
			}
			else
			{
				var collection = collection_ls5.filterDate(year.toString() + start, year.toString() + finish);
			}

			var new_blue = collection.select('BLUE').median();
			temp_col_list = temp_col_list.add(new_blue);
			var new_green = collection.select('GREEN').median();
			temp_col_list = temp_col_list.add(new_green);
			var new_red = collection.select('RED').median();
			temp_col_list = temp_col_list.add(new_red);
			var new_nir = collection.select('NIR').median();
			temp_col_list = temp_col_list.add(new_nir);
			var new_swir1 = collection.select('SWIR1').median();
			temp_col_list = temp_col_list.add(new_swir1);
			var new_swir2 = collection.select('SWIR2').median();
			temp_col_list = temp_col_list.add(new_swir2);
			var new_ndvi = collection.select('NDVI').max();
			temp_col_list = temp_col_list.add(new_ndvi);
			var new_ndwi = collection.select('NDWI').max();
			temp_col_list = temp_col_list.add(new_ndwi);
			var new_savi = collection.select('SAVI').max();
			temp_col_list = temp_col_list.add(new_savi);
			
			var by_year_temp = ee.ImageCollection(temp_col_list);
			var merged = by_year_temp.iterate(merge_bands, ee.Image([]));
			year_col_list = year_col_list.add(merged);
		}

		var by_year = ee.ImageCollection(year_col_list)
		return by_year;
	}


	function collection_by_year_oli(collection_ls8) {
		var start = '-01-01';
		var finish = '-12-31';
		var year_col_list = ee.List([]);
		
		
		for (var year = 2013; year <= 2017; year++) {
			var temp_col_list = ee.List([]);
			var collection = collection_ls8.filterDate(year.toString() + start, year.toString() + finish);

			var new_blue = collection.select('BLUE').median();
			temp_col_list = temp_col_list.add(new_blue);
			var new_green = collection.select('GREEN').median();
			temp_col_list = temp_col_list.add(new_green);
			var new_red = collection.select('RED').median();
			temp_col_list = temp_col_list.add(new_red);
			var new_nir = collection.select('NIR').median();
			temp_col_list = temp_col_list.add(new_nir);
			var new_swir1 = collection.select('SWIR1').median();
			temp_col_list = temp_col_list.add(new_swir1);
			var new_swir2 = collection.select('SWIR2').median();
			temp_col_list = temp_col_list.add(new_swir2);
			var new_ndvi = collection.select('NDVI').max();
			temp_col_list = temp_col_list.add(new_ndvi);
			var new_ndwi = collection.select('NDWI').max();
			temp_col_list = temp_col_list.add(new_ndwi);
			var new_savi = collection.select('SAVI').max();
			temp_col_list = temp_col_list.add(new_savi);

			var by_year_temp = ee.ImageCollection(temp_col_list);
			var merged = by_year_temp.iterate(merge_bands, ee.Image([]));
			year_col_list = year_col_list.add(merged);
		}
		
		var by_year = ee.ImageCollection(year_col_list)
		return by_year;
	}
	

	var tm_by_year = collection_by_year_tm(ls5_ic_idx, ls7_ic_idx);
	var oli_by_year = collection_by_year_oli(ls8_ic_idx);

	var merged_collections_by_year = tm_by_year.merge(oli_by_year);

	// Add Metadata to merged_collections_by_year (year of each image)
	var merged_list = merged_collections_by_year.toList(merged_collections_by_year.size());
	var temp_merged_list = ee.List([]);
	var num_of_imgs = merged_collections_by_year.size().getInfo();
	num_of_imgs--;
	for(var i = 0; i <= num_of_imgs; i++) {
		var img = ee.Image(merged_list.get(i));
		img = img.set("Year", (i + 1985).toString());
		temp_merged_list = temp_merged_list.add(img);
	}
	merged_collections_by_year = ee.ImageCollection(temp_merged_list);
	
	return(merged_collections_by_year);
}


/*
  landsat_collection_by_pathrow:
  Function that return a image collection with all landsat images (5, 7 and 8) 
  from a defined path row. Remember to specify the type of the collection (raw, toa or sr).

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var ls_collection = geet.landsat_collection_by_pathrow('SR', 220, 77);
*/
var landsat_collection_by_pathrow = function (type, path, row) {
	
    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
	path = typeof path !== 'undefined' ? path : 217;
	row = typeof row !== 'undefined' ? row : 76;
	
	switch (type) {
    case 'raw':
        var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
    	var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
    		.filter(ee.Filter.eq('WRS_ROW', row));
    	var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
		var all_ls_collection = ls5_collection.merge(ls7_collection).merge(ls8_collection);
        return all_ls_collection;
    case 'toa':
        var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
    	var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
    		.filter(ee.Filter.eq('WRS_ROW', row));
    	var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
		var all_ls_collection = ls5_collection.merge(ls7_collection).merge(ls8_collection);
        return all_ls_collection;
    case 'sr':
        var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
			.filter(ee.Filter.eq('WRS_PATH', path))
			.filter(ee.Filter.eq('WRS_ROW', row));
    	var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    		.filter(ee.Filter.eq('WRS_PATH', path))
    		.filter(ee.Filter.eq('WRS_ROW', row));
    	var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    		.filter(ee.Filter.eq('WRS_PATH', path))
    		.filter(ee.Filter.eq('WRS_ROW', row));
    	var all_ls_collection = ls5_collection.merge(ls7_collection).merge(ls8_collection);
        return all_ls_collection;
    }
}


/*
  ls5_collection_by_pathrow:
  Function that return a image collection with all landsat 5 images from a defined path row.

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var ls_collection = geet.ls5_collection_by_pathrow('SR', 220, 77);
*/
var ls5_collection_by_pathrow = function (type, path, row) {
	
    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
	path = typeof path !== 'undefined' ? path : 217;
	row = typeof row !== 'undefined' ? row : 76;
	
    switch (type) {
    case 'raw':
        var l5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l5_collection;
    case 'toa':
        var l5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l5_collection;
    case 'sr':
        var l5_collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
			.filter(ee.Filter.eq('WRS_PATH', path))
			.filter(ee.Filter.eq('WRS_ROW', row));
        return l5_collection;
    }
}


/*
  ls7_collection_by_pathrow:
  Function that return a image collection with all landsat 7 images from a defined path row.

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var ls_collection = geet.ls7_collection_by_pathrow('SR', 220, 77);
*/
var ls7_collection_by_pathrow = function (type, path, row) {
	
    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
	path = typeof path !== 'undefined' ? path : 217;
	row = typeof row !== 'undefined' ? row : 76;
	
    switch (type) {
    case 'raw':
        var l7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l7_collection;
    case 'toa':
        var l7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l7_collection;
    case 'sr':
        var l7_collection = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
			.filter(ee.Filter.eq('WRS_PATH', path))
			.filter(ee.Filter.eq('WRS_ROW', row));
        return l7_collection;
    }
}


/*
  ls8_collection_by_pathrow:
  Function that return a image collection with all landsat 8 images from a defined path row..

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var ls_collection = geet.ls8_collection_by_pathrow('SR', 220, 77);
*/
var ls8_collection_by_pathrow = function (type, path, row) {
	
    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
	path = typeof path !== 'undefined' ? path : 217;
	row = typeof row !== 'undefined' ? row : 76;
	
    switch (type) {
    case 'raw':
        var l8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l8_collection;
    case 'toa':
        var l8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
            .filter(ee.Filter.eq('WRS_PATH', path))
            .filter(ee.Filter.eq('WRS_ROW', row));
        return l8_collection;
    case 'sr':
        var l8_collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
			.filter(ee.Filter.eq('WRS_PATH', path))
			.filter(ee.Filter.eq('WRS_ROW', row));
        return l8_collection;
    }
}


/*
  mosaic_s2:
  Function to build a cloud free TOA mosaic using the Sentinel 2 dataset.

  Params:
  (string) startDate - the start date of the dataset.
  (string) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/elacerda/geet:geet'); 
  var s2_mosaic = geet.mosaic_s2('2016-01-01', '2016-12-31', roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var s2_mosaic = geet.mosaic_s2('2016-01-01', '2016-12-31', roi, false); // Doesnt display the mosaic
*/
var mosaic_s2 = function (startDate, endDate, roi, showMosaic) {
    // Error Handling
    if (startDate === undefined) error('mosaic_s2', 'You need to specify the start date of the image series.');
    if (endDate === undefined) error('mosaic_s2', 'You need to specify the end  date of the image series.');


    var s2 = ee.ImageCollection('COPERNICUS/S2');

    // Default params
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;

    if (roi === undefined) {
        var composite = s2.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUDY_PIXEL_PERCENTAGE', false)
			.map(function (image) {
				return image.addBands(image.metadata('system:time_start'));
			})
			.mosaic();
    } else {
        composite = s2.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUDY_PIXEL_PERCENTAGE', false)
			.filterBounds(roi)
			.mosaic();
    }

    if (showMosaic === true) {
        Map.addLayer(composite, { bands: ['B2', 'B3', 'B4'], min: 400, max: 2811 }, 'S2_Mosaic');
    } else {
        return composite;
    }
    return composite;
}


/*
  mosaic_l5:
  Function to build a cloud free mosaic using the Landsat 5 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l5_mosaic = geet.mosaic_l5('2005-01-01', '2005-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/elacerda/geet:geet'); 
  var l5_mosaic = geet.mosaic_l5(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var l5_mosaic = geet.mosaic_l5('2005-01-01', '2005-12-31', roi, false); // Doesnt display the mosaic
*/
var mosaic_l5 = function (startDate, endDate, roi, showMosaic) {
    // Error Handling
    if (startDate === undefined) error('mosaic_l5', 'You need to specify the start date of the image series.');
    if (endDate === undefined) error('mosaic_l5', 'You need to specify the end  date of the image series.');


    var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA');

    // Default params
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;

    if (roi === undefined) {
        var composite = l5
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    } else {
        composite = l5
			.filterBounds(roi)
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    }

    if (showMosaic === true) {
        Map.addLayer(composite, { bands: ['B1', 'B2', 'B3'], min: 0, max: 0.5, gamma: [0.95, 1.1, 1] }, 'L5_Mosaic');
    } else {
        return composite;
    }
    return composite;
}


/*
  mosaic_l7:
  Function to build a cloud free mosaic using the Landsat 7 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l7_mosaic = geet.mosaic_l7('2003-01-01', '2003-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/elacerda/geet:geet'); 
  var l7_mosaic = geet.mosaic_l7(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var l7_mosaic = geet.mosaic_l7('2003-01-01', '2003-12-31', roi, false); // Doesnt display the mosaic
*/
var mosaic_l7 = function (startDate, endDate, roi, showMosaic) {
    // Error Handling
    if (startDate === undefined) error('mosaic_l7', 'You need to specify the start date of the image series.');
    if (endDate === undefined) error('mosaic_l7', 'You need to specify the end  date of the image series.');

    var l7 = ee.ImageCollection('LANDSAT/LT07/C01/T1_TOA');

    // Default params
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;

    if (roi === undefined) {
        var composite = l7
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    } else {
        composite = l7
			.filterBounds(roi)
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    }

    if (showMosaic === true) {
        Map.addLayer(composite, { bands: ['B1', 'B2', 'B3'], min: 0, max: 0.5, gamma: [0.95, 1.1, 1] }, 'L5_Mosaic');
    } else {
        return composite;
    }
    return composite;
}


/*
  mosaic_l8:
  Function to build a cloud free mosaic using the Landsat 7 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l8_mosaic = geet.mosaic_l8('2015-01-01', '2015-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/elacerda/geet:geet'); 
  var l8_mosaic = geet.mosaic_l8(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var l8_mosaic = geet.mosaic_l8('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
*/
var mosaic_l8 = function (startDate, endDate, roi, showMosaic) {
    // Error Handling
    if (startDate === undefined) error('mosaic_l8', 'You need to specify the start date of the image series.');
    if (endDate === undefined) error('mosaic_l8', 'You need to specify the end  date of the image series.');

    var l8 = ee.ImageCollection('LANDSAT/LT08/C01/T1_TOA');

    // Default params
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;

    if (roi === undefined) {
        var composite = l8
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    } else {
        composite = l8
			.filterBounds(roi)
			.filterDate(ee.Date(startDate), ee.Date(endDate))
			.sort('CLOUD_COVER', false)
			.mosaic();
    }

    if (showMosaic === true) {
        Map.addLayer(composite, { bands: ['B2', 'B3', 'B4'], min: 0, max: 0.5, gamma: [0.95, 1.1, 1] }, 'L5_Mosaic');
    } else {
        return composite;
    }
    return composite;
}


/*
  modis_ndvi_mosaic:
  Function to build a cloud free NDVI mosaic using the MODIS/MOD13Q1 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var modis_ndvi_mosaic = geet.modis_ndvi_mosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/elacerda/geet:geet'); 
  var modis_ndvi_mosaic = geet.modis_ndvi_mosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/elacerda/geet:geet'); 
  var modis_ndvi_mosaic = geet.modis_ndvi_mosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
*/
var modis_ndvi_mosaic = function (startDate, endDate, roi, showMosaic) {
    // Error Handling
    if (startDate === undefined) error('modis_ndvi_mosaic', 'You need to specify the start date of the image series.');
    if (endDate === undefined) error('modis_ndvi_mosaic', 'You need to specify the end  date of the image series.');

    // Default params
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;

    var modis = ee.ImageCollection('MODIS/006/MOD13Q1')
        .filterDate(ee.Date(startDate), ee.Date(endDate))

    var rescale_ndvi = function (img) {
        var rescaled_NDVI = img.select('NDVI')
			.multiply(0.0001)
			.rename('NDVI_rescaled');
        return img.addBands(rescaled_NDVI);
    };

    var goodCollection = modis.map(rescale_ndvi);
    var modis_ndvi_mosaic = goodCollection.select('NDVI_rescaled').mosaic();

    if (showMosaic === true) {
        Map.addLayer(modis_ndvi_mosaic)
    } else {
        return modis_ndvi_mosaic;
    }
    return modis_ndvi_mosaic;
}


/*
  max:
  Function to get the maximum value from an image and returns an dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest. Default is set to the image geometry.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var img_max = geet.max(img);
*/
var max = function (image, roi, scale, maxPixels) {
    if (image === undefined) error('max', 'You need to specify an input image.');     
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var maxDictionary = image.reduceRegion({
        reducer: ee.Reducer.max(),
        geometry: roi.geometry(),
        scale: scale,
        maxPixels: maxPixels
    });
    return maxDictionary;
}


/*
  min:
  Function to get the minimum value from an image and returns an dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest. Default is set to the image geometry.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var img_min = geet.min(img);
*/
var min = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('min', 'You need to specify an input image.'); 

    // Default params           
    roi = typeof roi !== 'undefined' ? roi : image;      
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var minDictionary = image.reduceRegion({
        reducer: ee.Reducer.min(),
        geometry: roi.geometry(),
        scale: scale,
        maxPixels: maxPixels
    });
    return minDictionary;
}


/*
  mean:
  Function to get the mean value from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var mean_roi = geet.mean(img);
*/
var mean = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('mean', 'You need to specify an input image.');   
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;            
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;
    
    var meanDict = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return meanDict;
}


/*
  median:
  Function to get the median value from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var median = geet.median(img);
*/
var median = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('median', 'You need to specify an input image.');  
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var medianDict = image.reduceRegion({
        reducer: ee.Reducer.median(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return medianDict;
}


/*
  mode:
  Function to get the mode value from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var mode = geet.mode(img);
*/
var mode = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('mode', 'You need to specify an input image.');  
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var modeDict = image.reduceRegion({
        reducer: ee.Reducer.mode(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return modeDict;
}


/*
  sd:
  Function to get the standard deviation value from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var sd = geet.sd(img);
*/
var sd = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('sd', 'You need to specify an input image.');  
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var sd = image.reduceRegion({
        reducer: ee.Reducer.stdDev(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return sd;
}


/*
  variance:
  Function to get the variance value from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var variance = geet.variance(img);
*/
var variance = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('variance', 'You need to specify an input image.');  

    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var variance = image.reduceRegion({
        reducer: ee.Reducer.variance(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return variance;
}


/*
  amplitude:
  Function to get the amplitude values from an image and returns a dictionary with all band values.

  Params:
  (ee.Image) image - the input image.
  optional (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var amplitude = geet.amplitude(img);
*/
var amplitude = function (image, roi, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('amplitude', 'You need to specify an input image.');  
    
    // Default params
    roi = typeof roi !== 'undefined' ? roi : image;
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var amplitude = image.reduceRegion({
        reducer: ee.Reducer.minMax(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return amplitude;
}


/*
  spearmans_correlation:
  Function to calculate the spearmans correlation between two input images inside a roi.

  Params:
  (ee.Image) image1 - the first input image.
  (ee.Image) image2 - the second input image.
  (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var spearmansCorrelation = geet.spearmans_correlation(img1, img2, roi);
*/
var spearmans_correlation = function (image1, image2, roi, scale, maxPixels) {
    // Error handling
    if (image1 === undefined) error('spearmans_correlation', 'You need to specify an input image.');
    if (image2 === undefined) error('spearmans_correlation', 'You need to specify an input image.');
    if (roi === undefined) error('spearmans_correlation', 'You need to specify an roi.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var spearmansCorrelation = image.reduceRegion({
        reducer: ee.Reducer.spearmansCorrelation(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return spearmansCorrelation;
}


/*
  linear_fit:
  Function that computes the slope and offset for a (weighted) linear regression of 2 inputs. It returns a dictionary.

  Params:
  (ee.Image) image1 - the first input image.
  (ee.Image) image2 - the second input image.
  (ee.Geometry) roi - the region of interest 
  optional (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var linearFit = geet.linear_fit(img1, img2, roi);
*/
var linear_fit = function (image1, image2, roi, scale, maxPixels) {
    // Error handling
    if (image1 === undefined) error('spearmans_correlation', 'You need to specify an input image.');
    if (image2 === undefined) error('spearmans_correlation', 'You need to specify an input image.');
    if (roi === undefined) error('spearmans_correlation', 'You need to specify an roi.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e10;

    var linearFit = image.reduceRegion({
        reducer: ee.Reducer.linearFit(),
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    return linearFit;
}

// TODO WCI = 100 x NDWI - NDWI_MIN / NDWI_MAX - NDWI_MIN
var wci = function (ndwi_collection) {
    var ndwi_min = ndwi_collection.reduce(ee.Reducer.min());
    var ndwi_max = ndwi_collection.reduce(ee.Reducer.max());
    var ndwi = ee.Image(ndwi_collection.median());
    var wci_cima = ndwi.subtract(ndwi_min);
    var wci_baixo = ndwi_max.subtract(ndwi_min);
    var wci_div = wci_cima.divide(wci_baixo);
    var wci = wci_div.multiply(100).rename('WCI');
    return wci;
}


/*
  ndvi_l5:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 5 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l5_ndvi = geet.ndvi_l5(img);
*/
var ndvi_l5 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_l5', 'You need to specify an input image.');

    var l5_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
    var image_with_ndvi = image.addBands(l5_ndvi);
    return image_with_ndvi;
}


/*
  ndvi_l7:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 7 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l7_ndvi = geet.ndvi_l7(img);
*/
var ndvi_l7 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_l7', 'You need to specify an input image.');

    var l7_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
    var image_with_ndvi = image.addBands(l7_ndvi);
    return image_with_ndvi;
}


/*
  ndvi_l8:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 8 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var l8_ndvi = geet.ndvi_l8(img);
*/
var ndvi_l8 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_l8', 'You need to specify an input image.');

    var l8_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
    var image_with_ndvi = image.addBands(l8_ndvi);
    return image_with_ndvi;
}


/*
  ndvi_s2:
  Function calculate the normalized difference vegetation index (NDVI) from Sentinel 2 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var s2_ndvi = geet.ndvi_s2(img);
*/
var ndvi_s2 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_s2', 'You need to specify an input image.');

    var s2_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    var image_with_ndvi = image.addBands(s2_ndvi);
    return image_with_ndvi;
}


/*
  prop_veg:
  Function calculate the proportional vegetation.

  Params:
  (ee.Image) image - input image with the NDVI band.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var img_pv = geet.prop_veg(img);
*/
var prop_veg = function (image) {
    // Error handling
    if (image === undefined) error('prop_veg', 'You need to specify an input image.');

    // var ndvi_max = ndvi_img.reduce(ee.Reducer.max());
    // var ndvi_min = ee.Number(ndvi_img.reduce(ee.Reducer.min()));
    var ndvi = image.select('NDVI');
    var propVeg = ndvi.expression(
        '(ndvi - ndvi_min) / (ndvi_max - ndvi_min)', {
			'ndvi_max': 0.5,
			'ndvi_min': 0.2,
			'ndvi': ndvi
        });
    var propVeg_pow = propVeg.pow(2).rename('propVeg');
    var img_with_pv = image.addBands(propVeg_pow);
    return img_with_pv;
}


/*
  surface_emissivity:
  Function calculate the surface emissifity.

  Params:
  (ee.Image) image - input image with the proportional vegetation band.
  
  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var lse = geet.surface_emissivity(pv);
*/
var surface_emissivity = function (image) {
    // Error handling
    if (image === undefined) error('surface_emissivity', 'You need to specify an input image.');

    var lse = image.expression(
        '(0.004 * pv_img) + 0.986', {
			'pv_img': image.select('propVeg')
        }).rename('LSE');
    var img_with_lse = image.addBands(lse);
    return img_with_lse;
}


/*
  surface_temperature_tm:
  Function calculate the land surface temperature from a Landsat 5.

  Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
  NDVI, PropVeg and LSE bands.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var surfTemp_img = geet.surface_temperature_tm(img);

  Reference:
  http://www.jestr.org/downloads/Volume8Issue3/fulltext83122015.pdf
*/
var surface_temperature_tm = function (image) {
    // Error handling
    if (image === undefined) error('surface_temperature_ls5', 'You need to specify an input image.');

    var p = 14380;
    var lse_band = image.select('LSE');
    var lse_log = lse_band.log();

    var lst = image.expression(
        'BT / (1 + (11.5 * BT / p) * lse_log)', {
			'p': p,
			'BT': image.select('Brightness_Temperature'),
			'lse_log': lse_log
        }).rename('LST');

    var image_with_lst = image.addBands(lst);
    return image_with_lst;
}


/*
  surface_temperature_oli:
  Function calculate the land surface temperature from a Landsat 8.

  Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
  NDVI, PropVeg and LSE bands.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var surfTemp_img = geet.surface_temperature_oli(img);

  Reference:
  http://www.jestr.org/downloads/Volume8Issue3/fulltext83122015.pdf
*/
var surface_temperature_oli = function (image) {
    // Error handling
    if (image === undefined) error('surface_temperature', 'You need to specify an input image.');

    var p = 14380;
    var lse_band = image.select('LSE');
    var lse_log = lse_band.log();

    var lst = image.expression(
        'BT / (1 + (10.89 * BT / p) * lse_log)', {
			'p': p,
			'BT': image.select('Brightness_Temperature'),
			'lse_log': lse_log
        }).rename('LST');

    var image_with_lst = image.addBands(lst);
    return image_with_lst;
}



/*
  export_image:
  Function to export an image to your Google Drive account.

  Params:
  (ee.Image) image - the input image.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.export_image(img, 'output_img');
*/
var export_image = function (image, scale) {
    // Error handling
    if (image === undefined) error('export_image', 'You need to specify an input image.');
    if (image === undefined) error('export_image', 'You need to specify the output filename.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;
    // var bandNames = image.bandNames();
    // var scale = image.select(bandNames.get(1).getInfo()).projection().nominalScale().getInfo();
    // var roi = image.geometry(scale);

    Export.image.toDrive({
        image: image,
        scale: scale,
        maxPixels: 1e13
    });
}


/*
  cloudmask:
  Function create a cloud mask from a Landsat input image.

  Params:
  (ee.Image) image - the input image.

  Usage:
  var cloudmask_img = geet.cloudmask(img);
*/
var cloudmask = function (image) {
    // Error handling
    if (image === undefined) error('cloudmask', 'You need to specify an input image.');
    
    var mask = image.select(['fmask']).neq(4);
    return image.updateMask(mask);
};


/*
  cloudmask_sr:
  Function create a cloud mask from a Surface Reflectance Landsat input image.

  Params:
  (ee.Image) original_image - the original input image with all the bands.
  (ee.Image) qa_band - the input QA band (pixel_qa band).

  Usage:
  var img = images.first();
  var QA = img.select(['pixel_qa']);
  var masked_img = geet.cloudmask_sr(img, QA);
*/
var cloudmask_sr = function (original_image, qa_band) {
    // Error handling
    if (original_image === undefined) error('cloudmask_sr', 'You need to specify an input image.');
    if (qa_band === undefined) error('cloudmask_sr', 'You need to specify an input QA band.');

    var getQABits = function(qa_band, start, end, newName) {
        var pattern = 0;
        for (var i = start; i <= end; i++) {
            pattern += Math.pow(2, i);
        }

        return qa_band.select([0], [newName])
            .bitwiseAnd(pattern)
            .rightShift(start);
    };

    var cs = getQABits(qa_band, 3,3, 'Cloud_shadows').eq(0);
    var c = getQABits(qa_band, 5,5, 'Cloud').eq(0);

    original_image = original_image.updateMask(cs);
    return original_image.updateMask(c);
};


/*
  pca:
  Function produce the principal components analysis of an image.

  Params:
  (ee.Image) image - the input image.
  optional (number) nBands - the number of the bands of the image. Default is 12.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var pca = geet.pca(img);
  var pca_image = ee.Image(pca[0]);
  Map.addLayer(pca_image);

  Information: 
  Modified from https://github.com/mortcanty/earthengine/blob/master/src/eePca.py
*/
var pca = function (image, nbands, scale, maxPixels) {
    // Error handling
    if (image === undefined) error('pca', 'You need to specify an input image.');

    // Default params
    scale = typeof scale !== 'undefined' ? scale : 30;
    nbands = typeof nbands !== 'undefined' ? nbands : 12;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e9;
    var pcNames = [];

    // center the image
    var bandNames = image.bandNames();
    var meanDict = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        scale: scale,
        maxPixels : maxPixels
    });
    var means = ee.Image.constant(meanDict.values(bandNames));
    var centered = image.subtract(means);

    // principal components analysis
    for (var i = 0; i < nbands; i++) {
        pcNames.push('pc' + (i + 1).toString());
    }
    var centered = centered.toArray();
    var covar = centered.reduceRegion({
        reducer: ee.Reducer.centeredCovariance(),
        scale: scale,
        maxPixels: maxPixels
    });
    var covarArray = ee.Array(covar.get('array'));
    var eigens = covarArray.eigen();
    var lambdas = eigens.slice(1, 0, 1);
    var eivs = eigens.slice(1, 1);
    var centered = centered.toArray(1);
    var pcs = ee.Image(eivs).matrixMultiply(centered)
        .arrayProject([0])
        .arrayFlatten([pcNames]);
    return [ pcs, lambdas ];
}

/*
  geom_filter:
  Function filter a geometry/feature by value.

  Params:
  (ee.Geometry) geom - the input geometry.
  (string) column - the column name.
  (string) symbol - the symbol. Ex: >, >=, <, <= or =.
  (number) value - the value that will be used by the filter.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var geom_filtered = geet.geom_filter(geom, 'AreaSqKm', '>', 25000);
*/
var geom_filter = function(geom, column, symbol, value) {
    // Error handling
    if (geom === undefined) error('geom_filter', 'You need to specify an input geometry.');
    if (column === undefined) error('geom_filter', 'You need to specify the column name');
    if (symbol === undefined) error('geom_filter', 'You need to specify the symbol. Ex: >, >=, <, <= or =');
    if (value === undefined) error('geom_filter', 'You need to specify the value to filter');

    var column = column.toString();      
    var symbol = symbol.toString();

    switch (symbol) {
    case '>':
        var filtro = geom.filter(ee.Filter.gt(column, value));
        return filtro;          
    case '>=':
        var filtro = geom.filter(ee.Filter.gte(column, value));
        return filtro;          
    case '<':
        var filtro = geom.filter(ee.Filter.lt(column, value));
        return filtro;          
    case '<=':
        var filtro = geom.filter(ee.Filter.lte(column, value));
        return filtro;
    case '=':
        var filtro = geom.filter(ee.Filter.eq(column, value));
        return filtro;
    default: 
        print("You need to specify the symbol first. Ex: >, >=, <, <= or =");
    }
}

/*
  download:
  Function filter a geometry/feature by value.

  Params:
  (ee.Image) image - the input image.
  (ee.Geometry) roi - the input region of interest.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.download(img_landsat);
  
  or      
  
  geet.download(img, region, 250);
*/
var download = function (image, roi, scale) {
    if (image === undefined) error('download', 'You need to specify an input image.');

    scale = typeof scale !== 'undefined' ? scale : 30;
    
    if (roi === undefined) {
        var bandNames = image.bandNames();
        var scale = image.select(bandNames.get(1).getInfo()).projection().nominalScale().getInfo();
        var roi = image.geometry(scale);
        print(image.getDownloadURL({ scale: scale  }));
    } else {
        print(image.getDownloadURL({ scale: scale, region: roi  }));
    }
}


/*
  brovey_transform:
  Function make a landsat 8 image fusion for better visualisation

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  geet.brovey_transform(img_landsat);
*/
var brovey_transform = function (image) {
    var fusion_b4 = image.expression(
        '(B4 / B4 + B5 + B6) * B8', 
        {
			'B4': image.select('B4'),
			'B5': image.select('B5'),
			'B6': image.select('B6'),
			'B8': image.select('B8')
        });

    var fusion_b5 = image.expression(
        '(B5 / B4 + B5 + B6) * B8', 
        {
			'B4': image.select('B4'),
			'B5': image.select('B5'),
			'B6': image.select('B6'),
			'B8': image.select('B8')
        });

    var fusion_b6 = image.expression(
        '(B6 / B4 + B5 + B6) * B8', 
        {
			'B4': image.select('B4'),
			'B5': image.select('B5'),
			'B6': image.select('B6'),
			'B8': image.select('B8')
        });

    var img_fus = ee.Image.cat(fusion_b6, fusion_b5, fusion_b4);
    var image_with_fusion = image.addBands(img_fus);
    return image_with_fusion;    
}


/*
  tasseledcap_oli:
  Function to create a Tasselled Cap on a Landsat 8 image.

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var image_tcap = geet.tasseledcap_oli(img);
*/
var tasseledcap_oli = function (image) {
    var Brightness = image.expression(
        '(BLUE * 0.3029) + (GREEN * 0.2786) + (RED * 0.4733) + (NIR * 0.5599) + (SWIR1 * 0.508) + (SWIR2 * 0.1872)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B6'),
			'NIR': image.select('B5'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Brightness');
    
    var Greenness = image.expression(
        '(BLUE * -0.2941) + (GREEN * -0.243) + (RED * -0.5424) + (NIR * 0.7276) + (SWIR1 * 0.0713) + (SWIR2 * -0.1608)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B6'),
			'NIR': image.select('B5'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Greenness');
    
    var Wetness = image.expression(
        '(BLUE * 0.1511) + (GREEN * 0.1973) + (RED * 0.3283) + (NIR * 0.3407) + (SWIR1 * -0.7117) + (SWIR2 * -0.4559)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B6'),
			'NIR': image.select('B5'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Wetness');
    
    var image_idx = image.addBands([Brightness, Greenness, Wetness]);
    return image_idx;
}


/*
  tasseledcap_tm5:
  Function to create a Tasselled Cap on a Landsat 5 image.

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var image_tcap = geet.tasseledcap_tm5(img);
*/
var tasseledcap_tm5 = function (image) {
    var Brightness = image.expression(
        '(BLUE * 0.2043) + (GREEN * 0.4158) + (RED * 0.5524) + (NIR * 0.5741) + (SWIR1 * 0.3124) + (SWIR2 * 0.2303)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Brightness');
    
    var Greenness = image.expression(
        '(BLUE * -0.1603) + (GREEN * -0.2819) + (RED * -0.4934) + (NIR * 0.7940) + (SWIR1 * -0.0002) + (SWIR2 * -0.1446)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Greenness');
    
    var Wetness = image.expression(
        '(BLUE * 0.0315) + (GREEN * 0.2021) + (RED * 0.3102) + (NIR * 0.1594) + (SWIR1 * -0.6806) + (SWIR2 * -0.6109)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Wetness');
    
    var image_idx = image.addBands([Brightness, Greenness, Wetness]);
    return image_idx;
}


/*
  tasseledcap_tm7:
  Function to create a Tasselled Cap on a Landsat 7 image.

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var image_tcap = geet.tasseledcap_tm7(img);
*/
var tasseledcap_tm7 = function (image) {
    var Brightness = image.expression(
        '(BLUE * 0.3561) + (GREEN * 0.3972) + (RED * 0.3904) + (NIR * 0.6966) + (SWIR1 * 0.2286) + (SWIR2 * 0.1596)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Brightness');
    
    var Greenness = image.expression(
        '(BLUE * -0.3344) + (GREEN * -0.3544) + (RED * -0.4556) + (NIR * 0.6966) + (SWIR1 * -0.0242) + (SWIR2 * -0.2630)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Greenness');
    
    var Wetness = image.expression(
        '(BLUE * 0.2626) + (GREEN * 0.2141) + (RED * 0.0926) + (NIR * 0.0656) + (SWIR1 * -0.7629) + (SWIR2 * -0.5388)', {
			'SWIR2': image.select('B7'),
			'SWIR1': image.select('B5'),
			'NIR': image.select('B4'),
			'RED': image.select('B3'),
			'GREEN': image.select('B2'),
			'BLUE': image.select('B1')
		}).rename('Wetness');
    
    var image_idx = image.addBands([Brightness, Greenness, Wetness]);
    return image_idx;
}


/*
  tasseledcap_s2:
  Function to create a Tasselled Cap on a Sentinel 2 image.

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/elacerda/geet:geet'); 
  var image_tcap = geet.tasseledcap_s2(img);
*/
var tasseledcap_s2 = function (image) {
    var Brightness = image.expression(
        '(BLUE * 0.3037) + (GREEN * 0.2793) + (RED * 0.4743) + (NIR * 0.5585) + (SWIR1 * 0.5082) + (SWIR2 * 0.1863)', {
			'SWIR2': image.select('B12'),
			'SWIR1': image.select('B11'),
			'NIR': image.select('B8'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Brightness');
    
    var Greenness = image.expression(
        '(BLUE * -0.2848) + (GREEN * -0.243) + (RED * -0.5436) + (NIR * 0.7243) + (SWIR1 * -0.0840) + (SWIR2 * -0.1800)', {
			'SWIR2': image.select('B12'),
			'SWIR1': image.select('B11'),
			'NIR': image.select('B8'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Greenness');
    
    var Wetness = image.expression(
        '(BLUE * 0.1509) + (GREEN * 0.1973) + (RED * 0.3279) + (NIR * 0.3406) + (SWIR1 * -0.7112) + (SWIR2 * -0.4572)', {
			'SWIR2': image.select('B12'),
			'SWIR1': image.select('B11'),
			'NIR': image.select('B8'),
			'RED': image.select('B4'),
			'GREEN': image.select('B3'),
			'BLUE': image.select('B2')
		}).rename('Wetness');
    
    var image_idx = image.addBands([Brightness, Greenness, Wetness]);
    return image_idx;
}

// var sensor_info = ee.String(image.get('SATELLITE'));
// if (sensor_info.getInfo() === 'LANDSAT_8') {


/* ------------------------ TEST ZONE ------------------------ */

// JavaScript implementation of this great work: https://github.com/mortcanty/earthengine

function imad (current, prev) {
    var done =  ee.Number(ee.Dictionary(prev).get('done'))
    return ee.Algorithms.If(done,prev,imad1(current,prev))
}

function chi2cdf (chi2, df) {
    /* Chi square cumulative distribution function */
    return ee.Image(chi2.divide(2)).gammainc(ee.Number(df).divide(2))
}

function addcoeffs (current, prev) {
    var coeff = ee.List(current)
    var log = ee.List(prev)
    return log.add(coeff)
}

function geneiv (C, B) { 
    /* Generalized eigenproblem C*X = lambda*B*X */
    var C = ee.Array(C)
    var B = ee.Array(B)  
    // Li = choldc(B)^-1
    var Li = ee.Array(B.matrixCholeskyDecomposition().get('L')).matrixInverse()
    //  solve symmetric eigenproblem Li*C*Li^T*x = lambda*x
    var Xa = Li.matrixMultiply(C) 
        .matrixMultiply(Li.matrixTranspose()) 
        .eigen()
    // eigenvalues as a row vector
    var lambdas = Xa.slice(1,0,1).matrixTranspose()
    // eigenvectors as columns
    var X = Xa.slice(1,1).matrixTranspose()  
    // generalized eigenvectors as columns, Li^T*X
    var eigenvecs = Li.matrixTranspose().matrixMultiply(X)
    return (lambdas,eigenvecs) 
}

function covarw (image, weights, maxPixels) {
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e9;

    /* Return the weighted centered image and its weighted covariance matrix */
    var geometry = image.geometry();
    var bandNames = image.bandNames();
    var N = bandNames.length();
    var scale = image.select(0).projection().nominalScale();
    var weightsImage = image.multiply(ee.Image.constant(0)).add(weights);
    var means = image.addBands(weightsImage).reduceRegion({
        reducer: ee.Reducer.mean().repeat(N).splitWeights(),
        scale: scale,
        maxPixels: maxPixels
    }).toArray().project([1]);
    var centered = image.toArray().subtract(means);
    var B1 = centered.bandNames().get(0);
    var b1 = weights.bandNames().get(0);
    var nPixels = ee.Number(centered.reduceRegion({
        reducer: ee.Reducer.count(),
        scale: scale,
        maxPixels: maxPixels
    }).get(B1));
    var sumWeights = ee.Number(weights.reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: geometry,
        scale: scale,
        maxPixels: maxPixels
    }).get(b1));
    var covw = centered.multiply(weights.sqrt()).toArray().reduceRegion({
        reducer: ee.Reducer.centeredCovariance(),
        geometry: geometry,
        scale: scale,
        maxPixels: maxPixels
    }).get('array');
    var covw = ee.Array(covw).multiply(nPixels).divide(sumWeights);
    return [ centered.arrayFlatten([bandNames]), covw ]
}

function imad1 (current, prev) {
    /* Iteratively re-weighted MAD */
    var image = ee.Image(ee.Dictionary(prev).get('image'));
    var chi2 = ee.Image(ee.Dictionary(prev).get('chi2'));
    var allrhos = ee.List(ee.Dictionary(prev).get('allrhos'));
    var region = image.geometry();
    var nBands = image.bandNames().length().divide(2);
    var weights = chi2cdf(chi2,nBands).subtract(1).multiply(-1);
    // ---------- check later -----------
    // centeredImage,covarArray = covarw(image,weights) - python
    var centeredImage  = covarw(image,weights)[0];
    var covarArray = covarw(image,weights)[1];
    // ---------- check later -----------
    var bNames = centeredImage.bandNames();
    var bNames1 = bNames.slice(0,nBands);
    var bNames2 = bNames.slice(nBands);
    var centeredImage1 = centeredImage.select(bNames1);
    var centeredImage2 = centeredImage.select(bNames2);
    var s11 = covarArray.slice(0,0,nBands).slice(1,0,nBands);
    var s22 = covarArray.slice(0,nBands).slice(1,nBands);
    var s12 = covarArray.slice(0,0,nBands).slice(1,nBands);
    var s21 = covarArray.slice(0,nBands).slice(1,0,nBands);
    var c1 = s12.matrixMultiply(s22.matrixInverse()).matrixMultiply(s21); 
    var b1 = s11;
    var c2 = s21.matrixMultiply(s11.matrixInverse()).matrixMultiply(s12);
    var b2 = s22;
    /* solution of generalized eigenproblems */
    var lambdas = geneiv(c1,b1)[0];
    var A = geneiv(c1,b1)[1];
    var B = geneiv(c2,b2)[1];
    var rhos = lambdas.sqrt().project(ee.List([1]));
    /* sort in increasing order */
    var keys = ee.List.sequence(nBands,1,-1);
    A = A.sort([keys]);
    B = B.sort([keys]);
    rhos = rhos.sort(keys);
    /* test for convergence */
    var lastrhos = ee.Array(allrhos.get(-1));
    var done = rhos.subtract(lastrhos).abs().reduce(ee.Reducer.max(),ee.List([0]))
        .lt(ee.Number(0.001))
        .toList()
        .get(0);
    var allrhos = allrhos.cat([rhos.toList()]);
    /* MAD variances */
    var sigma2s = rhos.subtract(1).multiply(-2).toList();
    var sigma2s = ee.Image.constant(sigma2s);
    /* ensure sum of positive correlations between X and U is positive */
    var tmp = s11.matrixDiagonal().sqrt();
    var ones = tmp.multiply(0).add(1);
    var tmp = ones.divide(tmp).matrixToDiag();
    var s = tmp.matrixMultiply(s11).matrixMultiply(A).reduce(ee.Reducer.sum(),[0]).transpose();
    var A = A.matrixMultiply(s.divide(s.abs()).matrixToDiag());
    /* ensure positive correlation */
    var tmp = A.transpose().matrixMultiply(s12).matrixMultiply(B).matrixDiagonal();
    var tmp = tmp.divide(tmp.abs()).matrixToDiag();
    var B = B.matrixMultiply(tmp);
    /* canonical and MAD variates  */
    var centeredImage1Array = centeredImage1.toArray().toArray(1);
    var centeredImage2Array = centeredImage2.toArray().toArray(1);
    var U = ee.Image(A.transpose()).matrixMultiply(centeredImage1Array)
        .arrayProject([0])
        .arrayFlatten([bNames1]);
    var V = ee.Image(B.transpose()).matrixMultiply(centeredImage2Array)
        .arrayProject([0])
        .arrayFlatten([bNames2]);
    var MAD = U.subtract(V);
    /* chi square image */
    var chi2 = MAD.pow(2).divide(sigma2s).reduce(ee.Reducer.sum()).clip(region);
    return ee.Dictionary({'done':done,'image':image,'allrhos':allrhos,'chi2':chi2,'MAD':MAD});
}

function radcal (current, prev) {
    /* iterator function for orthogonal regression and interactive radiometric normalization */
    var k = ee.Number(current);
    var prev = ee.Dictionary(prev);
    /* image is concatenation of reference and target */
    var image = ee.Image(prev.get('image'));
    var ncmask = ee.Image(prev.get('ncmask'));
    var nbands = ee.Number(prev.get('nbands'));
    var rect = ee.Geometry(prev.get('rect'));
    var coeffs = ee.List(prev.get('coeffs'));
    var normalized = ee.Image(prev.get('normalized'));
    var scale = image.select(0).projection().nominalScale();
    /* orthoregress reference onto target */
    var image1 = image.clip(rect).select(k.add(nbands),k).updateMask(ncmask).rename(['x','y']);
    var means = image1.reduceRegion({
        reducer: ee.Reducer.mean(),
        scale: scale,
        maxPixels: 1e9
    }).toArray().project([0]);
    var Xm = means.get([0]);
    var Ym = means.get([1]);
    var S = ee.Array(image1.toArray().reduceRegion({
        reducer: ee.Reducer.covariance(),
        geometry: rect,
        scale: scale,
        maxPixels: 1e9
    }).get('array'));
    /* Pearson correlation */
    var R = S.get([0,1]).divide(S.get([0,0]).multiply(S.get([1,1])).sqrt());
    var eivs = S.eigen();
    var e1 = eivs.get([0,1]);
    var e2 = eivs.get([0,2]);
    /* slope and intercept */
    var b = e2.divide(e1);
    var a = Ym.subtract(b.multiply(Xm));
    var coeffs = coeffs.add(ee.List([b,a,R]));
    /* normalize kth band in target */
    var normalized = normalized.addBands(image.select(k.add(nbands)).multiply(b).add(a));
    return ee.Dictionary({'image':image,'ncmask':ncmask,'nbands':nbands,'rect':rect,'coeffs':coeffs,'normalized':normalized});
}


function radcalbatch (current, prev) { 
    /* Batch radiometric normalization */
    var prev = ee.Dictionary(prev);
    var target = ee.Image(current);
    var reference = ee.Image(prev.get('reference'));
    var normalizedimages = ee.List(prev.get('normalizedimages'));
    var niter = ee.Number(prev.get('niter'));
    var rect = ee.Geometry(prev.get('rect'));
    var log = ee.List(prev.get('log'));
    var nbands = reference.bandNames().length();
    /* clip the images to subset and run iMAD */
    var inputlist = ee.List.sequence(1,niter);
    var image = reference.addBands(target);
    var first = ee.Dictionary({'done':ee.Number(0),
                               'image':image.clip(rect),
                               'allrhos': [ee.List.sequence(1,nbands)],
                               'chi2':ee.Image.constant(0),
                               'MAD':ee.Image.constant(0)
							  });
    var result = ee.Dictionary(inputlist.iterate(imad,first));
    var chi2 = ee.Image(result.get('chi2')).rename(['chi2']);
    var allrhos = ee.List(result.get('allrhos'));
    /* run radcal */
    var ncmask = chi2cdf(chi2,nbands).lt(ee.Image.constant(0.05));
    var inputlist1 = ee.List.sequence(0,nbands.subtract(1));
    var first = ee.Dictionary({'image':image,
                               'ncmask':ncmask,
                               'nbands':nbands,
                               'rect':rect,
                               'coeffs': ee.List([]),
                               'normalized':ee.Image()
							  });
    var result = ee.Dictionary(inputlist1.iterate(radcal,first));
    var coeffs = ee.List(result.get('coeffs'));
    /* update log */
    var ninvar = ee.String(ncmask.reduceRegion({
        reducer: ee.Reducer.sum().unweighted(),
        maxPixels: 1e9
    }).toArray().project([0]));
    var log = log.add(target.get('system:id'));
    var iters = allrhos.length().subtract(1);
    var log = log.add(ee.Algorithms.If(iters.eq(niter),['No convergence, iterations:',iters], 
                                       ['Iterations:',iters]));
    var log = log.add(['Invariant pixels:',ninvar]);
    var log = ee.List(coeffs.iterate(addcoeffs,log));
    /* first band in normalized result is empty */
    var sel = ee.List.sequence(1,nbands);
    var normalized = ee.Image(result.get('normalized')).select(sel);
    var normalizedimages = normalizedimages.add(normalized);
    return ee.Dictionary({'reference':reference,'rect':rect,'niter':niter,'log':log,'normalizedimages':normalizedimages});                                                   
}

/* ------------------------ TEST ZONE ------------------------ */

/* ------------------------  EXPORTS  ------------------------ */

exports.svm = svm
exports.cart = cart
exports.rf = rf
exports.naive_bayes = naive_bayes
exports.gmo_max_ent = gmo_max_ent
exports.kmeans = kmeans
exports.ndvi_change_detection = ndvi_change_detection
exports.ndwi_change_detection = ndwi_change_detection
exports.ndbi_change_detection = ndbi_change_detection
exports.texture = texture
exports.majority = majority
exports.color = color
exports.plot_rgb = plot_rgb
exports.plot_ndvi = plot_ndvi
exports.plot_ndwi = plot_ndwi
exports.plot_class = plot_class
exports.landsat_indices = landsat_indices
exports.sentinel2_indices = sentinel2_indices
exports.load_image = load_image
exports.collection2image = collection2image
exports.toa_radiance = toa_radiance
exports.toa_reflectance = toa_reflectance
exports.toa_reflectance_l8 = toa_reflectance_l8
exports.brightness_temp_l5k = brightness_temp_l5k
exports.brightness_temp_l5c = brightness_temp_l5c
exports.brightness_temp_l7k = brightness_temp_l7k
exports.brightness_temp_l7c = brightness_temp_l7c
exports.brightness_temp_l8k = brightness_temp_l8k
exports.brightness_temp_l8c = brightness_temp_l8c
exports.resample = resample
exports.resample_band = resample_band
exports.load_id_s2 = load_id_s2
exports.build_landsat_timeseries = build_landsat_timeseries
exports.landsat_collection_by_pathrow = landsat_collection_by_pathrow
exports.ls5_collection_by_pathrow = ls5_collection_by_pathrow
exports.ls7_collection_by_pathrow = ls7_collection_by_pathrow
exports.ls8_collection_by_pathrow = ls8_collection_by_pathrow
exports.mosaic_s2 = mosaic_s2
exports.mosaic_l5 = mosaic_l5
exports.mosaic_l7 = mosaic_l7
exports.mosaic_l8 = mosaic_l8
exports.modis_ndvi_mosaic = modis_ndvi_mosaic
exports.max = max
exports.min = min
exports.mean = mean
exports.median = median
exports.mode = mode
exports.sd = sd
exports.variance = variance
exports.amplitude = amplitude
exports.spearmans_correlation = spearmans_correlation
exports.linear_fit = linear_fit
exports.ndvi_l5 = ndvi_l5
exports.ndvi_l7 = ndvi_l7
exports.ndvi_l8 = ndvi_l8
exports.ndvi_s2 = ndvi_s2
exports.prop_veg = prop_veg
exports.surface_emissivity = surface_emissivity
exports.surface_temperature_tm = surface_temperature_tm
exports.surface_temperature_oli = surface_temperature_oli
exports.export_image = export_image
exports.cloudmask = cloudmask
exports.cloudmask_sr = cloudmask_sr
exports.pca = pca
exports.geom_filter = geom_filter
exports.tasseledcap_oli = tasseledcap_oli
exports.tasseledcap_s2 = tasseledcap_s2
exports.tasseledcap_tm5 = tasseledcap_tm5
exports.tasseledcap_tm7 = tasseledcap_tm7
