/** 
 * Google Earth Engine Toolbox (GEET)
 * Description: Lib to write small EE apps or big/complex apps with a lot less code.
 * Version: 1.13.1
 * Eduardo Ribeiro Lacerda <eduardolacerdageo@gmail.com>
 */

// Error Handling function
function error(funcName, msg) {
    print("------------------  GEET  --------------------");
    print("GEET Error in function: " + funcName.toString());
    print(msg.toString());
    print("----------------------------------------------");
}

function deprecated_warning(old_name, new_name) {
    var msg = 'GEET WARNING: The function `' + old_name + '` has been deprecated and integrated into a more robust function. Please use `' + new_name + '` instead. Check the documentation for the new parameters.';
    print(msg);
    throw new Error(msg);
}

exports.build_annual_ls5_timeseries = function() { deprecated_warning('build_annual_ls5_timeseries', 'build_annual_landsat_timeseries'); };
exports.build_annual_ls7_timeseries = function() { deprecated_warning('build_annual_ls7_timeseries', 'build_annual_landsat_timeseries'); };
exports.build_annual_ls8_timeseries = function() { deprecated_warning('build_annual_ls8_timeseries', 'build_annual_landsat_timeseries'); };

// If there are any other specific MSS or Landsat functions that were removed:
exports.landsat5_timeseries = function() { deprecated_warning('landsat5_timeseries', 'landsat_timeseries'); };
exports.landsat7_timeseries = function() { deprecated_warning('landsat7_timeseries', 'landsat_timeseries'); };
exports.landsat8_timeseries = function() { deprecated_warning('landsat8_timeseries', 'landsat_timeseries'); };

// Deprecated LST functions
exports.lst_calc_ls5 = function() { deprecated_warning('lst_calc_ls5', 'calculate_lst'); };
exports.lst_calc_ls7 = function() { deprecated_warning('lst_calc_ls7', 'calculate_lst'); };
exports.lst_calc_ls8 = function() { deprecated_warning('lst_calc_ls8', 'calculate_lst'); };


/*
  svm:
  Function to apply SVM classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples). 
  (string) fieldName - The name of the column that contains the class names.
  optional (string) kernelType - the kernel type of the classifier. Default is 'RBF'.
  optional (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = svm(image, samplesfc, landcover);
/*
  svm:
  (image, trainingData, fieldName, kernelType, resolution)
  
  Function to apply SVM classification to an image.
*/
var svm = function (image, trainingData, fieldName, kernelType, resolution) {
    // Error Handling
    if (image === undefined) error('svm', 'You need to specify an input image.');
    if (trainingData === undefined) error('svm', 'You need to specify the training data.');
    if (fieldName === undefined) error('svm', 'You need to specify the field name.');

    // Default params
    kernelType = typeof kernelType !== 'undefined' ? kernelType : 'RBF';
    resolution = typeof resolution !== 'undefined' ? resolution : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: resolution
    });

    var classifier = ee.Classifier.libsvm({
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
  optional (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = cart(image, samplesfc, landcover);
/*
  cart:
  (image, trainingData, fieldName, resolution)
  
  Function to apply CART classification to an image.
*/
var cart = function (image, trainingData, fieldName, resolution) {
    // Error Handling
    if (image === undefined) error('cart', 'You need to specify an input image.');
    if (trainingData === undefined) error('cart', 'You need to specify the training data.');
    if (fieldName === undefined) error('cart', 'You need to specify the field name.');

    // Default params
    resolution = typeof resolution !== 'undefined' ? resolution : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: resolution
    });

    var classifier = ee.Classifier.smileCart().train({
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
  (array of strings) bands - The input band names that will be choosed to train the model.
  (FeatureCollection) trainingData - All the training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) numOfTrees - The number of trees that the model will create. Default is 10.
  optional (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).
  optional (number) cv_split - The cross validation split percentage .

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = rf(image, samplesfc, landcover, 10);
/*
  rf:
  (image, trainingData, fieldName, numOfTrees, resolution, cvsplit)
  
  Function to apply Random Forest classification to an image.
*/
var rf = function (image, bands, trainingData, fieldName, numOfTrees, resolution, cv_split) {
    // Error Handling
    if (image === undefined) error('rf', 'You need to specify an input image.');
    if (bands === undefined) error('rf', 'You need to specify the image bands serve as the model input');
    if (trainingData === undefined) error('rf', 'You need to specify the training data.');
    if (fieldName === undefined) error('rf', 'You need to specify the field name.');

    // Default params
    numOfTrees = typeof numOfTrees !== 'undefined' ? numOfTrees : 10;
    resolution = typeof resolution !== 'undefined' ? resolution : 30;
    cv_split = typeof cv_split !== 'undefined' ? cv_split : 0.8;

    var input_features = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: resolution
    });

    // Split data in (train - test) datasets
    var withRandom = input_features.randomColumn();
    var split = cv_split;
    var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));
    var testingPartition = withRandom.filter(ee.Filter.gte('random', split));

    var classifier = ee.Classifier.smileRandomForest(numOfTrees).train({
        features: trainingPartition,
        classProperty: fieldName,
        inputProperties: bands
    });

    // Model/Classify with training dataset 
    var classified = image.classify(classifier);

    // Validation
    var validation = testingPartition.classify(classifier);
    var testAccuracy = validation.errorMatrix(fieldName, 'classification');
    print('Validation error matrix: ', testAccuracy);
    print('Validation overall accuracy: ', testAccuracy.accuracy());
    print('kappa: ', testAccuracy.kappa())


    var classifier_final = ee.Classifier.smileRandomForest(numOfTrees).train({
        features: input_features,
        classProperty: fieldName,
        inputProperties: bands
    });

    var classified_final = image.classify(classifier_final);
    return classified_final;
};


/*
  naive_bayes:
  Function to apply the Fast Naive Bayes classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) resolution - the spatial resolution of the input image. Default is 30 (landsat)..


  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = naive_bayes(image, samplesfc, landcover);
/*
  naive_bayes:
  (image, trainingData, fieldName, resolution)
  
  Function to apply the Fast Naive Bayes classification to an image.
*/
var naive_bayes = function (image, trainingData, fieldName, resolution) {
    // Error Handling
    if (image === undefined) error('naive_bayes', 'You need to specify an input image.');
    if (trainingData === undefined) error('naive_bayes', 'You need to specify the training data.');
    if (fieldName === undefined) error('naive_bayes', 'You need to specify the field name.');

    // Default params
    resolution = typeof resolution !== 'undefined' ? resolution : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: resolution
    });

    var classifier = ee.Classifier.smileNaiveBayes().train({
        features: training,
        classProperty: fieldName
    });

    var classified = image.classify(classifier);
    return classified;
};


/*
  max_ent:
  Function to apply the Maximum Entropy classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples).
  (string) fieldName - The name of the column that contains the class names.
  optional (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = max_ent(image, samplesfc, landcover);
/*
  max_ent:
  (image, trainingData, fieldName, resolution)
  
  Function to apply the GMO Maximum Entropy classification to an image.
*/
var max_ent = function (image, trainingData, fieldName, resolution) {
    // Error Handling
    if (image === undefined) error('max_ent', 'You need to specify an input image.');
    if (trainingData === undefined) error('max_ent', 'You need to specify the training data.');
    if (fieldName === undefined) error('max_ent', 'You need to specify the field name.');

    // Default params
    resolution = typeof resolution !== 'undefined' ? resolution : 30;

    var training = image.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: resolution
    });

    var classifier = ee.Classifier.amnhMaxent().train({
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
  optional (number) resolution - the scale number. The scale is related to the spatial resolution of the image. Landsat is 30, sou the default is 30 also.
  optional (number) numPixels - the number of pixels that the classifier will take samples from the roi. Default is set to 5000.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = kmeans(image, roi);

  or 

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var imgClass = kmeans(image, roi, 20, 10, 6000);
*/
var kmeans = function (image, roi, numClusters, resolution, numPixels) {
    // Error Handling
    if (image === undefined) error('kmeans', 'You need to specify an input image.');
    if (roi === undefined) error('kmeans', 'You need to define and pass a roi as argument to collect the samples for the classfication process.');

    // Default params
    numClusters = typeof numClusters !== 'undefined' ? numClusters : 15;
    resolution = typeof resolution !== 'undefined' ? resolution : 30;
    numPixels = typeof numPixels !== 'undefined' ? numPixels : 5000;


    // Make the training dataset.
    var training = image.sample({
        region: roi,
        scale: resolution,
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
  Ex: plotClass(ndviChange, 3, 'change_detection');
  
  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ndviChange = ndvi_change_detection(image_2014, image_2015, 'L8', 0.5);
/*
  ndvi_change_detection:
  (img1, img2, sensor, threshold)
  
  Function to detect changes between two input images using the NDVI index and a threshold parameter. The function adds the two masked indices and returns the sum of the two. It's a good choice to call the plotclass function to visualize the result. Ex: geet.plotclass(ndviChange, 3, 'changedetection');
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
  Ex: plotClass(ndwiChange, 3, 'change_detection');

  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ndwiChange = ndwi_change_detection( image_2014, image_2015, 'L8', 0.5);
/*
  ndwi_change_detection:
  (img1, img2, sensor, threshold)
  
  Function to detect changes between two input images using the NDWI index and a threshold parameter. The function adds the two masked indices and returns the sum of the two. It's a good choice to call the plotclass function to visualize the result. Ex: geet.plotclass(ndwiChange, 3, 'changedetection');
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
  Ex: plotClass(ndbiChange, 3, 'change_detection');

  Params: 
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.
  (ee.Image) img1 = The first input image.
  (ee.Image) img2 = The second input image.
  (ee.Number) threshold = The number of the threshold. All the values at the 
  image that is gte (grater of equal) to this number 
  will be selected.   
  
  Usage: 
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ndbiChange = ndbi_change_detection(image_2014, image_2015, 'L8', 0.5);
/*
  ndbi_change_detection:
  (img1, img2, sensor, threshold)
  
  Function to detect changes between two input images using the NDBI index and a threshold parameter. The function adds the two masked indices and returns the sum. It's a good choice to call the plotclass function to visualize the result. Ex: geet.plotclass(ndbiChange, 3, 'changedetection');
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var texture = texture(image_from_rio, 1);
/*
  texture:
  (image, radius)
  
  Function generate a texture filter on the image.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var majority = majority(image_from_rio, 1);
/*
  majority:
  (image, radius)
  
  Function to filter the final classification image and clear the salt-and-pepper effect.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  color('water');
/*
  color:
  (color)
  
  Function to return a valid color value from the object COLOR.
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
  var result = landsat_indices(image, 'L5'); // Will create all possible indices.

  or specifying the index to generate:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var result = landsat_indices(image, 'L5', 'savi'); // This will create only SAVI.
*/
var landsat_indices = function (image, sensor, index) {
    if (image === undefined) error('landsat_indices', 'You need to specify an input image.');
    if (sensor === undefined) error('landsat_indices', 'You need to specify the sensor name.');

    var b = {};
    if (sensor === 'L5' || sensor === 'L7') {
        b = { BLUE: 'B1', GREEN: 'B2', RED: 'B3', NIR: 'B4', SWIR1: 'B5', SWIR2: 'B7' };
    } else if (sensor === 'L8' || sensor === 'L9') {
        b = { BLUE: 'B2', GREEN: 'B3', RED: 'B4', NIR: 'B5', SWIR1: 'B6', SWIR2: 'B7' };
    } else {
        print('Error: Wrong sensor! Choose L5, L7, L8 or L9.');
        return image;
    }

    var dict = {
        'ndvi':   '((NIR - RED) / (NIR + RED))',
        'ndwi':   '((NIR - SWIR1) / (NIR + SWIR1))',
        'ndbi':   '((SWIR1 - NIR) / (SWIR1 + NIR))',
        'nrvi':   '(RED/NIR - 1) / (RED/NIR + 1)',
        'ndmi':   '((NIR - SWIR1) / (NIR + SWIR1))', // Note: some uses SWIR1, previously NDMI used B5 for L5 and B6 for L8 (which is SWIR1)
        'gli':    '(2 * GREEN - RED - BLUE) / (2 * GREEN + RED + BLUE)',
        'evi':    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
        'savi':   '(1 + 0.5) * ((NIR - RED) / (NIR + RED + 0.5))',
        'gosavi': '(NIR - GREEN) / (NIR + GREEN + 0.16)'
    };
    
    var tcap = {};
    if (sensor === 'L5' || sensor === 'L7') {
        tcap.Brightness = '(BLUE * 0.30) + (GREEN * 0.41) + (RED * 0.55) + (NIR * 0.57) + (SWIR1 * 0.31) + (SWIR2 * 0.23)'; // Approx values used previously
        tcap.Greenness = '(BLUE * -0.16) + (GREEN * -0.28) + (RED * -0.49) + (NIR * 0.79) + (SWIR1 * -0.0002) + (SWIR2 * -0.14)';
        tcap.Wetness = '(BLUE * 0.03) + (GREEN * 0.20) + (RED * 0.31) + (NIR * 0.15) + (SWIR1 * -0.68) + (SWIR2 * -0.61)';
    } else {
        tcap.Brightness = '(BLUE * 0.3029) + (GREEN * 0.2786) + (RED * 0.4733) + (NIR * 0.5599) + (SWIR1 * 0.508) + (SWIR2 * 0.1872)';
        tcap.Greenness = '(BLUE * -0.2941) + (GREEN * -0.243) + (RED * -0.5424) + (NIR * 0.7276) + (SWIR1 * 0.0713) + (SWIR2 * -0.1608)';
        tcap.Wetness = '(BLUE * 0.1511) + (GREEN * 0.1973) + (RED * 0.3283) + (NIR * 0.3407) + (SWIR1 * -0.7117) + (SWIR2 * -0.4559)';
    }

    var list_to_process = [];
    if (index === undefined) {
        list_to_process = Object.keys(dict).concat(Object.keys(tcap));
    } else if (typeof index === 'string') {
        list_to_process = [index.toLowerCase()];
    } else if (Array.isArray(index)) {
        list_to_process = index.map(function(i) { return i.toLowerCase(); });
    }

    var new_bands = [];
    var img_bands = {
        'BLUE': image.select(b.BLUE),
        'GREEN': image.select(b.GREEN),
        'RED': image.select(b.RED),
        'NIR': image.select(b.NIR),
        'SWIR1': image.select(b.SWIR1),
        'SWIR2': image.select(b.SWIR2)
    };

    for (var i = 0; i < list_to_process.length; i++) {
        var idx_name = list_to_process[i].toLowerCase();
        if (dict[idx_name] !== undefined) {
            var expr = dict[idx_name];
            var computed = image.expression(expr, img_bands).rename(idx_name.toUpperCase());
            new_bands.push(computed);
        } else if (idx_name === 'brightness' || idx_name === 'greenness' || idx_name === 'wetness') {
            var prop = idx_name.charAt(0).toUpperCase() + idx_name.slice(1);
            var computed_tcap = image.expression(tcap[prop], img_bands).rename(prop).toFloat();
            new_bands.push(computed_tcap);
        }
    }

    return image.addBands(new_bands);
};
/*
  sentinel2_indices:
  (image, index)
  
  Function to take an input image and generate indices using the Sentinel 2 dataset.
*/
var sentinel2_indices = function (image, index) {
    if (image === undefined) error('sentinel2_indices', 'You need to specify an input image.');

    var dict = {
        'ndvi':   ['B8', 'B4'],
        'ndwi':   ['B3', 'B8'],
        'ndbi':   ['B11', 'B8'],
        'mndwi':  ['B3', 'B12'],
        'mndvi':  ['B9', 'B12'],
        'ngrdi':  ['B3', 'B5'],
        'ndsi':   ['B11', 'B12'],
        'ri':     ['B5', 'B3'],
        'ndmi':   ['B9', 'B12'],
        'gndvi':  ['B9', 'B3'],
        'bndvi':  ['B9', 'B1'],
        'nbr':    ['B9', 'B12'],
        'ppr':    ['B9', 'B12'],
        'ndre':   ['B9', 'B5'],
        'lci':    ['B8', 'B5']
    };

    var expr_dict = {
        'savi':   '(1 + 0.5) * ((NIR - RED) / (NIR + RED + 0.5))',
        'gosavi': '(NIR - GREEN) / (NIR + GREEN + 0.16)',
        'evi':    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
        'evi2':   '2.5 * ((NIR - RED) / (NIR + 2.4 * RED + 1))',
        'gemi':   '(((NIR * NIR - RED * RED) * 2 + (NIR * 1.5) + (RED * 0.5)) / (NIR + RED + 0.5)) * (1 - (RED * 0.25)) - ((RED - 0.125) / (1 - RED))',
        'rvi':    'NIR / RED',
        'logr':   'log(NIR / RED)',
        'tvi':    'sqrt(((NIR - RED) / (NIR + RED)) + 0.5)'
    };

    var list_to_process = [];
    if (index === undefined) {
        list_to_process = Object.keys(dict).concat(Object.keys(expr_dict));
    } else if (typeof index === 'string') {
        list_to_process = [index.toLowerCase()];
    } else if (Array.isArray(index)) {
        list_to_process = index.map(function(i) { return i.toLowerCase(); });
    }

    var new_bands = [];
    var expr_bands = {
        'BLUE': image.select('B2'),
        'GREEN': image.select('B3'),
        'RED': image.select('B4'),
        'NIR': image.select('B8')
    };

    for (var i = 0; i < list_to_process.length; i++) {
        var idx_name = list_to_process[i].toLowerCase();
        if (dict[idx_name] !== undefined) {
            var computed = image.normalizedDifference(dict[idx_name]).rename(idx_name.toUpperCase());
            new_bands.push(computed);
        } else if (expr_dict[idx_name] !== undefined) {
            var expr = expr_dict[idx_name];
            var computed_expr = image.expression(expr, expr_bands).rename(idx_name.toUpperCase());
            new_bands.push(computed_expr);
        }
    }

    return image.addBands(new_bands);
};
/*
  load_image:
  (collection, year, roi, cloudfree)
  
  Function to get an example image to debug or test some code.
*/
var load_image = function (collection, year, roi, cloudFree) {

    // Default params
    collection = typeof collection !== 'undefined' ? collection : 'TOA';
    roi = typeof roi !== 'undefined' ? roi : ee.Geometry.Point(-43.25, -22.90);
    year = typeof year !== 'undefined' ? year : 2015;
    cloudFree = typeof cloudFree !== 'undefined' ? cloudFree : true;

    // Check collection
    if (year >= 2013) {
        if (collection === 'RAW') {
            collection = 'LANDSAT/LC08/C02/T1_RT';
        } else if (collection === 'TOA') {
            collection = 'LANDSAT/LC08/C02/T1_TOA';
        } else if (collection === 'SR') {
            collection = 'LANDSAT/LC08/C02/T1_TOA';
        } else {
            print("Error: Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
        }
    } else if (year < 2013 && year >= 1985) {
        if (collection === 'RAW') {
            collection = 'LANDSAT/LT05/C02/T1';
        } else if (collection === 'TOA') {
            collection = 'LANDSAT/LT05/C02/T1_TOA';
        } else if (collection === 'SR') {
            collection = 'LANDSAT/LT05/C02/T1_TOA';
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
    return(result_image);
};


/*
  collection2image:
  Function to merge all imagens of one image collection into a single band. 

  Params:
  (ee.Image) image - The image of the image collection to add as a band.
  (ee.Image) previous - The output image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var merged_image = image_collection.iterate(collection2image, ee.Image([]));
/*
  collection2image:
  (image, previous)
  
  Function to merge all images of one image collection into a single band.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_radiance = toa_radiance_ls5(img, 10); // ee.Image

  Information:
  Formula:     Lλ = MLQcal + AL
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)
  Qcal         = Quantized and calibrated standard product pixel values (DN)
/*
  toa_radiance:
  (image, band)
  
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance.
*/
var toa_radiance = function (image, band) {
    // Error Handling
    if (image === undefined) error('toa_radiance', 'You need to specify an input image.');
    if (band === undefined) error('toa_radiance', 'You need to specify the number of the band that you want to process.');

    var band_to_toa = image.select('B' + band.toString());
    var radiance_multi_band = ee.Number(image.get('RADIANCE_MULT_BAND_' + band.toString())); // Ml
    var radiance_add_band = ee.Number(image.get('RADIANCE_ADD_BAND_' + band.toString())); // Al

    // Landsat 7 special case
    if (band === 6) {
      var id = ee.String(image.get('LANDSAT_PRODUCT_ID'))
      var id_split = id.split("_")
      if (ee.String(id_split.get(0)).getInfo() === "LE07") {
        band_to_toa = image.select('B6_VCID_1');
        radiance_multi_band = ee.Number(image.get('RADIANCE_MULT_BAND_6_VCID_1')); // Ml
        radiance_add_band = ee.Number(image.get('RADIANCE_ADD_BAND_6_VCID_1')); // Al
      }
    }
    
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_reflectance = toa_reflectance(img, 10); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)
/*
  toa_reflectance:
  (image, band, sensor, solarAngle)
  
  Generic function to calculate TOA Reflectance from raw DN.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_reflectance_sz = toa_reflectance_l8(img, 10, 'SZ'); // ee.Image

  or

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_reflectance_se = toa_reflectance_l8(img, 10, 'SE'); // ee.Image

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
  toa_reflectance_l9:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance
  Landsat 8 version with Solar Angle correction.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_reflectance_sz = toa_reflectance_l9(img, 10, 'SZ'); // ee.Image

  or

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var new_toa_reflectance_se = toa_reflectance_l9(img, 10, 'SE'); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)

  SE = Local sun elevation angle. The scene center sun elevation angle in degrees is provided in the metadata (SUN_ELEVATION).
  SZ = Local solar zenith angle: SZ = 90° - SE
*/
var toa_reflectance_l9 = function (image, band, _solarAngle) {
    // Error Handling
    if (image === undefined) error('toa_reflectance_l9', 'You need to specify an input image.');
    if (band === undefined) error('toa_reflectance_l9', 'You need to specify the number of the band that you want to process.');
    if (_solarAngle === undefined) error('toa_reflectance_l9', 'You need to specify the solar angle mode.');

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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var brightness_temp_img = brightness_temp_l5k(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
/*
  brightness_temp:
  Generic function to convert the Top of Atmosphere image to Brightness Temperature.

  Params:
  (ee.Image) image - the TOA Radiance image to convert.
  (string) sensor - 'L5', 'L7', 'L8' or 'L9'
  (string) unit - 'K' (Kelvin) or 'C' (Celsius)
  optional (bool) two_channel - for L8/L9 only, if true, processes both B10 and B11. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var bt_img = brightness_temp(toa_rad_image, 'L8', 'C');
/*
  brightness_temp:
  (image, sensor, unit, twochannel)
  
  Generic function to convert the Top of Atmosphere (TOA Radiance) image to Brightness Temperature.
*/
var brightness_temp = function (image, sensor, unit, two_channel) {
    if (image === undefined) error('brightness_temp', 'You need to specify an input image.');
    var K1, K2, b_name, K1_11, K2_11;
    if (sensor === 'L5') {
        K1 = 607.76; K2 = 1260.56; b_name = 'B6';
    } else if (sensor === 'L7') {
        K1 = 666.09; K2 = 1282.71; b_name = 'B6';
    } else if (sensor === 'L8' || sensor === 'L9') {
        K1 = ee.Number(image.get('K1_CONSTANT_BAND_10'));
        K2 = ee.Number(image.get('K2_CONSTANT_BAND_10'));
        b_name = 'B10';
    }
    var bt_semlog = image.expression('K1 / band + 1', {'K1': K1, 'band': image.select('TOA_Radiance')});
    var bt = image.expression('K2 / bt_log', {'K2': K2, 'bt_log': bt_semlog.log()}).rename('Brightness_Temperature');
    if (unit === 'C') { bt = bt.subtract(273.5); }
    return image.addBands(bt);
};


/*
  resample:
  Function to resample an input image.

  Params:
  (ee.Image) image - the image to resample.
  (number) scale - the number of the spatial resolution that you
  want to use to  resample the input image.
  (string) mode - The interpolation mode to use. One of 'bilinear' or 'bicubic'.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var landsat_10m = resample(L8_img, 10, 'bilinear'); 
/*
  resample:
  (image, scale, mode)
  
  Function to resample an input image.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var landsatB10_60m = resample_band(b10, 60);
/*
  resample_band:
  (band, scale, mode)
  
  Function to resample just a single band.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var s2_image = load_id_s2('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');
/*
  load_id_s2:
  (id)
  
  Function to filter the Sentinel-2 collection by Product ID obtained from the Copernicus Open Access Hub.
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
  build_annual_landsat_timeseries:
  Function to build a annual Landsat surface reflectance timeseries from 1985 to 2017.
  The function also mask clouds and shadow and create some indices bands like NDVI, NDWI and SAVI.

  Params:
  (ee.Point) roi - the region of interest that will define the study area and the landsat path row  

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_timeserie = build_annual_landsat_timeseries(roi);
/*
  build_annual_landsat_timeseries:
  (roi)
  
  Function to build an annual Landsat (5, 7, 8, and 9) TOA time series from 1985 to 2030. The function also masks clouds and shadows, normalizes bands to standard English names, and generates all indices (NDVI, NDWI, SAVI, Tasseled Cap).
*/
var build_annual_landsat_timeseries = function (roi) {

    roi = typeof roi !== 'undefined' ? roi : ee.Geometry.Point([-43.0879, -22.8632]);

    var ls5_sr = ee.ImageCollection("LANDSAT/LT05/C02/T1_TOA"),
        ls7_sr = ee.ImageCollection("LANDSAT/LE07/C02/T1_TOA"),
        ls8_sr = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA"),
        ls9_sr = ee.ImageCollection("LANDSAT/LC09/C02/T1_TOA");

    var ls5_ic = ee.ImageCollection(ls5_sr)
        .filterBounds(roi)
        .filterDate('1985-01-01', '2011-12-31')

    var ls7_ic = ee.ImageCollection(ls7_sr)
        .filterBounds(roi)
        .filterDate('1999-01-01', '2030-12-31')

    var ls9_ic = ee.ImageCollection(ls9_sr)
        .filterBounds(roi)
        .filterDate('2021-11-01', '2030-12-31');

    var ls8_ic = ee.ImageCollection(ls8_sr)
        .filterBounds(roi)
        .filterDate('2013-05-01', '2030-12-31')
        .merge(ls9_ic);


    function rename_bands_tm(image) {
        var bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'NDVI', 'NDWI', 'SAVI', 'NDMI', 'Brightness', 'Greenness', 'Wetness'];
        var new_bands = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'NDVI', 'NDWI', 'SAVI', 'NDMI', 'Brightness', 'Greenness', 'Wetness'];
        return image.select(bands).rename(new_bands);
    }

    function rename_bands_oli(image) {
        var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'NDVI', 'NDWI', 'SAVI', 'NDMI', 'Brightness', 'Greenness', 'Wetness'];
        var new_bands = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'NDVI', 'NDWI', 'SAVI', 'NDMI', 'Brightness', 'Greenness', 'Wetness'];
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

    function merge_bands(image, previous) {
        return ee.Image(previous).addBands(image);
    };


    var ls5_ic_idx = ls5_ic.map(function (image) { return calc_indices(image, "L5"); })
        .map(function (image) { return mask_clouds(image, image.select("QA_PIXEL")); })
        .map(rename_bands_tm);

    var ls7_ic_idx = ls7_ic.map(function (image) { return calc_indices(image, "L7"); })
        .map(function (image) { return mask_clouds(image, image.select("QA_PIXEL")); })
        .map(rename_bands_tm);

    var ls8_ic_idx = ls8_ic.map(function (image) { return calc_indices(image, "L8"); })
        .map(function (image) { return mask_clouds(image, image.select("QA_PIXEL")); })
        .map(rename_bands_oli);


    function collection_by_year_tm(collection_ls5, collection_ls7) {
        var start = '-01-01';
        var finish = '-12-31';
        var year_col_list = ee.List([]);


        for (var year = 1985; year <= 2012; year++) {

            var temp_col_list = ee.List([]);

            if (year >= 1999) {
                var year_col_ls5 = collection_ls5.filterDate(year.toString() + start, year.toString() + finish);
                var year_col_ls7 = collection_ls7.filterDate(year.toString() + start, year.toString() + finish);
                var collection = year_col_ls5.merge(year_col_ls7);
            }
            else {
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
            var new_ndvi = collection.select('NDVI').median();
            temp_col_list = temp_col_list.add(new_ndvi);
            var new_ndwi = collection.select('NDWI').median();
            temp_col_list = temp_col_list.add(new_ndwi);
            var new_savi = collection.select('SAVI').median();
            temp_col_list = temp_col_list.add(new_savi);
            var new_ndmi = collection.select('NDMI').median();
            temp_col_list = temp_col_list.add(new_ndmi);
            var new_brightness = collection.select('Brightness').median();
            temp_col_list = temp_col_list.add(new_brightness);
            var new_greenness = collection.select('Greenness').median();
            temp_col_list = temp_col_list.add(new_greenness);
            var new_wetness = collection.select('Wetness').median();
            temp_col_list = temp_col_list.add(new_wetness);

            var by_year_temp = ee.ImageCollection(temp_col_list);
            var merged = by_year_temp.iterate(merge_bands, ee.Image([]));
            year_col_list = year_col_list.add(ee.Image(merged).set('year', year));
        }

        var by_year = ee.ImageCollection(year_col_list)
        return by_year;
    }


    function collection_by_year_oli(collection_ls8) {
        var start = '-01-01';
        var finish = '-12-31';
        var year_col_list = ee.List([]);


        for (var year = 2013; year <= 2030; year++) {
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
            var new_ndvi = collection.select('NDVI').median();
            temp_col_list = temp_col_list.add(new_ndvi);
            var new_ndwi = collection.select('NDWI').median();
            temp_col_list = temp_col_list.add(new_ndwi);
            var new_savi = collection.select('SAVI').median();
            temp_col_list = temp_col_list.add(new_savi);
            var new_ndmi = collection.select('NDMI').median();
            temp_col_list = temp_col_list.add(new_ndmi);
            var new_brightness = collection.select('Brightness').median();
            temp_col_list = temp_col_list.add(new_brightness);
            var new_greenness = collection.select('Greenness').median();
            temp_col_list = temp_col_list.add(new_greenness);
            var new_wetness = collection.select('Wetness').median();
            temp_col_list = temp_col_list.add(new_wetness);

            var by_year_temp = ee.ImageCollection(temp_col_list);
            var merged = by_year_temp.iterate(merge_bands, ee.Image([]));
            year_col_list = year_col_list.add(ee.Image(merged).set('year', year));
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
    for (var i = 0; i <= num_of_imgs; i++) {
        var img = ee.Image(merged_list.get(i));
        img = img.set("Year", (i + 1985).toString());
        temp_merged_list = temp_merged_list.add(img);
    }
    merged_collections_by_year = ee.ImageCollection(temp_merged_list);
    return (merged_collections_by_year);
}


/*
  landsat_timeseries_by_pathrow:
  Function that return a image collection with all landsat images (5 and 8) 
  from a defined path row. Remember to specify the type of the collection (raw, toa or sr).

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = landsat_timeseries_by_pathrow('SR', 220, 77);
/*
  landsat_timeseries_by_pathrow:
  (type, path, row)
  
  Function that return a image collection with all landsat images (5 and 8) from a defined path row. Remember to specify the type of the collection (raw, toa or sr).
*/
var landsat_timeseries_by_pathrow = function (type, path, row) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
    path = typeof path !== 'undefined' ? path : 217;
    row = typeof row !== 'undefined' ? row : 76;

    var add_ndvi_ls = function(image) {
      var with_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
      return image.addBands(with_ndvi)
    }

    var add_ndvi_ls8 = function(image) {
      var with_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
      return image.addBands(with_ndvi)
    }


    switch (type) {
        case 'raw':
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
*/            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_RT')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            var all_ls_collection = ls5_collection.merge(ls8_collection);
            return all_ls_collection;
        case 'toa':
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls);
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls);
*/            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls8);
            var all_ls_collection = ls5_collection.merge(ls8_collection);
            return all_ls_collection;
        case 'sr':
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls);
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls);
*/            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row))
                .map(add_ndvi_ls8)
                .map(function (image) { return cloudmask_sr(image, image.select("QA_PIXEL")); });
            var all_ls_collection = ls5_collection.merge(ls8_collection);
            return all_ls_collection;
    }
}


/*
  landsat_timeseries_by_roi:
  Function that return a image collection with all landsat images (5 and 8) 
  from a defined region of interest (roi). Remember to specify the type of the collection (raw, toa or sr).

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (ee.Geometry) roi - the Region of Interest to filter the dataset.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = landsat_timeseries_by_roi('SR', roi);
/*
  landsat_timeseries_by_roi:
  (type, path, row)
  
  Function that returns an image collection with all Landsat images (5 and 8) from a defined roi. Remember to specify the type of the collection (raw, toa or sr).
*/
var landsat_timeseries_by_roi = function (type, roi) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';

    var add_ndvi_ls = function(image) {
      var with_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
      return image.addBands(with_ndvi)
    }

    var add_ndvi_ls8 = function(image) {
      var with_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
      return image.addBands(with_ndvi)
    }


    switch (type) {
        case 'raw':
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1')
                .filterBounds(roi);
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1')
                .filterBounds(roi);
*/            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_RT')
                .filterBounds(roi);
            var ls9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1')
                .filterBounds(roi);
            var all_ls_collection = ls5_collection.merge(ls8_collection).merge(ls9_collection);
            return all_ls_collection;
        case 'toa':
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls);
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls);
*/            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls8);
            var ls9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls8);
            var all_ls_collection = ls5_collection.merge(ls8_collection).merge(ls9_collection);
            return all_ls_collection;
        case 'sr':
            var add_ndvi_ls_sr = function(image) {
                var with_ndvi = image.normalizedDifference(['SR_B4', 'SR_B3']).rename('NDVI');
                return image.addBands(with_ndvi)
            }
            var add_ndvi_ls8_sr = function(image) {
                var with_ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
                return image.addBands(with_ndvi)
            }
            var ls5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls_sr);
/*            var ls7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls_sr);*/
            var ls8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls8_sr)
                .map(function (image) { return cloudmask_sr(image, image.select("QA_PIXEL")); });
            var ls9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
                .filterBounds(roi)
                .map(add_ndvi_ls8_sr)
                .map(function (image) { return cloudmask_sr(image, image.select("QA_PIXEL")); });
            var all_ls_collection = ls5_collection.merge(ls8_collection).merge(ls9_collection);
            return all_ls_collection;
    }
}


/*
  ls5_timeseries_by_pathrow:
  Function that return a image collection with all landsat 5 images from a defined path row.

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = ls5_timeseries_by_pathrow('SR', 220, 77);
*/
var ls5_timeseries_by_pathrow = function (type, path, row) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
    path = typeof path !== 'undefined' ? path : 217;
    row = typeof row !== 'undefined' ? row : 76;

    switch (type) {
        case 'raw':
            var l5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l5_collection;
        case 'toa':
            var l5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l5_collection;
        case 'sr':
            var l5_collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l5_collection;
    }
}


/*
  ls7_ctimeseries_by_pathrow:
  Function that return a image collection with all landsat 7 images from a defined path row.

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = ls7_timeseries_by_pathrow('SR', 220, 77);
*/
var ls7_timeseries_by_pathrow = function (type, path, row) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
    path = typeof path !== 'undefined' ? path : 217;
    row = typeof row !== 'undefined' ? row : 76;

    switch (type) {
        case 'raw':
            var l7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l7_collection;
        case 'toa':
            var l7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l7_collection;
        case 'sr':
            var l7_collection = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l7_collection;
    }
}


/*
  ls8_timeseries_by_pathrow:
  Function that return a image collection with all landsat 8 images from a defined path row..

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = ls8_timeseries_by_pathrow('SR', 220, 77);
*/
var ls8_timeseries_by_pathrow = function (type, path, row) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
    path = typeof path !== 'undefined' ? path : 217;
    row = typeof row !== 'undefined' ? row : 76;

    switch (type) {
        case 'raw':
            var l8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_RT')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l8_collection;
        case 'toa':
            var l8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l8_collection;
        case 'sr':
            var l8_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l8_collection;
    }
}

/*
  ls9_timeseries_by_pathrow:
  Function that return a image collection with all landsat 8 images from a defined path row..

  Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var ls_collection = ls9_timeseries_by_pathrow('SR', 220, 77);
*/
var ls9_timeseries_by_pathrow = function (type, path, row) {

    type = typeof type !== 'undefined' ? type.toString().toLowerCase() : 'sr';
    path = typeof path !== 'undefined' ? path : 217;
    row = typeof row !== 'undefined' ? row : 76;

    switch (type) {
        case 'raw':
            var l9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_RT')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l9_collection;
        case 'toa':
            var l9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l9_collection;
        case 'sr':
            var l9_collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));
            return l9_collection;
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var s2_mosaic = s2Mosaic('2016-01-01', '2016-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var s2_mosaic = mosaic_s2('2016-01-01', '2016-12-31', roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var s2_mosaic = mosaic_s2('2016-01-01', '2016-12-31', roi, false); // Doesnt display the mosaic
*/
/*
  create_mosaic:
  Generic function to build a cloud free mosaic.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.
  (string) sensor - 'L5', 'L7', 'L8', 'L9' or 'S2'.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var mosaic = create_mosaic('2023-01-01', '2023-12-31', roi, true, 'L8');
/*
  create_mosaic:
  (startDate, endDate, roi, showMosaic, sensor)
  
  Generic function to build a cloud-free mosaic for Landsat 5, 7, 8, 9, or Sentinel-2.
*/
var create_mosaic = function(startDate, endDate, roi, showMosaic, sensor) {
    if (startDate === undefined) error('create_mosaic', 'You need to specify the start date.');
    if (endDate === undefined) error('create_mosaic', 'You need to specify the end date.');
    
    showMosaic = typeof showMosaic !== 'undefined' ? showMosaic : true;
    var col, bands, mins, maxs, gammas, name;
    var sort_prop = 'CLOUD_COVER';
    
    if (sensor === 'S2') {
        col = ee.ImageCollection('COPERNICUS/S2');
        sort_prop = 'CLOUDY_PIXEL_PERCENTAGE';
        bands = ['B2', 'B3', 'B4']; mins = 400; maxs = 2811; gammas = 1; name = 'S2_Mosaic';
    } else if (sensor === 'L5') {
        col = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA');
        bands = ['B1', 'B2', 'B3']; mins = 0; maxs = 0.5; gammas = [0.95, 1.1, 1]; name = 'L5_Mosaic';
    } else if (sensor === 'L7') {
        col = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA');
        bands = ['B1', 'B2', 'B3']; mins = 0; maxs = 0.5; gammas = [0.95, 1.1, 1]; name = 'L7_Mosaic';
    } else if (sensor === 'L8') {
        col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');
        bands = ['B2', 'B3', 'B4']; mins = 0; maxs = 0.5; gammas = [0.95, 1.1, 1]; name = 'L8_Mosaic';
    } else if (sensor === 'L9') {
        col = ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA');
        bands = ['B2', 'B3', 'B4']; mins = 0; maxs = 0.5; gammas = [0.95, 1.1, 1]; name = 'L9_Mosaic';
    }

    var filtered = col.filterDate(ee.Date(startDate), ee.Date(endDate)).sort(sort_prop, false);
    if (roi !== undefined) { filtered = filtered.filterBounds(roi); }
    
    var composite;
    if (sensor === 'S2') {
        composite = filtered.map(function(image) { return image.addBands(image.metadata('system:time_start')); }).mosaic();
    } else {
        composite = filtered.mosaic();
    }
    
    if (showMosaic === true) {
        Map.addLayer(composite, {bands: bands, min: mins, max: maxs, gamma: gammas}, name);
    }
    return composite;
};

// Wrappers



/*
  modis_ndvi_mosaic:
  Function to build a cloud free NDVI mosaic using the MODIS/MOD13Q1 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var modis_ndvi_mosaic = modis_ndvi_mosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var modis_ndvi_mosaic = modis_ndvi_mosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var modis_ndvi_mosaic = modis_ndvi_mosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var img_max = max(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var img_min = min(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var mean_roi = mean(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var median = median(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var mode = mode(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var sd = sd(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var variance = variance(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var amplitude = amplitude(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var spearmansCorrelation = spearmans_correlation(img1, img2, roi);
/*
  spearmans_correlation:
  (image, roi, scale, maxPixels)
  
  Function the get the spearmans correlation value from an image and returns a dictionary with all band values.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var linearFit = linear_fit(img1, img2, roi);
/*
  linear_fit:
  (image, roi, scale, maxPixels)
  
  Function that computes the slope and offset for a (weighted) linear regression of 2 inputs. It returns a dictionary.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var l5_ndvi = ndvi_l5(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var l7_ndvi = ndvi_l7(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var l8_ndvi = ndvi_l8(img);
*/
var ndvi_l8 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_l8', 'You need to specify an input image.');

    var l8_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
    var image_with_ndvi = image.addBands(l8_ndvi);
    return image_with_ndvi;
}

/*
  ndvi_l9:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 8 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var l9_ndvi = ndvi_l9(img);
*/
var ndvi_l9 = function (image) {
    // Error handling
    if (image === undefined) error('ndvi_l9', 'You need to specify an input image.');

    var l9_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
    var image_with_ndvi = image.addBands(l9_ndvi);
    return image_with_ndvi;
}


/*
  ndvi_s2:
  Function calculate the normalized difference vegetation index (NDVI) from Sentinel 2 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var s2_ndvi = ndvi_s2(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var img_pv = prop_veg(img);
/*
  prop_veg:
  (image)
  
  Function that calculates the proportional vegetation.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var lse = surface_emissivity(pv);
/*
  surface_emissivity:
  (image)
  
  Function calculate the surface emissifity.
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var surfTemp_img = surface_temperature_tm(img);

  Reference:
  http://www.jestr.org/downloads/Volume8Issue3/fulltext83122015.pdf
/*
  surface_temperature_tm:
  (image)
  
  Function that calculates the land surface temperature (Landsat 5).
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var surfTemp_img = surface_temperature_oli(img);

  Reference:
  http://www.jestr.org/downloads/Volume8Issue3/fulltext83122015.pdf
/*
  surface_temperature_oli:
  (image)
  
  Function calculate the land surface temperature (Landsat 8).
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
  calculate_lst:
  Unified function to calculate the Land Surface Temperature (LST) using the Single-Channel algorithm.
  It automatically detects the sensor (Landsat 5, 7, 8, or 9) from the image metadata and dynamically
  applies the correct calibration coefficients and thermal wavelengths.
  It can process a single image or map over an entire ImageCollection (time series).

  Params:
  (ee.Image | ee.ImageCollection) input - The input image or collection.
*/
var calculate_lst = function(input) {
    if (typeof input.map === 'function') {
        return input.map(function(img) { return calculate_lst(img); });
    }
    
    var image = ee.Image(input);
    var spacecraft = ee.String(image.get('SPACECRAFT_ID'));
    
    // Detect sensor to set constants
    var isL5 = spacecraft.match('5').length().gt(0);
    var isL7 = spacecraft.match('7').length().gt(0);
    var isL89 = spacecraft.match('8|9').length().gt(0);
    
    // Safely get K1/K2 (fallback to 1 if null to avoid crash, we will mask it out anyway if missing)
    var k1_val = ee.Algorithms.If(image.get('K1_CONSTANT_BAND_10'), image.get('K1_CONSTANT_BAND_10'), 1);
    var k2_val = ee.Algorithms.If(image.get('K2_CONSTANT_BAND_10'), image.get('K2_CONSTANT_BAND_10'), 1);
    
    var K1 = ee.Number(ee.Algorithms.If(isL5, 607.76,
             ee.Algorithms.If(isL7, 666.09, k1_val)));
             
    var K2 = ee.Number(ee.Algorithms.If(isL5, 1260.56,
             ee.Algorithms.If(isL7, 1282.71, k2_val)));
             
    var wavelength = ee.Number(ee.Algorithms.If(isL5, 11.45,
                     ee.Algorithms.If(isL7, 11.5,
                     10.895))); // 10.895 for L8/L9 TIRS Band 10
                     
    var thermal_band = ee.String(ee.Algorithms.If(isL89, 'B10', 'B6'));
    var nir_band = ee.String(ee.Algorithms.If(isL89, 'B5', 'B4'));
    var red_band = ee.String(ee.Algorithms.If(isL89, 'B4', 'B3'));
    
    var rad_mult_prop = ee.String('RADIANCE_MULT_BAND_').cat(thermal_band.slice(1));
    var rad_add_prop = ee.String('RADIANCE_ADD_BAND_').cat(thermal_band.slice(1));
    
    var rad_mult = ee.Number(ee.Algorithms.If(image.get(rad_mult_prop), image.get(rad_mult_prop), 0));
    var rad_add = ee.Number(ee.Algorithms.If(image.get(rad_add_prop), image.get(rad_add_prop), 0));
    
    // 1. TOA Radiance & Brightness Temperature
    var thermal = image.select(thermal_band);
    
    // Calculate what the BT would be if the input was RAW DN
    var toa_rad = thermal.multiply(rad_mult).add(rad_add);
    var bt_computed = image.expression('K2 / log(K1 / L + 1)', {
        'K1': K1, 'K2': K2, 'L': toa_rad
    });
    
    // Robust check: Earth Engine's T1_TOA collections provide thermal bands ALREADY in Kelvin (~300).
    // RAW DN collections provide values > 10,000. 
    // We use .where() to dynamically choose the right value per pixel.
    var bt_kelvin = thermal.where(thermal.gt(500), bt_computed);
    var bt = bt_kelvin.subtract(273.15); // Convert to Celsius
    
    // 3. NDVI
    var ndvi = image.normalizedDifference([nir_band, red_band]);
    
    // 4. Proportion of Vegetation (PV)
    // Formula: ((NDVI - NDVI_min) / (NDVI_max - NDVI_min))^2
    var pv = image.expression('((NDVI - 0.2) / 0.3) ** 2', {'NDVI': ndvi});
    // Clamp PV between 0 and 1 to prevent physically impossible emissivity values
    pv = pv.where(ndvi.lt(0.2), 0).where(ndvi.gt(0.5), 1);
    
    // 5. Land Surface Emissivity (LSE)
    var lse = image.expression('0.004 * PV + 0.986', {'PV': pv});
    
    // 6. Land Surface Temperature (LST)
    var p = 14380;
    var lst = image.expression(
        'BT / (1 + (w * BT / p) * log(LSE))', {
        'BT': bt.add(273.15), // Needs Kelvin for this formula
        'w': wavelength,
        'p': p,
        'LSE': lse
    }).subtract(273.15).rename('LST'); // Convert back to Celsius
    
    return image.addBands([
        toa_rad.rename('TOA_Radiance'), 
        bt.rename('Brightness_Temperature'), 
        ndvi.rename('NDVI'), 
        pv.rename('PropVeg'), 
        lse.rename('LSE'), 
        lst
    ]);
}



/*
  export_image:
  Function to export an image to your Google Drive account.

  Params:
  (ee.Image) image - the input image.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  export_image(img, 'output_img');
/*
  export_image:
  (image, scale)
  
  Function to export an image to your Google Drive account.
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
  var cloudmask_img = cloudmask(img);
/*
  cloudmask:
  (image)
  
  Function create a cloud mask from a Landsat input image.
*/
var cloudmask = function (image) {
    // Error handling
    if (image === undefined) error('cloudmask', 'You need to specify an input image.');

    var qa = image.select('QA_PIXEL');
    // Landsat Collection 2 QA_PIXEL: Bit 3 is Cloud, Bit 4 is Cloud Shadow
    var cloudBitMask = 1 << 3;
    var cloudShadowBitMask = 1 << 4;
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudShadowBitMask).eq(0));
      
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
  var QA = img.select(['QA_PIXEL']);
  var masked_img = cloudmask_sr(img, QA);
/*
  cloudmask_sr:
  (originalimage, qaimage)
  
  Function that creates a cloud mask from a Surface Reflectance Landsat input image.
*/
var cloudmask_sr = function (original_image, qa_band) {
    // Error handling
    if (original_image === undefined) error('cloudmask_sr', 'You need to specify an input image.');
    if (qa_band === undefined) error('cloudmask_sr', 'You need to specify an input QA band.');

    // Landsat Collection 2 QA_PIXEL: Bit 3 is Cloud, Bit 4 is Cloud Shadow
    var cloudBitMask = 1 << 3;
    var cloudShadowBitMask = 1 << 4;
    var mask = qa_band.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa_band.bitwiseAnd(cloudShadowBitMask).eq(0));
      
    return original_image.updateMask(mask);
};


/*
  fmask:
  Function to cloud mask an Surface Reflectance Landsat input image.

  Params:
  (ee.Image) original_image - the original input image with all the bands.

  Usage:
  var masked_img = fmask(img);

  PS: Special thanks to "HMSP": https://gis.stackexchange.com/users/93552/hmsp
*/
var fmask = function(image) {
    // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  // Get the pixel QA band.
  var qa = image.select('QA_PIXEL');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
}


/*
  pca:
  Function produce the principal components analysis of an image.

  Params:
  (ee.Image) image - the input image.
  optional (number) nBands - the number of the bands of the image. Default is 12.
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var pca = pca(img);
  var pca_image = ee.Image(pca[0]);
  Map.addLayer(pca_image);

  Information: 
  Modified from https://github.com/mortcanty/earthengine/blob/master/src/eePca.py
/*
  pca:
  (image, nbands, scale, maxPixels)
  
  Function produces the principal components analysis of an image.
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
        maxPixels: maxPixels
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
    return [pcs, lambdas];
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var geom_filtered = geom_filter(geom, 'AreaSqKm', '>', 25000);
/*
  geom_filter:
  (geom, column, symbol, value)
  
  Function to filter a geometry/feature by value.
*/
var geom_filter = function (geom, column, symbol, value) {
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  download(img_landsat);
  
  or      
  
  download(img, region, 250);
*/
var download = function (image, roi, scale) {
    if (image === undefined) error('download', 'You need to specify an input image.');

    scale = typeof scale !== 'undefined' ? scale : 30;

    if (roi === undefined) {
        var bandNames = image.bandNames();
        var scale = image.select(bandNames.get(1).getInfo()).projection().nominalScale().getInfo();
        var roi = image.geometry(scale);
        print(image.getDownloadURL({ scale: scale }));
    } else {
        print(image.getDownloadURL({ scale: scale, region: roi }));
    }
}


/*
  brovey_transform:
  Function make a landsat 8 image fusion for better visualisation

  Params:
  (ee.Image) image - the input image.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  brovey_transform(img_landsat);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var image_tcap = tasseledcap_oli(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var image_tcap = tasseledcap_tm5(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var image_tcap = tasseledcap_tm7(img);
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
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var image_tcap = tasseledcap_s2(img);
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


/*
  smooth_timeseries:
  Function to apply a simple moving average (smoothing) to an ImageCollection.

  Params:
  (ee.ImageCollection) collection - the input image collection to smooth.
  optional (number) windowSize - the moving window size in days. Default is 30.
  optional (string) timeUnit - the time unit. Default is 'day'.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var smoothed_ndvi = smooth_timeseries(ndvi_collection, 45); 
/*
  smooth_timeseries:
  (collection, windowSize)
  
  Function to apply a moving average filter to smooth a time series of images (e.g., NDVI series).
*/
var smooth_timeseries = function(collection, windowSize, timeUnit) {
    if (collection === undefined) error('smooth_timeseries', 'You need to specify an input ImageCollection.');
    
    windowSize = typeof windowSize !== 'undefined' ? windowSize : 30; // default 30 days
    timeUnit = typeof timeUnit !== 'undefined' ? timeUnit : 'day';
    
    var join = ee.Join.saveAll('matches');
    
    var diffFilter = ee.Filter.maxDifference({
      difference: windowSize * 24 * 60 * 60 * 1000, // convert days to milliseconds (approx)
      leftField: 'system:time_start',
      rightField: 'system:time_start'
    });
    
    // Instead of raw ms, better use ee.Filter.maxDifference with time matching, or a simpler approach:
    // Earth Engine usually does it via a join on system:time_start
    var diffFilter2 = ee.Filter.maxDifference({
      difference: windowSize * 1000 * 60 * 60 * 24, // milliseconds
      leftField: 'system:time_start',
      rightField: 'system:time_start'
    });
    
    var smoothCollection = join.apply({
      primary: collection,
      secondary: collection,
      condition: diffFilter2
    }).map(function(image) {
      var matchCollection = ee.ImageCollection.fromImages(image.get('matches'));
      var meanImage = matchCollection.mean();
      return meanImage.copyProperties(image, ['system:time_start', 'system:time_end']);
    });
    
    return ee.ImageCollection(smoothCollection);
};


/*
  water_indices:
  Calculates NDTI (Turbidity) and NDCI (Chlorophyll) for Sentinel-2 or Landsat 8.

  Params:
  (ee.Image) image - the input image.
  (string) sensor - 'L8', 'L9' or 'S2'.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var water_img = water_indices(s2_image, 'S2'); 
/*
  water_indices:
  (image, sensor)
  
  Function to generate advanced water quality indices: NDTI (Normalized Difference Turbidity Index) and NDCI (Normalized Difference Chlorophyll Index).
*/
var water_indices = function(image, sensor) {
    if (image === undefined) error('water_indices', 'You need to specify an input image.');
    if (sensor === undefined) error('water_indices', 'You need to specify the sensor name (L8 or S2).');
    
    var ndti, ndci;
    if (sensor === 'L8' || sensor === 'L9') {
        ndti = image.normalizedDifference(['B4', 'B3']).rename('NDTI'); // Red / Green
        ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI'); // NIR / Red
    } else if (sensor === 'S2') {
        ndti = image.normalizedDifference(['B4', 'B3']).rename('NDTI');
        ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI'); // Red Edge 1 / Red
    } else {
        print('Error: Sensor not supported for Water Indices. Use L8, L9 or S2.');
        return image;
    }
    
    return image.addBands([ndti, ndci]);
};

/*
  s1_preprocess:
  Function to load and preprocess Sentinel-1 GRD Data.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest.
  optional (string) polarization - 'VV', 'VH', 'HH', 'HV'. Default is 'VV'.
  optional (string) orbit - 'DESCENDING' or 'ASCENDING'. Default is 'DESCENDING'.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var radar_img = s1_preprocess('2023-01-01', '2023-12-31', roi, 'VV', 'DESCENDING'); 
/*
  s1_preprocess:
  (startDate, endDate, roi, polarization, orbit)
  
  Function to load and preprocess Sentinel-1 SAR (Radar) GRD Data.
*/
var s1_preprocess = function(startDate, endDate, roi, polarization, orbit) {
    if (startDate === undefined) error('s1_preprocess', 'You need to specify the start date.');
    if (endDate === undefined) error('s1_preprocess', 'You need to specify the end date.');
    
    polarization = typeof polarization !== 'undefined' ? polarization : 'VV';
    orbit = typeof orbit !== 'undefined' ? orbit : 'DESCENDING';
    
    var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
               .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
               .filter(ee.Filter.eq('instrumentMode', 'IW'))
               .filter(ee.Filter.eq('orbitProperties_pass', orbit))
               .filterDate(ee.Date(startDate), ee.Date(endDate));
               
    if (roi !== undefined) {
        s1 = s1.filterBounds(roi);
    }
    
    var mosaic = s1.mosaic();
    if (roi !== undefined) {
        mosaic = mosaic.clip(roi);
    }
    
    return mosaic;
};

/*
  speckle_filter:
  Function to apply a focal median filter to reduce SAR speckle noise.

  Params:
  (ee.Image) image - the input SAR image.
  optional (number) radius - the radius of the filter in meters. Default is 30.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var smooth_radar = speckle_filter(radar_img, 50); 
/*
  speckle_filter:
  (image, radius)
  
  Function to apply a focal median filter to reduce SAR speckle noise.
*/
var speckle_filter = function(image, radius) {
    if (image === undefined) error('speckle_filter', 'You need to specify an input image.');
    radius = typeof radius !== 'undefined' ? radius : 30; // default 30 meters
    
    return image.focal_median(radius, 'circle', 'meters');
};


/*
  terrain_analysis:
  Function to generate Elevation, Slope, Aspect and Hillshade from SRTM DEM.

  Params:
  optional (ee.Geometry) roi - the Region of Interest to clip the DEM.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet'); 
  var terrain = terrain_analysis(roi); 
/*
  terrain_analysis:
  (roi)
  
  Function to generate Elevation, Slope, Aspect, and Hillshade bands from the SRTM 30m DEM.
*/
var terrain_analysis = function(roi) {
    var dem = ee.Image('USGS/SRTMGL1_003');
    if (roi !== undefined) {
        dem = dem.clip(roi);
    }
    
    var elevation = dem.rename('Elevation');
    var slope = ee.Terrain.slope(dem).rename('Slope');
    var aspect = ee.Terrain.aspect(dem).rename('Aspect');
    var hillshade = ee.Terrain.hillshade(dem).rename('Hillshade');
    
    return ee.Image([elevation, slope, aspect, hillshade]);
};

/*
  tasseled_cap:
  Function to create a Tasselled Cap image.
/*
  tasseled_cap:
  (image, sensor)
  
  Generic function to create a Tasseled Cap image.
*/
var tasseled_cap = function (image, sensor) {
    if (image === undefined) error('tasseled_cap', 'You need to specify an input image.');
    if (sensor === undefined) error('tasseled_cap', 'You need to specify the sensor.');

    var b, coeffs;
    if (sensor === 'L5' || sensor === 'L7') {
        b = image.select(['B1', 'B2', 'B3', 'B4', 'B5', 'B7']);
        if (sensor === 'L5') {
            coeffs = ee.Array([
                [0.3037, 0.2793, 0.4743, 0.5585, 0.5082, 0.1863],
                [-0.2848, -0.2435, -0.5436, 0.7243, 0.0840, -0.1800],
                [0.1509, 0.1973, 0.3279, 0.3406, -0.7112, -0.4572]
            ]);
        } else {
            coeffs = ee.Array([
                [0.3561, 0.3972, 0.3904, 0.6966, 0.2286, 0.1596],
                [-0.3344, -0.3544, -0.4556, 0.6966, -0.0242, -0.2630],
                [0.2626, 0.2141, 0.0926, 0.0656, -0.7629, -0.5388]
            ]);
        }
    } else if (sensor === 'L8' || sensor === 'L9') {
        b = image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
        coeffs = ee.Array([
            [0.3029, 0.2786, 0.4733, 0.5599, 0.5080, 0.1872],
            [-0.2941, -0.2430, -0.5424, 0.7276, 0.0713, -0.1608],
            [0.1511, 0.1973, 0.3283, 0.3407, -0.7117, -0.4559]
        ]);
    } else if (sensor === 'S2') {
        b = image.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']);
        coeffs = ee.Array([
            [0.0822, 0.1360, 0.2611, 0.2964, 0.3338, 0.3206],
            [-0.1128, -0.1680, -0.3480, 0.3303, -0.0852, -0.3155],
            [0.1363, 0.2802, 0.3072, -0.7117, -0.0873, -0.1804]
        ]);
    } else {
        print('Error: Unknown sensor for Tasseled Cap');
        return image;
    }

    var arrayImage1D = b.toArray();
    var arrayImage2D = arrayImage1D.toArray(1);
    var componentsImage = ee.Image(coeffs).matrixMultiply(arrayImage2D)
        .arrayProject([0])
        .arrayFlatten([['Brightness', 'Greenness', 'Wetness']]);
    return image.addBands(componentsImage);
};

/*
  reduce_image:
  Generic function to calculate statistical reducers for a region.
/*
  reduce_image:
  (image, reducerType, roi, scale, maxPixels)
  
  Generic function to calculate statistical reducers for a region.
*/
var reduce_image = function (image, reducerType, roi, scale, maxPixels) {
    if (image === undefined) error('reduce_image', 'You need to specify an input image.');
    if (reducerType === undefined) error('reduce_image', 'You need to specify the reducer type.');
    if (roi === undefined) error('reduce_image', 'You need to specify a Region of Interest (roi).');

    scale = typeof scale !== 'undefined' ? scale : 30;
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e9;

    var red;
    switch(reducerType.toLowerCase()) {
        case 'max': red = ee.Reducer.max(); break;
        case 'min': red = ee.Reducer.min(); break;
        case 'mean': red = ee.Reducer.mean(); break;
        case 'median': red = ee.Reducer.median(); break;
        case 'mode': red = ee.Reducer.mode(); break;
        case 'sd': red = ee.Reducer.stdDev(); break;
        case 'variance': red = ee.Reducer.variance(); break;
        case 'amplitude': red = ee.Reducer.minMax(); break;
        default: red = ee.Reducer.mean();
    }

    var dict = image.reduceRegion({
        reducer: red,
        geometry: roi,
        scale: scale,
        maxPixels: maxPixels
    });
    
    return dict;
};

/*
  landsat_timeseries:
  Generic function to build an annual Landsat timeseries for a specific sensor.
/*
  landsat_timeseries:
  (sensor, type, path, row)
  
  Generic function to build an annual Landsat timeseries for a specific sensor.
*/
var landsat_timeseries = function (sensor, type, path, row) {
    if (sensor === undefined) error('landsat_timeseries', 'You need to specify the sensor.');
    if (type === undefined) error('landsat_timeseries', 'You need to specify the product type (TOA or SR).');
    if (path === undefined) error('landsat_timeseries', 'You need to specify the WRS-2 path.');
    if (row === undefined) error('landsat_timeseries', 'You need to specify the WRS-2 row.');

    var col_str = '';
    if (sensor === 'L5') col_str = 'LANDSAT/LT05/C02/T1';
    else if (sensor === 'L7') col_str = 'LANDSAT/LE07/C02/T1';
    else if (sensor === 'L8') col_str = 'LANDSAT/LC08/C02/T1';
    else if (sensor === 'L9') col_str = 'LANDSAT/LC09/C02/T1';
    
    if (type.toUpperCase() === 'TOA') col_str += '_TOA';
    else if (type.toUpperCase() === 'SR' || type.toUpperCase() === 'L2') col_str += '_L2';
    else if (sensor === 'L8' || sensor === 'L9') col_str += '_RT';

    var col = ee.ImageCollection(col_str)
                .filter(ee.Filter.eq('WRS_PATH', path))
                .filter(ee.Filter.eq('WRS_ROW', row));

    var add_ndvi = function(image) {
        var ndvi = landsat_indices(image, sensor, 'ndvi').select('NDVI');
        return image.addBands(ndvi);
    };

    return col.map(add_ndvi);
};

/*
  ndvi_s2:
  Legacy wrapper for Sentinel-2 NDVI.
*/
var ndvi_s2 = function(image) {
    return sentinel2_indices(image, 'ndvi');
};
/*
  segmentation_snic:
  (image, size, compactness)
  
  Function to segment an image using the SNIC (Simple Non-Iterative Clustering) algorithm.
*/
var segmentation_snic = function(image, size, compactness) {
  size = typeof size !== 'undefined' ? size : 10;
  compactness = typeof compactness !== 'undefined' ? compactness : 1;
  var seeds = ee.Algorithms.Image.Segmentation.seedGrid(size);
  var snic = ee.Algorithms.Image.Segmentation.SNIC({
    image: image, size: size, compactness: compactness,
    connectivity: 8, neighborhoodSize: 2 * size, seeds: seeds
  });
  return snic;
};
/*
  harmonic_trend:
  (timeseries, dependent_band, num_harmonics)
  
  Generates a Fourier Harmonic Trend model for a time-series to extract Seasonality (Phase and Amplitude) and Linear Trend.
  Supports multiple harmonics for complex phenological cycles.
  
  Params:
  (ee.ImageCollection) timeseries - The input time-series collection.
  (string) dependent_band - The name of the band to model (e.g. 'NDVI').
  (number) num_harmonics - The number of harmonics/cycles per year (default: 1).
*/
var harmonic_trend = function(timeseries, dependent_band, num_harmonics) {
  num_harmonics = typeof num_harmonics !== 'undefined' ? num_harmonics : 1;
  var time_band = 't'; var constant_band = 'constant';
  
  var add_variables = function(image) {
    var date = image.date();
    var years = date.difference(ee.Date('1970-01-01'), 'year');
    var timeRadians = ee.Image(years.multiply(2 * Math.PI)).rename(time_band).float();
    var constant = ee.Image(1).rename(constant_band);
    
    var img = image.addBands(constant).addBands(timeRadians).float();
    for (var i = 1; i <= num_harmonics; i++) {
        var n = ee.Number(i);
        var cos = timeRadians.multiply(n).cos().rename('cos_' + i);
        var sin = timeRadians.multiply(n).sin().rename('sin_' + i);
        img = img.addBands(cos).addBands(sin);
    }
    return img;
  };
  
  var ts_with_vars = timeseries.map(add_variables);
  var independents = ee.List([constant_band, time_band]);
  // Use client-side loop since num_harmonics is small and static
  var indep_array = [constant_band, time_band];
  for (var i = 1; i <= num_harmonics; i++) {
      indep_array.push('cos_' + i);
      indep_array.push('sin_' + i);
  }
  independents = ee.List(indep_array);
  
  var trend = ts_with_vars.select(independents.add(dependent_band)).reduce(ee.Reducer.linearRegression(independents.length(), 1));
  var coefficients = trend.select('coefficients').arrayProject([0]).arrayFlatten([independents]);
  
  var result = coefficients;
  for (var i = 1; i <= num_harmonics; i++) {
      var phase_name = num_harmonics === 1 ? 'phase' : 'phase_' + i;
      var amp_name = num_harmonics === 1 ? 'amplitude' : 'amplitude_' + i;
      var phase = coefficients.select('cos_' + i).atan2(coefficients.select('sin_' + i)).rename(phase_name);
      var amplitude = coefficients.select('cos_' + i).hypot(coefficients.select('sin_' + i)).rename(amp_name);
      result = result.addBands(phase).addBands(amplitude);
  }
  
  return result;
};

/*
  anomaly:
  (image, reference_collection, band)
  
  Calculates the Z-Score Anomaly of an image compared to a historical reference collection.
  Z-Score = (Value - Historical Mean) / Historical Standard Deviation
  
  Params:
  (ee.Image) image - The target image to calculate the anomaly for.
  (ee.ImageCollection) reference_collection - The historical time-series baseline.
  (string) band - The name of the band to calculate the anomaly for (e.g. 'LST' or 'NDVI').
*/
var anomaly = function(image, reference_collection, band) {
    if (image === undefined) error('anomaly', 'You need to specify a target image.');
    if (reference_collection === undefined) error('anomaly', 'You need to specify a reference collection.');
    if (band === undefined) error('anomaly', 'You need to specify the band name.');
    
    var mean = reference_collection.select(band).mean();
    var stdDev = reference_collection.select(band).reduce(ee.Reducer.stdDev());
    
    var z_score = image.select(band).subtract(mean).divide(stdDev).rename(band + '_z_score');
    return image.addBands(z_score);
};

/*
  zonal_statistics:
  (image, featureCollection, reducerType, scale)
  
  Extracts zonal statistics from an image using polygons.
*/
var zonal_statistics = function(image, featureCollection, reducerType, scale) {
  scale = typeof scale !== 'undefined' ? scale : 30;
  var red;
  switch(reducerType.toLowerCase()) {
      case 'max': red = ee.Reducer.max(); break;
      case 'min': red = ee.Reducer.min(); break;
      case 'mean': red = ee.Reducer.mean(); break;
      case 'median': red = ee.Reducer.median(); break;
      case 'mode': red = ee.Reducer.mode(); break;
      case 'sd': red = ee.Reducer.stdDev(); break;
      case 'variance': red = ee.Reducer.variance(); break;
      case 'sum': red = ee.Reducer.sum(); break;
      default: red = ee.Reducer.mean();
  }
  var stats = image.reduceRegions({collection: featureCollection, reducer: red, scale: scale});
  return stats;
};

/*
  harmonize_sensors:
  (image, source, target)
  
  Harmonizes spectral values between Sentinel-2 and Landsat-8 using OLS regression coefficients.
*/
var harmonize_sensors = function(image, source, target) {
  if (source === target) return image;
  var slopes, intercepts, band_names;
  if (source === 'S2' && target === 'L8') {
    slopes = ee.Image.constant([0.977, 1.005, 0.977, 0.995, 0.998, 0.975]);
    intercepts = ee.Image.constant([-0.004, -0.0009, 0.0009, -0.0001, -0.0011, 0.0022]);
    band_names = ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'];
  } else if (source === 'L8' && target === 'S2') {
    slopes = ee.Image.constant([1.0235, 0.995, 1.0235, 1.005, 1.002, 1.0256]);
    intercepts = ee.Image.constant([0.0041, 0.0009, -0.0009, 0.0001, 0.0011, -0.0023]);
    band_names = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
  } else { return image; }
  var selected = image.select(band_names);
  var harmonized = selected.multiply(slopes).add(intercepts);
  return image.addBands(harmonized, null, true);
};

/*
  burn_severity:
  (prefire, postfire, sensor)
  
  Calculates the Normalized Burn Ratio (NBR), Delta NBR (dNBR), and Burn Severity Classes.
*/
var burn_severity = function(pre_fire, post_fire, sensor) {
  sensor = typeof sensor !== 'undefined' ? sensor : 'L8';
  var b_nir, b_swir2;
  if (sensor === 'L8' || sensor === 'L9') { b_nir = 'B5'; b_swir2 = 'B7'; } 
  else if (sensor === 'S2') { b_nir = 'B8'; b_swir2 = 'B12'; } 
  else { b_nir = 'B4'; b_swir2 = 'B7'; }
  var pre_nbr = pre_fire.normalizedDifference([b_nir, b_swir2]).rename('NBR_pre');
  var post_nbr = post_fire.normalizedDifference([b_nir, b_swir2]).rename('NBR_post');
  var dnbr = pre_nbr.subtract(post_nbr).rename('dNBR');
  var severity_class = ee.Image(0).where(dnbr.lt(0.1), 1)
                                  .where(dnbr.gte(0.1).and(dnbr.lt(0.27)), 2)
                                  .where(dnbr.gte(0.27).and(dnbr.lt(0.66)), 3)
                                  .where(dnbr.gte(0.66), 4).rename('Severity_Class');
  return ee.Image([pre_nbr, post_nbr, dnbr, severity_class]);
};



/*
  obia_classification:
  Function to perform a complete Object-Based Image Analysis (GEOBIA) classification.
  It generates superpixels (SNIC), extracts spectral, spatial (geometry) and 
  textural (GLCM) features per object, and classifies them.

  Params:
  (ee.Image) image - The raw input image to segment and classify.
  (ee.FeatureCollection) trainingData - The training samples.
  (string) fieldName - The class column name.
  optional (Object) options - Dictionary of OBIA parameters:
      {
         snicSize: 15,
         snicCompactness: 1,
         classifier: 'rf', // 'rf', 'cart', 'svm'
         includeTexture: false,
         includeGeometry: true,
         scale: 30
      }

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet');
  var obia_results = geet.obia_classification(img, samples, 'class', {
      snicSize: 20,
      includeGeometry: true,
      includeTexture: true,
      classifier: 'rf'
  });
  var classified = obia_results.select('classification');
/*
  obia_classification:
  (image, trainingData, fieldName, options)
  
  Function to perform a complete Object-Based Image Analysis (GEOBIA) classification.
  It automatically generates superpixels (SNIC), extracts spectral, spatial (geometry), and textural (GLCM) features per object, and classifies them using Machine Learning.
*/
var obia_classification = function(image, trainingData, fieldName, options) {
    if (image === undefined) error('obia_classification', 'You need to specify an input image.');
    if (trainingData === undefined) error('obia_classification', 'You need to specify the training data.');
    if (fieldName === undefined) error('obia_classification', 'You need to specify the class field name.');

    options = options || {};
    var size = options.snicSize || 10;
    var compactness = options.snicCompactness || 1;
    var classifierType = options.classifier || 'rf';
    var includeTexture = options.includeTexture !== undefined ? options.includeTexture : false;
    var includeGeometry = options.includeGeometry !== undefined ? options.includeGeometry : false;
    var scale = options.scale || 30;

    // SNIC Segmentation
    var seeds = ee.Algorithms.Image.Segmentation.seedGrid(size);
    var snic = ee.Algorithms.Image.Segmentation.SNIC({
        image: image,
        size: size,
        compactness: compactness,
        connectivity: 8,
        neighborhoodSize: 2 * size,
        seeds: seeds
    });

    var clusters = snic.select('clusters');
    var objectFeatures = snic.select('.*_mean'); // Keep the spectral means

    // Geometry Features (Area, Perimeter, Shape Index)
    if (includeGeometry) {
        var pixelArea = ee.Image.pixelArea();
        var objectArea = pixelArea.addBands(clusters).reduceConnectedComponents({
            reducer: ee.Reducer.sum(),
            labelBand: 'clusters'
        }).rename('object_area');

        // Perimeter approximation using edge detection on clusters
        var minCluster = clusters.reduceNeighborhood({
            reducer: ee.Reducer.min(), 
            kernel: ee.Kernel.square(1)
        });
        var maxCluster = clusters.reduceNeighborhood({
            reducer: ee.Reducer.max(), 
            kernel: ee.Kernel.square(1)
        });
        var edges = minCluster.neq(maxCluster);
        
        var perimeter = edges.multiply(pixelArea).addBands(clusters).reduceConnectedComponents({
            reducer: ee.Reducer.sum(),
            labelBand: 'clusters'
        }).rename('object_perimeter');

        var shapeIndex = perimeter.divide(objectArea.sqrt().multiply(4)).rename('shape_index');
        
        objectFeatures = objectFeatures.addBands([objectArea, perimeter, shapeIndex]);
    }

    // Texture Features
    if (includeTexture) {
        // Compute GLCM on the first band to avoid memory limits
        var firstBand = image.select(0).multiply(100).toInt();
        var glcm = firstBand.glcmTexture({size: 3});
        
        var objTexture = glcm.addBands(clusters).reduceConnectedComponents({
            reducer: ee.Reducer.mean(),
            labelBand: 'clusters'
        });
        
        objectFeatures = objectFeatures.addBands(objTexture);
    }

    // Sample and Train
    var bands = objectFeatures.bandNames();
    var training = objectFeatures.sampleRegions({
        collection: trainingData,
        properties: [fieldName],
        scale: scale,
        tileScale: 4
    });

    var classifier;
    if (classifierType.toLowerCase() === 'rf') {
        classifier = ee.Classifier.smileRandomForest(10).train(training, fieldName, bands);
    } else if (classifierType.toLowerCase() === 'cart') {
        classifier = ee.Classifier.smileCart().train(training, fieldName, bands);
    } else if (classifierType.toLowerCase() === 'svm') {
        classifier = ee.Classifier.libsvm().train(training, fieldName, bands);
    } else {
        classifier = ee.Classifier.smileRandomForest(10).train(training, fieldName, bands);
    }

    // Classify the Objects
    var classified = objectFeatures.classify(classifier).rename('classification');

    return ee.Image([clusters, objectFeatures, classified]);
};



/*
  filter_small_objects:
  Eliminates small patches in a classified image (Minimum Mapping Unit filter) 
  by replacing them with the most common neighboring class.

  Params:
  (ee.Image) image - The classified image (single band).
  (number) minArea - The minimum area in square meters (e.g., 10000 for 1 hectare).
  (number) maxSize - The focal mode radius to fill gaps (default 50).

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet');
  var cleaned_map = geet.filter_small_objects(classified, 10000);
/*
  filter_small_objects:
  (image, minArea, maxSize)
  
  Eliminates small patches in a classified image (Minimum Mapping Unit filter) by replacing them with the most common neighboring class.
*/
var filter_small_objects = function(image, minArea, maxSize) {
    if (image === undefined) error('filter_small_objects', 'You need to specify an input classified image.');
    if (minArea === undefined) error('filter_small_objects', 'You need to specify the minimum area in square meters.');

    maxSize = typeof maxSize !== 'undefined' ? maxSize : 50;

    var bandName = image.bandNames().get(0);
    var pixelArea = ee.Image.pixelArea();
    
    // Calculate the area of each connected class patch
    var patchArea = pixelArea.addBands(image).reduceConnectedComponents({
      reducer: ee.Reducer.sum(),
      labelBand: bandName
    });

    // Identify patches smaller than the minimum area
    var smallPatches = patchArea.lt(minArea);
    
    // Mask out the small patches from the original image
    var filtered = image.updateMask(smallPatches.not());

    // Fill the holes with the majority class of the surrounding pixels
    var filled = filtered.focal_mode({radius: maxSize, units: 'pixels', iterations: 3});

    // Blend the filled patches with the original masked image
    return filled.blend(filtered).unmask(image);
};


/*
  plot:
  A smart wrapper for Map.addLayer that automatically applies standard 
  color palettes and normalization ranges for common remote sensing products.

  Params:
  (ee.Image) image - The input image to be visualized.
  (string) type - 'rgb', 'false_color', 'ndvi', 'ndwi', 'ndbi', 'class', 'gray'.
  (string) name - The name of the layer (default 'GEET Layer').
  (Object) options - Optional overrides: {min: 0, max: 1, palette: [], bands: [], sensor: 'L8'}.

  Usage:
  var geet = require('users/eduardolacerdageo/geet:geet');
  geet.plot(ndvi_image, 'ndvi', 'Vegetation Index');
  geet.plot(l8_img, 'rgb', 'True Color', {sensor: 'L8'});
/*
  plot:
  (image, type, name, options)
  
  A smart wrapper for Map.addLayer that automatically applies standard color palettes and normalization ranges for common remote sensing products.
*/
var plot = function (image, type, name, options) {
    if (image === undefined) error('plot', 'You need to specify an input image.');
    
    type = type ? type.toLowerCase() : 'gray';
    name = name || 'GEET Layer';
    options = options || {};

    var visParams = {};
    var sensor = options.sensor ? options.sensor.toUpperCase() : 'L8';

    switch (type) {
        case 'rgb':
            if (sensor === 'S2') visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};
            else if (sensor === 'L8' || sensor === 'L9') visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3};
            else visParams = {bands: ['B3', 'B2', 'B1'], min: 0, max: 0.3}; // L5, L7
            break;
            
        case 'false_color':
            if (sensor === 'S2') visParams = {bands: ['B8', 'B4', 'B3'], min: 0, max: 3000};
            else if (sensor === 'L8' || sensor === 'L9') visParams = {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.3};
            else visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3};
            break;

        case 'ndvi':
            visParams = {min: -1, max: 1, palette: ['red', 'orange', 'yellow', 'lightgreen', 'darkgreen']};
            break;

        case 'ndwi':
            visParams = {min: -1, max: 1, palette: ['brown', 'white', 'blue', 'darkblue']};
            break;

        case 'ndbi':
            visParams = {min: -1, max: 1, palette: ['darkgreen', 'lightgreen', 'white', 'gray', 'red']};
            break;
            
        case 'class':
        case 'classification':
            visParams = {min: 1, max: 10, palette: ['#006400', '#ffbb22', '#ffff4c', '#f096ff', '#fa0000', '#b4b4b4', '#f0f0f0', '#0064c8', '#0096a0', '#00cf75', '#fae6a0']};
            break;

        case 'gray':
            visParams = {min: 0, max: 0.3};
            break;

        default:
            visParams = {};
    }

    // Apply user overrides if provided
    if (options.min !== undefined) visParams.min = options.min;
    if (options.max !== undefined) visParams.max = options.max;
    if (options.palette !== undefined) visParams.palette = options.palette;
    if (options.bands !== undefined) visParams.bands = options.bands;

    Map.addLayer(image, visParams, name);
};
/*
  build_annual_mss_timeseries:
  (roi)
  
  Function to build an annual Landsat MSS (Landsat 1, 2, 3, 4, 5) timeseries from 1972 to 1999. The function normalizes the distinct bands of older satellites into 'GREEN', 'RED', 'NIR1', 'NIR2', masks clouds using QAPIXEL, calculates NDVI, and generates median annual mosaics.
*/
var build_annual_mss_timeseries = function(roi) {
    roi = typeof roi !== 'undefined' ? roi : ee.Geometry.Point([-43.0879, -22.8632]);

    var lm1 = ee.ImageCollection("LANDSAT/LM01/C02/T1").merge(ee.ImageCollection("LANDSAT/LM01/C02/T2"));
    var lm2 = ee.ImageCollection("LANDSAT/LM02/C02/T1").merge(ee.ImageCollection("LANDSAT/LM02/C02/T2"));
    var lm3 = ee.ImageCollection("LANDSAT/LM03/C02/T1").merge(ee.ImageCollection("LANDSAT/LM03/C02/T2"));
    var lm4 = ee.ImageCollection("LANDSAT/LM04/C02/T1").merge(ee.ImageCollection("LANDSAT/LM04/C02/T2"));
    var lm5 = ee.ImageCollection("LANDSAT/LM05/C02/T1").merge(ee.ImageCollection("LANDSAT/LM05/C02/T2"));

    function rename_lm13(image) {
        var bands = ['B4', 'B5', 'B6', 'B7'];
        var new_bands = ['GREEN', 'RED', 'NIR1', 'NIR2'];
        return image.select(bands).rename(new_bands);
    }
    
    function rename_lm45(image) {
        var bands = ['B1', 'B2', 'B3', 'B4'];
        var new_bands = ['GREEN', 'RED', 'NIR1', 'NIR2'];
        return image.select(bands).rename(new_bands);
    }
    
    function calc_ndvi(image) {
        var ndvi = image.normalizedDifference(['NIR2', 'RED']).rename('NDVI');
        return image.addBands(ndvi);
    }

    function mask_mss(image) {
        var qa = image.select('QA_PIXEL');
        var cloudShadowBitMask = (1 << 4);
        var cloudsBitMask = (1 << 3);
        var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                   .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
        return image.updateMask(mask);
    }

    var col13 = ee.ImageCollection(lm1.merge(lm2).merge(lm3))
        .filterBounds(roi)
        .map(rename_lm13);

    var col45 = ee.ImageCollection(lm4.merge(lm5))
        .filterBounds(roi)
        .map(rename_lm45);

    var mss_col = col13.merge(col45)
        .map(calc_ndvi);

    var start = '-01-01';
    var finish = '-12-31';
    var year_col_list = ee.List([]);

    for (var year = 1972; year <= 1999; year++) {
        var collection = mss_col.filterDate(year.toString() + start, year.toString() + finish);
        
        var dummy = ee.Image.constant([0,0,0,0,0]).rename(['GREEN', 'RED', 'NIR1', 'NIR2', 'NDVI']).updateMask(0);
        var merged = collection.median().addBands(dummy).select(['GREEN', 'RED', 'NIR1', 'NIR2', 'NDVI']);
        
        year_col_list = year_col_list.add(ee.Image(merged).set('year', year));
    }
    
    return ee.ImageCollection(year_col_list);
}

/*
  topographic_correction:
  Function to apply Topographic Illumination Correction to optical images.
  Useful for removing mountain shadows.

  Params:
  (ee.Image) img - the optical image to correct (e.g., Landsat or Sentinel).
  (ee.Image) dem - (optional) the Digital Elevation Model to use. Defaults to SRTM.
/*
  topographic_correction:
  (image, dem)
  
  Applies Topographic Illumination Correction to optical images using the Cosine correction method. This is extremely useful for removing terrain shadows in mountainous areas, relying on the solar elevation and azimuth stored in the image's metadata.
*/
var topographic_correction = function(img, dem) {
    if (dem === undefined) { dem = ee.Image('USGS/SRTMGL1_003'); }
    
    var sunAzimuth = ee.Algorithms.If(
        img.get('SUN_AZIMUTH'),
        ee.Number(img.get('SUN_AZIMUTH')),
        ee.Algorithms.If(
            img.get('MEAN_SOLAR_AZIMUTH_ANGLE'),
            ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')),
            ee.Number(45)
        )
    );
    
    var sunZenith = ee.Algorithms.If(
        img.get('SUN_ELEVATION'),
        ee.Number(90).subtract(ee.Number(img.get('SUN_ELEVATION'))),
        ee.Algorithms.If(
            img.get('MEAN_SOLAR_ZENITH_ANGLE'),
            ee.Number(img.get('MEAN_SOLAR_ZENITH_ANGLE')),
            ee.Number(45)
        )
    );

    var slope = ee.Terrain.slope(dem).multiply(Math.PI / 180.0);
    var aspect = ee.Terrain.aspect(dem).multiply(Math.PI / 180.0);
    var sz = ee.Number(sunZenith).multiply(Math.PI / 180.0);
    var sa = ee.Number(sunAzimuth).multiply(Math.PI / 180.0);

    var cosZ = sz.cos();
    var sinZ = sz.sin();
    var cosS = slope.cos();
    var sinS = slope.sin();
    
    // Number - Image requires ee.Image.constant(Number)
    var cosAzAs = ee.Image.constant(sa).subtract(aspect).cos();
    
    // Image.multiply(Number)
    var term1 = cosS.multiply(cosZ);
    var term2 = sinS.multiply(sinZ).multiply(cosAzAs);
    var IC = term1.add(term2).rename('IC');

    var correction = ee.Image.constant(cosZ).divide(IC);
    var mask = IC.gte(0.1); // Avoid extreme values in complete shadow
    
    // Apply correction to bands that are typically optical (not QA)
    var opticalBands = img.select(['^(B.*|SR.*|BLUE|GREEN|RED|NIR.*|SWIR.*)$']);
    var corrected = opticalBands.multiply(correction).updateMask(mask);
    
    return img.addBands(corrected, null, true);
};

/*
  calculate_twi:
  Calculates the Topographic Wetness Index (TWI) based on slope and flow accumulation.

  Params:
  (ee.Geometry) roi - (optional) the region of interest to clip the outputs.
/*
  calculate_twi:
  (roi)
  
  Calculates the Topographic Wetness Index (TWI). This index combines local slope and flow accumulation to quantify topographic control on hydrological processes, making it excellent for identifying wetlands, springs, and water accumulation zones.
*/
var calculate_twi = function(roi) {
    var dem = ee.Image('USGS/SRTMGL1_003');
    var acc = ee.Image('WWF/HydroSHEDS/15ACC');
    
    if (roi !== undefined) {
        dem = dem.clip(roi);
        acc = acc.clip(roi);
    }
    
    var slope = ee.Terrain.slope(dem).multiply(Math.PI / 180.0);
    var pixelArea = ee.Image.pixelArea();
    var catchmentArea = acc.multiply(pixelArea);
    var twi = catchmentArea.divide(slope.tan().add(0.00001)).log().rename('TWI');
    
    return twi;
};

/*
  calculate_tpi_tri:
  Calculates Topographic Position Index (TPI) and Terrain Ruggedness Index (TRI) based on focal operations.

  Params:
  (ee.Geometry) roi - (optional) the region of interest to clip the outputs.
/*
  calculate_tpi_tri:
  (roi)
  
  Calculates the Topographic Position Index (TPI) and Terrain Ruggedness Index (TRI) based on focal mean and focal standard deviation. TPI is used to classify valleys and ridges, while TRI is used to map terrain unevenness.
*/
var calculate_tpi_tri = function(roi) {
    var dem = ee.Image('USGS/SRTMGL1_003');
    if (roi !== undefined) {
        dem = dem.clip(roi);
    }
    
    var kernel = ee.Kernel.square({radius: 3, units: 'pixels'});
    var focalMean = dem.reduceNeighborhood({reducer: ee.Reducer.mean(), kernel: kernel});
    var tpi = dem.subtract(focalMean).rename('TPI');
    var tri = dem.reduceNeighborhood({reducer: ee.Reducer.stdDev(), kernel: kernel}).rename('TRI');
    
    return ee.Image([tpi, tri]);
};

/*
  extract_drainage:
  Extracts a drainage/stream network based on a flow accumulation threshold.

  Params:
  (ee.Geometry) roi - (optional) the region of interest.
  (number) threshold - (optional) the flow accumulation threshold (in pixels) to define a stream. Defaults to 500.
/*
  extract_drainage:
  (roi, threshold)
  
  Automatically extracts the drainage/stream network based on a flow accumulation threshold using the HydroSHEDS dataset.
*/
var extract_drainage = function(roi, threshold) {
    threshold = typeof threshold !== 'undefined' ? threshold : 500;
    
    var acc = ee.Image('WWF/HydroSHEDS/15ACC');
    if (roi !== undefined) {
        acc = acc.clip(roi);
    }
    
    var drainage = acc.gt(threshold).rename('Drainage');
    return drainage.updateMask(drainage);
};






/*
  imad:
  Iteratively Reweighted Multivariate Alteration Detection (iMAD) algorithm.
  Used for advanced change detection and invariant pixel identification.
  Based on Mort Canty's Earth Engine implementation.

  Params:
  (ee.Image) current - the target image (or current iteration image).
  (ee.Dictionary) prev - the dictionary from the previous iteration.
*/

function imad(current, prev) {
    var done = ee.Number(ee.Dictionary(prev).get('done'))
    return ee.Algorithms.If(done, prev, imad1(current, prev))
}

/*
  chi2cdf:
  Chi square cumulative distribution function.
  
  Params:
  (ee.Image) chi2 - The Chi-square image.
  (ee.Number) df - Degrees of freedom.
*/
function chi2cdf(chi2, df) {
    return ee.Image(chi2.divide(2)).gammainc(ee.Number(df).divide(2))
}

/*
  addcoeffs:
  Appends orthogonal regression coefficients to the log list.
  
  Params:
  (ee.List) current - The current coefficients.
  (ee.List) prev - The previous log list.
*/
function addcoeffs(current, prev) {
    var coeff = ee.List(current)
    var log = ee.List(prev)
    return log.add(coeff)
}

/*
  geneiv:
  Solves the generalized eigenproblem C*X = lambda*B*X.
  
  Params:
  (ee.Array) C - The first covariance matrix.
  (ee.Array) B - The second covariance matrix.
*/
function geneiv(C, B) {
    var C = ee.Array(C)
    var B = ee.Array(B)
    // Li = choldc(B)^-1
    var Li = ee.Array(B.matrixCholeskyDecomposition().get('L')).matrixInverse()
    //  solve symmetric eigenproblem Li*C*Li^T*x = lambda*x
    var Xa = Li.matrixMultiply(C)
        .matrixMultiply(Li.matrixTranspose())
        .eigen()
    // eigenvalues as a row vector
    var lambdas = Xa.slice(1, 0, 1).matrixTranspose()
    // eigenvectors as columns
    var X = Xa.slice(1, 1).matrixTranspose()
    // generalized eigenvectors as columns, Li^T*X
    var eigenvecs = Li.matrixTranspose().matrixMultiply(X)
    return [lambdas, eigenvecs];
}

/*
  covarw:
  Returns the weighted centered image and its weighted covariance matrix.
  
  Params:
  (ee.Image) image - The input image.
  (ee.Image) weights - The weights image.
  (number) maxPixels - Maximum number of pixels to sample.
*/
function covarw(image, weights, maxPixels) {
    maxPixels = typeof maxPixels !== 'undefined' ? maxPixels : 1e9;
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
    return [centered.arrayFlatten([bandNames]), covw]
}

/*
  imad1:
  Iteratively re-weighted MAD core algorithm.
  
  Params:
  (ee.Number) current - The iteration index.
  (ee.Dictionary) prev - The state dictionary containing the image and iteration variables.
*/
function imad1(current, prev) {
    var image = ee.Image(ee.Dictionary(prev).get('image'));
    var chi2 = ee.Image(ee.Dictionary(prev).get('chi2'));
    var allrhos = ee.List(ee.Dictionary(prev).get('allrhos'));
    var region = image.geometry();
    var nBands = image.bandNames().length().divide(2);
    var weights = chi2cdf(chi2, nBands).subtract(1).multiply(-1);
    // ---------- check later -----------
    // centeredImage,covarArray = covarw(image,weights) - python
    var centeredImage = covarw(image, weights)[0];
    var covarArray = covarw(image, weights)[1];
    // ---------- check later -----------
    var bNames = centeredImage.bandNames();
    var bNames1 = bNames.slice(0, nBands);
    var bNames2 = bNames.slice(nBands);
    var centeredImage1 = centeredImage.select(bNames1);
    var centeredImage2 = centeredImage.select(bNames2);
    var s11 = covarArray.slice(0, 0, nBands).slice(1, 0, nBands);
    var s22 = covarArray.slice(0, nBands).slice(1, nBands);
    var s12 = covarArray.slice(0, 0, nBands).slice(1, nBands);
    var s21 = covarArray.slice(0, nBands).slice(1, 0, nBands);
    var c1 = s12.matrixMultiply(s22.matrixInverse()).matrixMultiply(s21);
    var b1 = s11;
    var c2 = s21.matrixMultiply(s11.matrixInverse()).matrixMultiply(s12);
    var b2 = s22;
    /* solution of generalized eigenproblems */
    var lambdas = geneiv(c1, b1)[0];
    var A = geneiv(c1, b1)[1];
    var B = geneiv(c2, b2)[1];
    var rhos = lambdas.sqrt().project(ee.List([1]));
    /* sort in increasing order */
    var keys = ee.List.sequence(nBands, 1, -1);
    A = A.sort([keys]);
    B = B.sort([keys]);
    rhos = rhos.sort(keys);
    /* test for convergence */
    var lastrhos = ee.Array(allrhos.get(-1));
    var done = rhos.subtract(lastrhos).abs().reduce(ee.Reducer.max(), ee.List([0]))
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
    var s = tmp.matrixMultiply(s11).matrixMultiply(A).reduce(ee.Reducer.sum(), [0]).transpose();
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
    return ee.Dictionary({ 'done': done, 'image': image, 'allrhos': allrhos, 'chi2': chi2, 'MAD': MAD });
}

function radcal(current, prev) {
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
    var image1 = image.clip(rect).select(k.add(nbands), k).updateMask(ncmask).rename(['x', 'y']);
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
    var R = S.get([0, 1]).divide(S.get([0, 0]).multiply(S.get([1, 1])).sqrt());
    var eivs = S.eigen();
    var e1 = eivs.get([0, 1]);
    var e2 = eivs.get([0, 2]);
    /* slope and intercept */
    var b = e2.divide(e1);
    var a = Ym.subtract(b.multiply(Xm));
    var coeffs = coeffs.add(ee.List([b, a, R]));
    /* normalize kth band in target */
    var normalized = normalized.addBands(image.select(k.add(nbands)).multiply(b).add(a));
    return ee.Dictionary({ 'image': image, 'ncmask': ncmask, 'nbands': nbands, 'rect': rect, 'coeffs': coeffs, 'normalized': normalized });
}


/*
  radcalbatch:
  Batch Relative Radiometric Normalization using orthogonal regression 
  based on pseudo-invariant features derived from iMAD.

  Params:
  (ee.Image) current - the target image to normalize.
  (ee.Dictionary) prev - the dictionary containing the reference image and iteration state.
*/
function radcalbatch(current, prev) {
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
    var inputlist = ee.List.sequence(1, niter);
    var image = reference.addBands(target);
    var first = ee.Dictionary({
        'done': ee.Number(0),
        'image': image.clip(rect),
        'allrhos': [ee.List.sequence(1, nbands)],
        'chi2': ee.Image.constant(0),
        'MAD': ee.Image.constant(0)
    });
    var result = ee.Dictionary(inputlist.iterate(imad, first));
    var chi2 = ee.Image(result.get('chi2')).rename(['chi2']);
    var allrhos = ee.List(result.get('allrhos'));
    /* run radcal */
    var ncmask = chi2cdf(chi2, nbands).lt(ee.Image.constant(0.05));
    var inputlist1 = ee.List.sequence(0, nbands.subtract(1));
    var first = ee.Dictionary({
        'image': image,
        'ncmask': ncmask,
        'nbands': nbands,
        'rect': rect,
        'coeffs': ee.List([]),
        'normalized': ee.Image()
    });
    var result = ee.Dictionary(inputlist1.iterate(radcal, first));
    var coeffs = ee.List(result.get('coeffs'));
    /* update log */
    var ninvar = ee.String(ncmask.reduceRegion({
        reducer: ee.Reducer.sum().unweighted(),
        maxPixels: 1e9
    }).toArray().project([0]));
    var log = log.add(target.get('system:id'));
    var iters = allrhos.length().subtract(1);
    var log = log.add(ee.Algorithms.If(iters.eq(niter), ['No convergence, iterations:', iters],
        ['Iterations:', iters]));
    var log = log.add(['Invariant pixels:', ninvar]);
    var log = ee.List(coeffs.iterate(addcoeffs, log));
    /* first band in normalized result is empty */
    var sel = ee.List.sequence(1, nbands);
    var normalized = ee.Image(result.get('normalized')).select(sel);
    var normalizedimages = normalizedimages.add(normalized);
    return ee.Dictionary({ 'reference': reference, 'rect': rect, 'niter': niter, 'log': log, 'normalizedimages': normalizedimages });
}



// --- HLS Harmonization Functions (Landsat & Sentinel-2) ---

var max_cloud_probability = 65;

// Cloud and shadow mask for landsat images
function cs_mask_landsat(original_image, qa_band) {
  
  // Error handling
  if (original_image === undefined) print('cloudmask_sr_landsat: You need to specify an input image.');
  if (qa_band === undefined) print('cloudmask_sr_landsat: You need to specify an input QA band.');
  
    var getQABits = function (qa_band, start, end, newName) {
      var pattern = 0;
      for (var i = start; i <= end; i++) {
        pattern += Math.pow(2, i);
      }
      return qa_band.select([0], [newName])
          .bitwiseAnd(pattern)
          .rightShift(start);
  };
  // Updated for Landsat Collection 2 QA_PIXEL
  // Bit 3 is Cloud, Bit 4 is Cloud Shadow
  var c = getQABits(qa_band, 3, 3, 'Cloud').eq(0);
  var cs = getQABits(qa_band, 4, 4, 'Cloud_shadows').eq(0);
  original_image = original_image.updateMask(cs);
  return original_image.updateMask(c);
}

var cloudmask_sr_sentinel_simple = function(original_image, qa_band) {
  
  // Error handling
  if (original_image === undefined) print('cloudmask_sr_sentinel: You need to specify an input image.');
  if (qa_band === undefined) print('cloudmask_sr_sentinel: You need to specify an input QA band.');
  
  var clouds = qa_band.bitwiseAnd(1<<10).or(qa_band.bitwiseAnd(1<<11));// this gives us cloudy pixels
  return original_image.updateMask(clouds.not()); // remove the clouds from image
};


function cloudmask_sr_sentinel(image) {
  var clouds = ee.Image(image.get('cloud_mask')).select('probability');
  var isNotCloud = clouds.lt(max_cloud_probability);
  return image.updateMask(isNotCloud);
}

// The masks for the 10m bands sometimes do not exclude bad data at
// scene edges, so we apply masks from the 20m and 60m bands as well.
// https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_CLOUD_PROBABILITY
function edgesmask_sr_sentinel(image) {
  return image.updateMask(
      image.select('B8A').mask().updateMask(image.select('B9').mask()));
}

// Function for finding dark outliers in time series
// Masks pixels that are dark, and dark outliers
function simple_TDOM2(image){
  var shadow_sum_bands = ['nir','swir1'];
  var sim_thresh = 0.4;
  var z_shadow_thresh = -1.2;
  //Get some pixel-wise stats for the time series
  var img_std_dev = image.select(shadow_sum_bands).reduce(ee.Reducer.stdDev());
  var img_mean = image.select(shadow_sum_bands).mean();
  var band_names = ee.Image(image.first()).bandNames();
  //Mask out dark dark outliers
  image = image.map(function(img){
    var z = img.select(shadow_sum_bands).subtract(img_mean).divide(img_std_dev);
    var img_sum = img.select(shadow_sum_bands).reduce(ee.Reducer.sum());
    var m = z.lt(z_shadow_thresh).reduce(ee.Reducer.sum()).eq(2).and(img_sum.lt(sim_thresh)).not();
    
    return img.updateMask(img.mask().and(m));
  });
  
  return image.select(band_names);
}

//This script corrects the BRDF and Topography effect of a L8 and S2 image, surface reflectance product
//Adapted from: Poortinga et al.,2018 https://doi.org/10.3390/rs11070831

// Step 1: BRDF correction
var PI = ee.Number(3.14159265359);
var MAX_SATELLITE_ZENITH = 7.5;
var MAX_DISTANCE = 1000000;
var UPPER_LEFT = 0;
var LOWER_LEFT = 1;
var LOWER_RIGHT = 2;
var UPPER_RIGHT = 3;

//Step 2:  Topographic correction
var scale = 30;
var dem = ee.Image("USGS/SRTMGL1_003");
var degree2radian = 0.01745;


//Global functions
//BRDF correction
//Source: https://doi.org/10.3390/rs11070831
function apply_brdf_landsat(image){
  var date = image.date();
  var footprint = ee.List(image.geometry().bounds().bounds().coordinates().get(0));
  var angles =  get_sun_angles(date, footprint);
  var sunAz = angles[0];
  var sunZen = angles[1];
  var viewAz = azimuth(footprint);
  var viewZen = zenith(footprint);
  var kval = _kvol(sunAz, sunZen, viewAz, viewZen);
  var kvol = kval[0];
  var kvol0 = kval[1];
  var result = _apply_landsat(image, kvol.multiply(PI), kvol0.multiply(PI));
  
  return result;
}

function apply_brdf_sentinel(image){
  var date = image.date();
  var footprint = ee.List(image.geometry().bounds().bounds().coordinates().get(0));
  var angles =  get_sun_angles(date, footprint);
  var sunAz = angles[0];
  var sunZen = angles[1];
  var viewAz = azimuth(footprint);
  var viewZen = zenith(footprint);
  var kval = _kvol(sunAz, sunZen, viewAz, viewZen);
  var kvol = kval[0];
  var kvol0 = kval[1];
  var result = _apply_sentinel(image, kvol.multiply(PI), kvol0.multiply(PI));
  
  return result;
}

function get_sun_angles(date, footprint){
  var jdp = date.getFraction('year');
  var seconds_in_hour = 3600;
  var  hourGMT = ee.Number(date.getRelative('second', 'day')).divide(seconds_in_hour);
    
  var latRad = ee.Image.pixelLonLat().select('latitude').multiply(PI.divide(180));
  var longDeg = ee.Image.pixelLonLat().select('longitude');
    
  // Julian day proportion in radians
  var jdpr = jdp.multiply(PI).multiply(2);
    
  var a = ee.List([0.000075, 0.001868, 0.032077, 0.014615, 0.040849]);
  var meanSolarTime = longDeg.divide(15.0).add(ee.Number(hourGMT));
  var localSolarDiff1 = value(a, 0)
          .add(value(a, 1).multiply(jdpr.cos())) 
          .subtract(value(a, 2).multiply(jdpr.sin())) 
          .subtract(value(a, 3).multiply(jdpr.multiply(2).cos())) 
          .subtract(value(a, 4).multiply(jdpr.multiply(2).sin()));

  var localSolarDiff2 = localSolarDiff1.multiply(12 * 60);
  
  var localSolarDiff = localSolarDiff2.divide(PI);
  var trueSolarTime = meanSolarTime 
          .add(localSolarDiff.divide(60)) 
          .subtract(12.0);
    
  // Hour as an angle;
  var ah = trueSolarTime.multiply(ee.Number(MAX_SATELLITE_ZENITH * 2).multiply(PI.divide(180))) ;   
  var b = ee.List([0.006918, 0.399912, 0.070257, 0.006758, 0.000907, 0.002697, 0.001480]);
  var delta = value(b, 0) 
        .subtract(value(b, 1).multiply(jdpr.cos())) 
        .add(value(b, 2).multiply(jdpr.sin())) 
        .subtract(value(b, 3).multiply(jdpr.multiply(2).cos())) 
        .add(value(b, 4).multiply(jdpr.multiply(2).sin())) 
        .subtract(value(b, 5).multiply(jdpr.multiply(3).cos())) 
        .add(value(b, 6).multiply(jdpr.multiply(3).sin()));

  var cosSunZen = latRad.sin().multiply(delta.sin()) 
        .add(latRad.cos().multiply(ah.cos()).multiply(delta.cos()));
  var sunZen = cosSunZen.acos();

  // sun azimuth from south, turning west
  var sinSunAzSW = ah.sin().multiply(delta.cos()).divide(sunZen.sin());
  sinSunAzSW = sinSunAzSW.clamp(-1.0, 1.0);
  
  var cosSunAzSW = (latRad.cos().multiply(-1).multiply(delta.sin())
                    .add(latRad.sin().multiply(delta.cos()).multiply(ah.cos()))) 
                    .divide(sunZen.sin());
  var sunAzSW = sinSunAzSW.asin();
  
  sunAzSW = where(cosSunAzSW.lte(0), sunAzSW.multiply(-1).add(PI), sunAzSW);
  sunAzSW = where(cosSunAzSW.gt(0).and(sinSunAzSW.lte(0)), sunAzSW.add(PI.multiply(2)), sunAzSW);
  
  var sunAz = sunAzSW.add(PI);
   // # Keep within [0, 2pi] range
    sunAz = where(sunAz.gt(PI.multiply(2)), sunAz.subtract(PI.multiply(2)), sunAz);
  
  var footprint_polygon = ee.Geometry.Polygon(footprint);
  sunAz = sunAz.clip(footprint_polygon);
  sunAz = sunAz.rename(['sunAz']);
  sunZen = sunZen.clip(footprint_polygon).rename(['sunZen']);
  
  return [sunAz, sunZen];
}

function azimuth(footprint){
  function x(point){return ee.Number(ee.List(point).get(0))}
  function  y(point){return ee.Number(ee.List(point).get(1))}
    
  var upperCenter = line_from_coords(footprint, UPPER_LEFT, UPPER_RIGHT).centroid().coordinates();
  var lowerCenter = line_from_coords(footprint, LOWER_LEFT, LOWER_RIGHT).centroid().coordinates();
  var slope = ((y(lowerCenter)).subtract(y(upperCenter))).divide((x(lowerCenter)).subtract(x(upperCenter)));
  var slopePerp = ee.Number(-1).divide(slope);
  var azimuthLeft = ee.Image(PI.divide(2).subtract((slopePerp).atan()));
  return azimuthLeft.rename(['viewAz']);
}
  
function zenith(footprint){
  var leftLine = line_from_coords(footprint, UPPER_LEFT, LOWER_LEFT);
  var rightLine = line_from_coords(footprint, UPPER_RIGHT, LOWER_RIGHT);
  var leftDistance = ee.FeatureCollection(leftLine).distance(MAX_DISTANCE);
  var rightDistance = ee.FeatureCollection(rightLine).distance(MAX_DISTANCE);
  var viewZenith = rightDistance.multiply(ee.Number(MAX_SATELLITE_ZENITH * 2)) 
        .divide(rightDistance.add(leftDistance)) 
        .subtract(ee.Number(MAX_SATELLITE_ZENITH)) 
        .clip(ee.Geometry.Polygon(footprint)) 
        .rename(['viewZen']);
  return viewZenith.multiply(PI.divide(180));
}

function _apply_sentinel(image, kvol, kvol0){
  var f_iso = 0;
  var f_geo = 0;
  var f_vol = 0;
	var blue = _correct_band(image, 'blue', kvol, kvol0, f_iso=0.0774, f_geo=0.0079, f_vol=0.0372);
	var green = _correct_band(image, 'green', kvol, kvol0, f_iso=0.1306, f_geo=0.0178, f_vol=0.0580);
	var red = _correct_band(image, 'red', kvol, kvol0, f_iso=0.1690, f_geo=0.0227, f_vol=0.0574);
	var re1 = _correct_band(image, 're1', kvol, kvol0, f_iso=0.2085, f_geo=0.0256, f_vol=0.0845);
	var re2 = _correct_band(image, 're2', kvol, kvol0, f_iso=0.2316, f_geo=0.0273, f_vol=0.1003);
	var re3 = _correct_band(image, 're3', kvol, kvol0, f_iso=0.2599, f_geo=0.0294, f_vol=0.1197);
    var nir = _correct_band(image, 'nir', kvol, kvol0, f_iso=0.3093, f_geo=0.0330, f_vol=0.1535);
    var re4 = _correct_band(image, 're4', kvol, kvol0, f_iso=0.2907, f_geo=0.0410, f_vol=0.1611);
    var swir1 = _correct_band(image, 'swir1', kvol, kvol0, f_iso=0.3430, f_geo=0.0453, f_vol=0.1154);   
    var swir2 = _correct_band(image, 'swir2', kvol, kvol0, f_iso=0.2658, f_geo=0.0387, f_vol=0.0639);
	return image.select([]).addBands([blue, green, red, re1, re2, re3, nir, re4, swir1, swir2]);
}

function _apply_landsat(image, kvol, kvol0){
  var f_iso = 0;
  var f_geo = 0;
  var f_vol = 0;
	var blue = _correct_band(image, 'blue', kvol, kvol0, f_iso=0.0774, f_geo=0.0079, f_vol=0.0372);
	var green = _correct_band(image, 'green', kvol, kvol0, f_iso=0.1306, f_geo=0.0178, f_vol=0.0580);
	var red = _correct_band(image, 'red', kvol, kvol0, f_iso=0.1690, f_geo=0.0227, f_vol=0.0574);
  var nir = _correct_band(image, 'nir', kvol, kvol0, f_iso=0.3093, f_geo=0.0330, f_vol=0.1535);
  var swir1 = _correct_band(image, 'swir1', kvol, kvol0, f_iso=0.3430, f_geo=0.0453, f_vol=0.1154);   
  var swir2 = _correct_band(image, 'swir2', kvol, kvol0, f_iso=0.2658, f_geo=0.0387, f_vol=0.0639);
	return image.select([]).addBands([blue, green, red, nir, swir1, swir2]);
}

function _correct_band(image, band_name, kvol, kvol0, f_iso, f_geo, f_vol){
	//"""fiso + fvol * kvol + fgeo * kgeo"""
	var iso = ee.Image(f_iso);
	var geo = ee.Image(f_geo);
	var vol = ee.Image(f_vol);
	var pred = vol.multiply(kvol).add(geo.multiply(kvol)).add(iso).rename(['pred']);
	var pred0 = vol.multiply(kvol0).add(geo.multiply(kvol0)).add(iso).rename(['pred0']);
	var cfac = pred0.divide(pred).rename(['cfac']);
	var corr = image.select(band_name).multiply(cfac).rename([band_name]);
	return corr;
}

function _kvol(sunAz, sunZen, viewAz, viewZen){
	//"""Calculate kvol kernel.
	//From Lucht et al. 2000
	//Phase angle = cos(solar zenith) cos(view zenith) + sin(solar zenith) sin(view zenith) cos(relative azimuth)"""
			
	var relative_azimuth = sunAz.subtract(viewAz).rename(['relAz']);
	var pa1 = viewZen.cos().multiply(sunZen.cos());
	var pa2 = viewZen.sin().multiply(sunZen.sin()).multiply(relative_azimuth.cos());
	var phase_angle1 = pa1.add(pa2);
	var phase_angle = phase_angle1.clamp(-1.0, 1.0).acos();
	var p1 = ee.Image(PI.divide(2)).subtract(phase_angle);
	var p2 = p1.multiply(phase_angle1);
	var p3 = p2.add(phase_angle.sin());
	var p4 = sunZen.cos().add(viewZen.cos());
	var p5 = ee.Image(PI.divide(4));

	var kvol = p3.divide(p4).subtract(p5).rename(['kvol']);

	var viewZen0 = ee.Image(0);
	var pa10 = viewZen0.cos().multiply(sunZen.cos());
	var pa20 = viewZen0.sin().multiply(sunZen.sin()).multiply(relative_azimuth.cos());
	var phase_angle10 = pa10.add(pa20);
	var phase_angle0 = phase_angle10.clamp(-1.0, 1.0).acos();
	var p10 = ee.Image(PI.divide(2)).subtract(phase_angle0);
	var p20 = p10.multiply(phase_angle10);
	var p30 = p20.add(phase_angle0.sin());
	var p40 = sunZen.cos().add(viewZen0.cos());
	var p50 = ee.Image(PI.divide(4));

	var kvol0 = p30.divide(p40).subtract(p50).rename(['kvol0']);

	return [kvol, kvol0];
}


function line_from_coords(coordinates, fromIndex, toIndex){
  return ee.Geometry.LineString(ee.List([
    coordinates.get(fromIndex),
    coordinates.get(toIndex)]));
}

function where(condition, trueValue, falseValue){
  var trueMasked = trueValue.mask(condition);
  var falseMasked = falseValue.mask(invert_mask(condition));
      return trueMasked.unmask(falseMasked);
}

function invert_mask(mask){
  return mask.multiply(-1).add(1);
}

function value(list,index){
  return ee.Number(list.get(index));
}


/////Topographic correction////
//Source: https://doi.org/10.3390/rs11070831
function illumination_condition_landsat(img){

  // Extract image metadata about solar position
  var SZ_rad = ee.Image.constant(ee.Number(img.get('SOLAR_ZENITH_ANGLE'))).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000)); 
  var SA_rad = ee.Image.constant(ee.Number(img.get('SOLAR_AZIMUTH_ANGLE')).multiply(3.14159265359).divide(180)).clip(img.geometry().buffer(10000)); 
  // Creat terrain layers
  var slp = ee.Terrain.slope(dem).clip(img.geometry().buffer(10000));
  var slp_rad = ee.Terrain.slope(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
  var asp_rad = ee.Terrain.aspect(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
  
  // Calculate the Illumination Condition (IC)
  // slope part of the illumination condition
  var cosZ = SZ_rad.cos();
  var cosS = slp_rad.cos();
  var slope_illumination = cosS.expression("cosZ * cosS", 
                                          {'cosZ': cosZ,
                                           'cosS': cosS.select('slope')});
  // aspect part of the illumination condition
  var sinZ = SZ_rad.sin(); 
  var sinS = slp_rad.sin();
  var cosAziDiff = (SA_rad.subtract(asp_rad)).cos();
  var aspect_illumination = sinZ.expression("sinZ * sinS * cosAziDiff", 
                                           {'sinZ': sinZ,
                                            'sinS': sinS,
                                            'cosAziDiff': cosAziDiff});
  // full illumination condition (IC)
  var ic = slope_illumination.add(aspect_illumination);

  // Add IC to original image
  var img_plus_ic = ee.Image(img.addBands(ic.rename('IC')).addBands(cosZ.rename('cosZ')).addBands(cosS.rename('cosS')).addBands(slp.rename('slope')));
  return img_plus_ic;
}
  
function illumination_correction(img){
  var props = img.toDictionary();
  var st = img.get('system:time_start');
  
  var img_plus_ic = img;
  var mask1 = img_plus_ic.select('nir').gt(-0.1);
  var mask2 = img_plus_ic.select('slope').gte(5)
                          .and(img_plus_ic.select('IC').gte(0))
                          .and(img_plus_ic.select('nir').gt(-0.1));
  var img_plus_ic_mask2 = ee.Image(img_plus_ic.updateMask(mask2));
  
  // Specify Bands to topographically correct  
  var bandList = ['blue','green','red','nir','swir1','swir2']; 
  var compositeBands = img.bandNames();
  var nonCorrectBands = img.select(compositeBands.removeAll(bandList));
  
  var geom = ee.Geometry(img.get('system:footprint')).bounds().buffer(10000);
  
  function apply_SCSccorr(band){
    var method = 'SCSc';
    var out = img_plus_ic_mask2.select('IC', band).reduceRegion({
    reducer: ee.Reducer.linearFit(), // Compute coefficients: a(slope), b(offset), c(b/a)
    geometry: ee.Geometry(img.geometry().buffer(-100)), // trim off the outer edges of the image for linear relationship 
    scale: 30,
    maxPixels: 1000000000
    });  
   if (out === null || out === undefined ){
     return img_plus_ic_mask2.select(band);
   } else {
    var out_a = ee.Number(out.get('scale'));
    var out_b = ee.Number(out.get('offset'));
    var out_c = out_b.divide(out_a);
    // Apply the SCSc correction
    var SCSc_output = img_plus_ic_mask2.expression(
      "((image * (cosB * cosZ + cvalue)) / (ic + cvalue))", {
      'image': img_plus_ic_mask2.select(band),
      'ic': img_plus_ic_mask2.select('IC'),
      'cosB': img_plus_ic_mask2.select('cosS'),
      'cosZ': img_plus_ic_mask2.select('cosZ'),
      'cvalue': out_c
    });
    
    return SCSc_output;
     
   }
      
  }
    
  var img_SCSccorr = ee.Image(bandList.map(apply_SCSccorr)).addBands(img_plus_ic.select('IC'));
  var bandList_IC = ee.List([bandList, 'IC']).flatten();
  img_SCSccorr = img_SCSccorr.unmask(img_plus_ic.select(bandList_IC)).select(bandList);
    
  return img_SCSccorr.addBands(nonCorrectBands)
    .setMulti(props)
    .set('system:time_start',st);
}
  
function illumination_condition_sentinel(img){

  // Extract image metadata about solar position
  var SZ_rad = ee.Image.constant(ee.Number(img.get('MEAN_SOLAR_ZENITH_ANGLE'))).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000)); 
  var SA_rad = ee.Image.constant(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')).multiply(3.14159265359).divide(180)).clip(img.geometry().buffer(10000)); 
  // Creat terrain layers
  var slp = ee.Terrain.slope(dem).clip(img.geometry().buffer(10000));
  var slp_rad = ee.Terrain.slope(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
  var asp_rad = ee.Terrain.aspect(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
  
  // Calculate the Illumination Condition (IC)
  // slope part of the illumination condition
  var cosZ = SZ_rad.cos();
  var cosS = slp_rad.cos();
  var slope_illumination = cosS.expression("cosZ * cosS", 
                                          {'cosZ': cosZ,
                                           'cosS': cosS.select('slope')});
  // aspect part of the illumination condition
  var sinZ = SZ_rad.sin(); 
  var sinS = slp_rad.sin();
  var cosAziDiff = (SA_rad.subtract(asp_rad)).cos();
  var aspect_illumination = sinZ.expression("sinZ * sinS * cosAziDiff", 
                                           {'sinZ': sinZ,
                                            'sinS': sinS,
                                            'cosAziDiff': cosAziDiff});
  // full illumination condition (IC)
  var ic = slope_illumination.add(aspect_illumination);

  // Add IC to original image
  var img_plus_ic = ee.Image(img.addBands(ic.rename('IC')).addBands(cosZ.rename('cosZ')).addBands(cosS.rename('cosS')).addBands(slp.rename('slope')));
  return img_plus_ic;
}


// Scales Landsat Collection 2 SR to [0, 1] reflectance
function rescale_landsat_c2(image) {
    var optical = image.select(['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])
                       .multiply(0.0000275).add(-0.2);
    return image.addBands(optical, null, true);
}

// Scales Sentinel-2 SR to [0, 1] reflectance
function rescale_sentinel2(image) {
    var optical = image.select(['blue', 'green', 'red', 're1', 're2', 're3', 'nir', 're4', 'swir1', 'swir2'])
                       .multiply(0.0001);
    return image.addBands(optical, null, true);
}

// Harmonizes Landsat 7 (ETM+) to Landsat 8 (OLI)
function band_adjustment_landsat7(landsat_image) {
    var interceptsL8 = [-0.0107, 0.0026, -0.0015, 0.0033, 0.0065, 0.0046];
    var slopesL8 = [1.0946, 1.0043, 1.0524, 0.8954, 1.0049, 1.0002];
  
    var img_adjusted = ee.Image(landsat_image.select(['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])
                            .multiply(slopesL8)
                            .add(interceptsL8).float());
    return landsat_image.addBands(img_adjusted, null, true);
}

// Harmonizes Sentinel-2 to Landsat 8 (OLI)
function band_adjustment_sentinel2(s2_image) {
    // Coefficients from Chastain et al. (2019) / HLS
    var interceptsL8 = [-0.004, -0.0009, 0.0009, -0.0003, -0.0004, -0.0019];
    var slopesL8 = [0.977, 1.005, 0.977, 1.000, 0.996, 0.976];
    
    var img_adjusted = ee.Image(s2_image.select(['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])
                            .multiply(slopesL8)
                            .add(interceptsL8).float());
    return s2_image.addBands(img_adjusted, null, true);
}
  
  exports.band_adjustment_landsat7 = band_adjustment_landsat7;
exports.band_adjustment_sentinel2 = band_adjustment_sentinel2;
exports.rescale_landsat_c2 = rescale_landsat_c2;
exports.rescale_sentinel2 = rescale_sentinel2;
function reproject_sen2ls(sentinel_image, landsat_image) {
  var sentinel_30m = sentinel_image.resample('bicubic').reproject({
  crs: landsat_image.select('red').projection().crs(),
  scale: 30
  }).set('system:time_start', sentinel_image.date());
  return(sentinel_30m);
}

function co_registration_landsat(landsat_image, sentinel_image) {

    // Choose to register using only the 'Red' band.
    var landsat_red = landsat_image.select('red');
    var sentinel_red = sentinel_image.select('red');
    
    // Determine the displacement by matching only the 'Red' bands.
    var displacement = landsat_red.displacement({
      referenceImage: sentinel_red,
      maxOffset: 50.0,//The maximum offset allowed when attempting to align the input images, in meters
      patchWidth: 100.0 // Small enough to capture texture and large enough that ignorable 
      //objects are small within the patch. Automatically ditermined if not provided 
    });
  
  
    //wrap the imgL8SR image
    var landsat_image_aligned = landsat_image.displace(displacement);
    return(landsat_image_aligned);
  }
  
  exports.co_registration_landsat = co_registration_landsat;

/*
  build_hls_composite:
  Generates a harmonized median composite of Landsat 7, Landsat 8 and Sentinel-2 images.
  
  Params:
  (ee.Geometry) roi - Region of interest
  (ee.Date | string) start_date - Start date
  (ee.Date | string) end_date - End date
  
  Returns:
  (ee.Image) Median composite of the harmonized images containing the 'ndvi' band.
*/

// kNDVI (Kernelized NDVI) - Camps-Valls et al., 2021
var kndvi = function(image, nir_band, red_band) {
  var ndvi = image.normalizedDifference([nir_band, red_band]);
  var kndvi_img = ee.Image(ndvi.pow(2).tanh()).rename('kNDVI');
  return image.addBands(kndvi_img);
};

// FVC (Fractional Vegetation Cover) - Jimenez-Munoz et al., 2009
var fvc = function(image, ndvi_band, ndvi_soil, ndvi_veg) {
  var n_soil = ndvi_soil || 0.15;
  var n_veg = ndvi_veg || 0.90;
  var fvc_img = image.expression(
    '((NDVI - NDVI_s) / (NDVI_v - NDVI_s)) ** 2', {
      'NDVI': image.select(ndvi_band),
      'NDVI_s': n_soil,
      'NDVI_v': n_veg
  });
  // Clamp between 0 and 1
  fvc_img = fvc_img.where(fvc_img.lt(0), 0).where(fvc_img.gt(1), 1).rename('FVC');
  return image.addBands(fvc_img);
};

// Linear Spectral Unmixing Wrapper
var unmix = function(image, bands, endmembers, names, sumToOne, nonNegative) {
  var s1 = sumToOne !== undefined ? sumToOne : false;
  var nn = nonNegative !== undefined ? nonNegative : true;
  var unmixed = image.select(bands).unmix(endmembers, s1, nn).rename(names);
  return image.addBands(unmixed);
};

// Spectral-Temporal-Metrics (STM) Reducer
var stm_features = function(collection, reducers) {
  var default_reducers = ee.Reducer.percentile([10, 50, 90])
                           .combine(ee.Reducer.stdDev(), '', true)
                           .combine(ee.Reducer.minMax(), '', true);
  var r = reducers || default_reducers;
  var stm = collection.reduce(r);
  return stm;
};

// Day of Year (DOY) Time Band
var add_doy = function(image) {
  var doy = image.date().getRelative('day', 'year');
  var doy_band = ee.Image(doy).uint16().rename('DOY');
  doy_band = doy_band.updateMask(image.select(0).mask());
  return image.addBands(doy_band);
};

// Milliseconds Time Band
var add_millis = function(image) {
  var millis = ee.Image(image.date().millis()).toInt64().rename('MILLIS');
  millis = millis.updateMask(image.select(0).mask());
  return image.addBands(millis);
};

var build_hls_composite = function(roi, start_date, end_date, band) {
    if (roi === undefined) error('build_hls_composite', 'You need to specify a region of interest (roi).');
    if (start_date === undefined) error('build_hls_composite', 'You need to specify a start_date.');
    if (end_date === undefined) error('build_hls_composite', 'You need to specify an end_date.');

    var names_band_in_landsat7 = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7', 'QA_PIXEL'];
    var names_band_out_landsat7 = ['blue','green','red','nir', 'swir1', 'swir2', 'qa_band'];
    var names_band_in_landsat8 = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'QA_PIXEL'];
    var names_band_out_landsat8 = ['blue','green','red','nir', 'swir1', 'swir2', 'qa_band'];
    var names_band_in_sentinel = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12', 'SCL'];
    var names_band_out_sentinel = ['blue','green','red','re1','re2','re3','nir','re4', 'swir1', 'swir2', 'qa_band'];

    var clip_collection = function(image) { return image.clip(roi); };

    var filter_bands = function(image) {
        if (band === 'NDVI' || band === 'ndvi') {
            var ndvi = image.normalizedDifference(['nir', 'red']).rename('ndvi');
            return image.addBands(ndvi).select('ndvi');
        } else if (band === undefined || band === null || band === 'ALL' || band === 'all') {
            // Drop qa_band to avoid compositing flags
            var bands_to_keep = image.bandNames().remove('qa_band');
            return image.select(bands_to_keep);
        } else {
            return image.select(band);
        }
    };

    var ls7_c = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
        .filterBounds(roi)
        .filterDate(start_date, end_date)
        .select(names_band_in_landsat7, names_band_out_landsat7)
        .map(function (img) { return cs_mask_landsat(img, img.select('qa_band')); })
        .map(rescale_landsat_c2)
        .map(apply_brdf_landsat)
        .map(band_adjustment_landsat7); // SBA only for L7!

    var ls8_c = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
        .filterBounds(roi)
        .filterDate(start_date, end_date)
        .select(names_band_in_landsat8, names_band_out_landsat8)
        .map(function (img) { return cs_mask_landsat(img, img.select('qa_band')); })
        .map(rescale_landsat_c2)
        .map(apply_brdf_landsat); // L8 is the anchor, no SBA!

    var ls9_c = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
        .filterBounds(roi)
        .filterDate(start_date, end_date)
        .select(names_band_in_landsat8, names_band_out_landsat8)
        .map(function (img) { return cs_mask_landsat(img, img.select('qa_band')); })
        .map(rescale_landsat_c2)
        .map(apply_brdf_landsat); // L9 acts identical to L8, no SBA!

    var s2_c = ee.ImageCollection('COPERNICUS/S2_SR')
        .filterBounds(roi)
        .filterDate(start_date, end_date)
        .map(edgesmask_sr_sentinel)
        .select(names_band_in_sentinel, names_band_out_sentinel);

    var s2_cloud_c = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
        .filterBounds(roi)
        .filterDate(start_date, end_date);

    var s2_and_s2_cloud_c = ee.Join.saveFirst('cloud_mask').apply({
        primary: s2_c,
        secondary: s2_cloud_c,
        condition: ee.Filter.equals({leftField: 'system:index', rightField: 'system:index'})
    });

    var s2_cloud_masked_c = ee.ImageCollection(s2_and_s2_cloud_c).map(cloudmask_sr_sentinel);
    var s2_cs_masked_c = simple_TDOM2(s2_cloud_masked_c);
    var s2_cs_brdf_c = s2_cs_masked_c
        .map(rescale_sentinel2)
        .map(apply_brdf_sentinel)
        .map(band_adjustment_sentinel2); // SBA for S2 -> L8!

    var s2_final_c = s2_cs_brdf_c.map(filter_bands);
    var ls9_final_c = ls9_c.map(filter_bands);
    var ls8_final_c = ls8_c.map(filter_bands);
    var ls7_final_c = ls7_c.map(filter_bands);

    // Sentinel 2 Reprojection to Landsat scale/CRS
    var s2_reproj_c = ee.Algorithms.If(
        ls8_c.size().gt(0),
        s2_final_c.map(function (image) { return reproject_sen2ls(image, ee.Image(ls8_c.first())); }),
        s2_final_c.map(function (image) { 
            return image.resample('bicubic').reproject({ crs: 'EPSG:4326', scale: 30 }).set('system:time_start', image.date()); 
        })
    );
    s2_reproj_c = ee.ImageCollection(s2_reproj_c);

    var merged = s2_reproj_c.map(clip_collection)
                 .merge(ls9_final_c.map(clip_collection))
                 .merge(ls8_final_c.map(clip_collection))
                 .merge(ls7_final_c.map(clip_collection));

    var median_composite = merged.median();
    return median_composite;
};
var remove_outliers = function(collection, window_days, std_multi, bands) {
  var window_milli = window_days * 24 * 60 * 60 * 1000;
  
  var maxDiffFilter = ee.Filter.maxDifference({
    difference: window_milli,
    leftField: 'system:time_start',
    rightField: 'system:time_start'
  });
  
  var saveAllJoin = ee.Join.saveAll({
    matchesKey: 'window',
    ordering: 'system:time_start',
    ascending: true
  });
  
  var joined = saveAllJoin.apply(collection, collection, maxDiffFilter);
  
  var filterOutliers = function(img) {
    img = ee.Image(img);
    var windowCol = ee.ImageCollection.fromImages(img.get('window'));
    if (bands) {
      windowCol = windowCol.select(bands);
    }
    
    var mean = windowCol.reduce(ee.Reducer.mean());
    var std = windowCol.reduce(ee.Reducer.stdDev());
    
    var upper = mean.add(std.multiply(std_multi));
    var lower = mean.subtract(std.multiply(std_multi));
    
    var mask = img.gte(lower).and(img.lte(upper));
    
    return img.updateMask(mask).copyProperties(img, ['system:time_start', 'system:index']);
  };
  
  return ee.ImageCollection(joined).map(filterOutliers);
};

var tsi_rbf = function(collection, window_days, sigma) {
  var window_milli = window_days * 24 * 60 * 60 * 1000;
  
  var maxDiffFilter = ee.Filter.maxDifference({
    difference: window_milli,
    leftField: 'system:time_start',
    rightField: 'system:time_start'
  });
  
  var saveAllJoin = ee.Join.saveAll({
    matchesKey: 'window',
    measureKey: 'delta_milli',
    ordering: 'system:time_start',
    ascending: true
  });
  
  var joined = ee.ImageCollection(saveAllJoin.apply(collection, collection, maxDiffFilter));
  
  var rbfInterpolate = function(img) {
    img = ee.Image(img);
    var windowCol = ee.ImageCollection.fromImages(img.get('window'));
    var bandNames = img.bandNames();
    
    var applyWeight = function(windowImg) {
      windowImg = ee.Image(windowImg);
      var delta = ee.Number(windowImg.get('delta_milli'));
      
      var rbf_weight = ee.Image().expression(
        'exp(-0.5 * pow(((delta / 86400000) / sigma), 2))', {
          'delta': delta,
          'sigma': sigma
        }
      );
      
      rbf_weight = rbf_weight.updateMask(windowImg.select(0).mask());
      var weighted = windowImg.multiply(rbf_weight);
      return weighted.addBands(rbf_weight.rename('rbf_weight'));
    };
    
    var weightedCol = windowCol.map(applyWeight);
    
    var sumWeighted = weightedCol.select(bandNames).reduce(ee.Reducer.sum());
    var sumWeights = weightedCol.select(['rbf_weight']).reduce(ee.Reducer.sum());
    
    var result = sumWeighted.divide(sumWeights).rename(bandNames);
    
    // Gap fill existing image
    var filled = img.unmask(result);
    return filled.copyProperties(img, ['system:time_start', 'system:index']);
  };
  
  return joined.map(rbfInterpolate);
};

var phenology_metrics = function(collection, band) {
  var addPolarBands = function(img) {
    var doy = img.date().getRelative('day', 'year');
    var doy_rad = ee.Image(doy).divide(365).multiply(2 * Math.PI);
    var val = img.select(band);
    
    var ts_x = val.multiply(doy_rad.cos()).rename('POL_X');
    var ts_y = val.multiply(doy_rad.sin()).rename('POL_Y');
    
    return img.addBands([ts_x, ts_y]);
  };
  
  var polarCol = collection.map(addPolarBands);
  
  var meanX = polarCol.select('POL_X').mean();
  var meanY = polarCol.select('POL_Y').mean();
  
  var theta = meanX.atan2(meanY); 
  
  theta = theta.where(theta.lte(0), theta.add(2 * Math.PI));
  
  var sos_doy = theta.multiply(365).divide(2 * Math.PI).int16().rename('SOS_DOY');
  
  var pos_rad = theta.add(Math.PI);
  pos_rad = pos_rad.where(pos_rad.gte(2 * Math.PI), pos_rad.subtract(2 * Math.PI));
  var pos_doy = pos_rad.multiply(365).divide(2 * Math.PI).int16().rename('POS_DOY');
  
  var magnitude = meanX.multiply(meanX).add(meanY.multiply(meanY)).sqrt().rename('MAGNITUDE');
  
  return ee.Image([sos_doy, pos_doy, magnitude]);
};

var s1_lee_filter = function(image, kernel_size) {
  image = ee.Image(image);
  var bandNames = image.bandNames().remove('angle');
  var angle = image.select('angle');
  
  // Convert dB to linear and preserve band names
  var linear = ee.Image(10.0).pow(image.select(bandNames).divide(10.0)).rename(bandNames);
  
  var result = bandNames.map(function(b) {
    var img_b = linear.select([ee.String(b)]);
    var mean3 = img_b.reduceNeighborhood(ee.Reducer.mean(), ee.Kernel.square(kernel_size, 'pixels'));
    var var3 = img_b.reduceNeighborhood(ee.Reducer.variance(), ee.Kernel.square(kernel_size, 'pixels'));
    var ENL = 5.0; // Equivalent Number of Looks
    var ci = var3.divide(mean3.pow(2));
    var cu = 1.0 / ENL;
    var w = ee.Image().expression('max(0, 1 - (cu / ci))', {cu: cu, ci: ci});
    var filtered = mean3.add(w.multiply(img_b.subtract(mean3)));
    return filtered.rename([ee.String(b)]);
  });
  
  var filteredLinear = ee.ImageCollection(result).toBands().rename(bandNames);
  // Convert back to dB (linear.log10() * 10 preserves names)
  var filteredDb = filteredLinear.log10().multiply(10.0);
  
  return ee.Image(filteredDb.addBands(angle).copyProperties(image, image.propertyNames()));
};

var s1_terrain_flattening = function(image) {
  image = ee.Image(image);
  var angle = image.select('angle');
  var theta_iRad = angle.multiply(Math.PI / 180.0);
  var dem = ee.ImageCollection('COPERNICUS/DEM/GLO30').select('DEM').mosaic();
  var terrain = ee.Algorithms.Terrain(dem);
  var slope = terrain.select('slope').multiply(Math.PI / 180.0);
  var aspect = terrain.select('aspect').multiply(Math.PI / 180.0);
  var pass = ee.String(image.get('orbitProperties_pass'));
  var heading = ee.Number(ee.Algorithms.If(pass.equals('ASCENDING'), 347.95, 192.05)).multiply(Math.PI / 180.0);
  
  var alpha_r = ee.Image().expression(
    'acos(cos(slope) * cos(theta_i) + sin(slope) * sin(theta_i) * cos(aspect - heading))',
    {
      'slope': slope,
      'theta_i': theta_iRad,
      'aspect': aspect,
      'heading': heading
    }
  );
  
  var mask = alpha_r.gt(0).and(alpha_r.lt(Math.PI / 2));
  var gamma0_factor = ee.Image().expression(
    'tan(alpha_r) / tan(theta_i)',
    {
      'alpha_r': alpha_r,
      'theta_i': theta_iRad
    }
  );
  
  var bandNames = image.bandNames().remove('angle');
  var linear = ee.Image(10.0).pow(image.select(bandNames).divide(10.0)).rename(bandNames);
  var corrected = linear.multiply(gamma0_factor);
  var correctedDb = corrected.log10().multiply(10.0).updateMask(mask);
  
  return ee.Image(correctedDb.addBands(angle).copyProperties(image, image.propertyNames()));
};

var s1_flood_mapping = function(image_before, image_after, threshold, smoothing_radius, band) {
  image_before = ee.Image(image_before);
  image_after = ee.Image(image_after);
  var diff = image_after.select(band).subtract(image_before.select(band));
  var smoothed = diff.focal_mean(smoothing_radius, 'circle', 'meters');
  var flood = smoothed.lt(threshold); 
  
  // Mask out permanent water using JRC occurrence > 80%
  var jrc = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select('occurrence');
  var permanentWater = jrc.gte(80).unmask(0);
  
  // selfMask() ensures 0s (non-flooded areas) become transparent
  var flooded_only = flood.selfMask().updateMask(permanentWater.not());
  
  var time_start = image_after.get('system:time_start');
  time_start = ee.Algorithms.If(time_start, time_start, ee.Date(Date.now()).millis());
  return ee.Image(flooded_only.rename('flood_mask').set('system:time_start', time_start));
};

/* ------------------------  EXPORTS  ------------------------ */

// Machine Learning & Classification
exports.svm = svm;
exports.cart = cart;
exports.rf = rf;
exports.naive_bayes = naive_bayes;
exports.max_ent = max_ent;
exports.kmeans = kmeans;
exports.unmix = unmix;

// Spectral Indices & Transformations
exports.landsat_indices = landsat_indices;
exports.sentinel2_indices = sentinel2_indices;
exports.water_indices = water_indices;
exports.tasseled_cap = tasseled_cap;
exports.pca = pca;
exports.ndviS2 = ndvi_s2;
exports.kndvi = kndvi;
exports.fvc = fvc;

// Change Detection
exports.imad = imad;
exports.radcal = radcal;
exports.radcalbatch = radcalbatch;
exports.burn_severity = burn_severity;
exports.anomaly = anomaly;
exports.ndvi_change_detection = ndvi_change_detection;
exports.ndwi_change_detection = ndwi_change_detection;
exports.ndbi_change_detection = ndbi_change_detection;

// Time Series & Mosaics
exports.harmonic_trend = harmonic_trend;
exports.create_mosaic = create_mosaic;
exports.smooth_timeseries = smooth_timeseries;
exports.build_annual_landsat_timeseries = build_annual_landsat_timeseries;
exports.build_annual_mss_timeseries = build_annual_mss_timeseries;
exports.landsat_timeseries = landsat_timeseries;
exports.landsat_timeseries_by_pathrow = landsat_timeseries_by_pathrow;
exports.landsat_timeseries_by_roi = landsat_timeseries_by_roi;
exports.stm_features = stm_features;
exports.add_doy = add_doy;
exports.add_millis = add_millis;
exports.remove_outliers = remove_outliers;
exports.tsi_rbf = tsi_rbf;
exports.phenology_metrics = phenology_metrics;

// Radar
exports.s1_preprocess = s1_preprocess;
exports.speckle_filter = speckle_filter;
exports.s1_lee_filter = s1_lee_filter;
exports.s1_terrain_flattening = s1_terrain_flattening;
exports.s1_flood_mapping = s1_flood_mapping;

// Topography
exports.terrain_analysis = terrain_analysis;
exports.topographic_correction = topographic_correction;
exports.calculate_twi = calculate_twi;
exports.calculate_tpi_tri = calculate_tpi_tri;
exports.extract_drainage = extract_drainage;

// Pre-Processing & Calibration
exports.harmonize_sensors = harmonize_sensors;
exports.toa_radiance = toa_radiance;
exports.toa_reflectance = toa_reflectance;
exports.brightness_temp = brightness_temp;
exports.surface_emissivity = surface_emissivity;
exports.surface_temperature_tm = surface_temperature_tm;
exports.surface_temperature_oli = surface_temperature_oli;
exports.calculate_lst = calculate_lst;
exports.cloudmask = cloudmask;
exports.cloudmask_sr = cloudmask_sr;
exports.fmask = fmask;
exports.resample = resample;
exports.resample_band = resample_band;
exports.geom_filter = geom_filter;

// Statistics & Math
exports.zonal_statistics = zonal_statistics;
exports.reduce_image = reduce_image;
exports.spearmans_correlation = spearmans_correlation;
exports.linear_fit = linear_fit;
exports.texture = texture;
exports.majority = majority;
exports.prop_veg = prop_veg;

// Visualization, Utilities & Export
exports.plot = plot;
exports.color = color;
exports.export_image = export_image;
exports.load_image = load_image;
exports.load_id_s2 = load_id_s2;
exports.collection2image = collection2image;

// Object-Based Image Analysis (GEOBIA)
exports.segmentation_snic = segmentation_snic;
exports.obia_classification = obia_classification;
exports.filter_small_objects = filter_small_objects;

// Exports for HLS Harmonization
exports.build_hls_composite = build_hls_composite;
exports.apply_brdf_landsat = apply_brdf_landsat;
exports.apply_brdf_sentinel = apply_brdf_sentinel;
exports.illumination_condition_landsat = illumination_condition_landsat;
exports.illumination_condition_sentinel = illumination_condition_sentinel;
exports.illumination_correction = illumination_correction;
exports.band_adjustment_landsat7 = band_adjustment_landsat7;
exports.band_adjustment_sentinel2 = band_adjustment_sentinel2;
exports.rescale_landsat_c2 = rescale_landsat_c2;
exports.rescale_sentinel2 = rescale_sentinel2;
exports.co_registration_landsat = co_registration_landsat;
exports.reproject_sen2ls = reproject_sen2ls;
exports.cs_mask_landsat = cs_mask_landsat;
exports.cloudmask_sr_sentinel = cloudmask_sr_sentinel;
exports.edgesmask_sr_sentinel = edgesmask_sr_sentinel;
exports.simple_TDOM2 = simple_TDOM2;

