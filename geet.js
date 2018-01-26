/* 
  Name      : geet.js
  Author    : Eduardo R. Lacerda
  e-mail    : eduardolacerdageo@gmail.com
  Version   : 0.1.0 (Beta)
  Date      : 20-01-2018
  Description: Lib to write small EE apps or big/complex apps with a lot less code.
*/

/*
  svm:
  Function to apply SVM classification to a image.

  Params:
  (ee.Image) image - The input image to classify.
  (ee.List) trainingData - Training data (samples). 
  (string) fieldName - The name of the column that contains the class names.
  (string) kernelType - the kernel type of the classifier.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Functions/GEET');
  var imgClass = geet.svm(image, samplesfc, landcover);
*/
exports.svm = function (image, trainingData, fieldName, kernelType) {
  var kernel = 'RBF';
  if (kernelType !== undefined) {
    kernel = kernelType;
  }

  var training = image.sampleRegions({
    collection: trainingData,
    properties: [fieldName],
    scale: 30
  });

  var classifier = ee.Classifier.svm({
    kernelType: kernel,
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

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.cart(image, samplesfc, landcover);
*/
exports.cart = function (image, trainingData, fieldName) {
  var training = image.sampleRegions({
    collection: trainingData,
    properties: [fieldName],
    scale: 30
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
  (ee.Number) numOfTrees - the number of trees that the model will create.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.rf(image, samplesfc, landcover, 10);
*/
exports.rf = function (image, trainingData, fieldName, _numOfTrees) {
  var numOfTrees = 10;
  if (_numOfTrees !== undefined) {
    numOfTrees = _numOfTrees;
  }

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
  kmeans:
  Function to apply RandomForest classification to an image.

  Params:
  (ee.Image) image - The input image to classify.
  (list) roi - Coordenates or just a polygon of the sample area.
  optional (number) _numClusters - the number of clusters that will be used. Default is 15.
  optional (number) _scale - the scale number. The scale is related to the spatial resolution of the image. Landsat is 30, sou the default is 30 also.
  optional (number) _numPixels - the number of pixels that the classifier will take samples from the roi.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.kmeans(image, roi);

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.kmeans(image, roi, 20, 10, 6000);
*/
exports.kmeans = function (image, roi, _numClusters, _scale, _numPixels) {
  if (roi === undefined) {
    print("Error: You need to define and pass a roi as argument to collect the samples for the classfication process.")
  }

  if (_numClusters === undefined) {
    var numClusters = 15;
  } else {
    numClusters = _numClusters;
  }

  if (_scale === undefined) {
    var scale = 30;
  } else {
    scale = _scale;
  }

  if (_numPixels === undefined) {
    var numPixels = 5000;
  } else {
    numPixels = _numPixels;
  }

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
  simpleNDVIChangeDetection:
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
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var ndviChange = geet.simpleNDVIChangeDetection(image_2014, image_2015, 'L8', 0.5);
*/
exports.simpleNDVIChangeDetection = function (img1, img2, sensor, threshold) {
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
  simpleNDWIChangeDetection:
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
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var ndwiChange = geet.simpleNDWIChangeDetection( image_2014, image_2015, 'L8', 0.5);
*/
exports.simpleNDWIChangeDetection = function (img1, img2, sensor, threshold) {
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
  simpleNDBIChangeDetection:
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
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var ndbiChange = geet.simpleNDBIChangeDetection(image_2014, image_2015, 'L8', 0.5);
*/
exports.simpleNDBIChangeDetection = function (img1, img2, sensor, threshold) {
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

// TODO
exports.filterDateRange = function (imgCol, start, finish, field) {
  var imgCol_filtered = imgCol.filter(ee.Filter.calendarRange(start, finish, field));
  return imgCol_filtered;
};

/*
  Texture:
  Function generate a texture filter on the image.

  Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize more the result. 
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var texture = geet.texture(image_from_rio, 1);
*/
exports.texture = function (image, radius) {
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
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var majority = geet.majority(image_from_rio, 1);
*/
exports.majority = function (image, radius) {
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
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.color('water');
*/
exports.color = function (_color) {
  var color = _color.toLowerCase();
  switch (color) {
    case 'water':
      return COLOR.WATER;
    case 'forest':
      return COLOR.FOREST;
    case 'PASTURE':
      return COLOR.PASTURE;
    case 'URBAN':
      return COLOR.URBAN;
    case 'SHADOW':
      return COLOR.SHADOW;
    case 'NULL':
      return COLOR.NULL;
    default:
      return 'Error: Valid options are water, forest, pasture, urban, shadow or null! Remember to pass the argument as a string.';
  }
};

/*
  plotRGB:
  Function to plot a RGB image.

  Params:
  (ee.Image) image - the image to display.
  (string) title - the layer title.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.plotRGB(image, 'rgb_image');
*/
exports.plotRGB = function (image, _title) {
  if (_title === undefined) {
    var title = 'image_RGB';
  } else {
    title = _title;
  }

  var vizParams = {
    'bands': 'B4,B3,B2',
    'min': 5000,
    'max': 30000,
    'gamma': 1.6
  };

  Map.addLayer(image, vizParams, title);
};

/*
  plotNDVI:
  Function to plot a NDVI image index.

  Params:
  (ee.Image) image - the image to display.
  (string) title - the layer title.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.plotNDVI(ndvi, 'ndvi_image');
*/
exports.plotNDVI = function (image, title) {
  Map.addLayer(image, { min: -1, max: 1, palette: ['FF0000', '00FF00'] }, title);
};

/*
  plotNDWI:
  Function to plot a NDWI image index.

  Params:
  (ee.Image) image - the image to display.
  (string) title - the layer title.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.plotNDWI(ndwi, 'ndwi_image');
*/
exports.plotNDWI = function (image, title) {
  Map.addLayer(image, { min: -1, max: 1, palette: ['00FFFF', '0000FF'] }, title);
};

/*
  plotClass:
  Function to plot the final classification map.
  
  Params:
  (ee.Image) image - the image to process
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.
  (string) title - the layer title. 
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.plotClass(classified, 4, 'class_final');
*/
exports.plotClass = function (image, numClasses, _title) {
  var title = 'class_final';
  if (_title !== undefined) {
    title = _title;
  }

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
  spectralIndices:
  Function to take an input image and generate indexes like:
  NDVI, NDWI, NDBI...
  
  More indices and features will be added in the future!

  Supported indices:
  NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI

  Params:
  (ee.Image) image - the image to process.
  (string) sensor - the sensor that you are working on Landsat 5 ('L5') or 8 ('L8').
  (string or string array) index (optional) - you can specify the index that you want
                    if you dont specify any index the function will create all possible indices.
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/indexGen');
  var result = geet.spectralIndices(image, 'L5'); // Will create all possible indices.

  or specifying the index to generate:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var result = geet.spectralIndices(image, 'L5', 'savi'); // This will create only SAVI.
*/
exports.spectralIndices = function (image, sensor, index) {
  if (index != null) {
    switch (index) {
      case 'NDVI':
        if (sensor == 'L5') {
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
      case 'NDWI':
        if (sensor == 'L5') {
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
      case 'NDBI':
        if (sensor == 'L5') {
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
      case 'NRVI':
        if (sensor == 'L5') {
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
      case 'EVI':
        if (sensor == 'L5') {
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
      case 'SAVI':
        if (sensor == 'L5') {
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
      case 'GOSAVI':
        if (sensor == 'L5') {
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
    if (sensor == 'L5') {
      var i_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
      var i_ndwi = image.normalizedDifference(['B2', 'B5']).rename('NDWI');
      var i_ndbi = image.normalizedDifference(['B5', 'B4']).rename('NDBI');
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
  loadImg:
  Function to get an example image to debug or test some code. 

  Params:
  (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.
  (number) year - the year of the image that you want to get.
  optional (list) roi - the latitude and longitude of a roi.
  optional (string) title - the title of the plotted image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Functions/GEET');
  var image = geet.loadImg(); // Returns a TOA image

  or 

  var geet = require('users/eduardolacerdageo/default:Functions/GEET');
  var image = geet.loadImg('SR', 2015); // Returns a SR image
*/
exports.loadImg = function (_collection, _year, _roi, _title) {
  // Setup
  var collection = 'TOA';
  var year = 2015;
  var roi = ee.Geometry.Point(-43.25, -22.90);
  var title = 'loadImg';
  var visParams = { bands: ['B4', 'B3', 'B2'], max: 0.3 };

  // Check year
  if (_year !== undefined) {
    year = _year;
  } else {
    print('Error: You need to specify the year parameter.')
  }

  // Check roi
  if (_roi !== undefined) {
    roi = _roi;
  }

  // Check title
  if (_title !== undefined) {
    title = _title;
  }

  // Check collection
  if (year >= 2013) {
    if (collection !== undefined) {
      collection = _collection;
      if (collection === 'RAW') {
        collection = 'LANDSAT/LC8_L1T';
        visParams = {
          bands: ['B4', 'B3', 'B2'], min: 6809, max: 12199
        };
      } else if (collection === 'TOA') {
        collection = 'LANDSAT/LC8_L1T_TOA';
      } else if (collection === 'SR') {
        collection = 'LANDSAT/LC8_SR';
        visParams = {
          bands: ['B4', 'B3', 'B2'], min: 104, max: 1632
        };
      } else {
        print("Error: Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
      }
    }
  } else if (year < 2013 && year >= 1985) {
    if (collection !== undefined) {
      collection = _collection;
      if (collection === 'RAW') {
        collection = 'LANDSAT/LT5_L1T';
        visParams = {
          bands: ['B4', 'B3', 'B2'], min: 6809, max: 12199
        };
      } else if (collection === 'TOA') {
        collection = 'LANDSAT/LT5_L1T_TOA_FMASK';
      } else if (collection === 'SR') {
        collection = 'LANDSAT/LT5_SR';
        visParams = {
          bands: ['B4', 'B3', 'B2'], min: 104, max: 1632
        };
      } else {
        print("Error: Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
      }
    }
  } else {
    print('Error: Wrong year parameter');
  }

  // Get Image
  var start = '-01-01';
  var finish = '-12-31';
  var l8 = ee.ImageCollection(collection);
  var image = ee.Image(l8
    .filterBounds(roi)
    .filterDate(year.toString() + start, year.toString() + finish)
    .sort('CLOUD_COVER')
    .first());

  var titleName = title + '_' + year.toString();
  Map.addLayer(image, visParams, titleName);
  print(image);
  return image;
};

/*
  toaRadiance:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var new_toa_radiance = geet.toaRadiance(img, 10); // ee.Image

  Information:
  Formula:     Lλ = MLQcal + AL
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)
  Qcal         = Quantized and calibrated standard product pixel values (DN)
*/
exports.toaRadiance = function (image, band) {
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
  toaReflectance:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var new_toa_reflectance = geet.toaReflectance(img, 10); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)
*/
exports.toaReflectance = function (image, band) {
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
  toaReflectanceL8:
  Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance
  Landsat 8 version with Solar Angle correction.

  Params:
  (ee.Image) image - The image to process.
  (number) band - The number of the band that you want to process.
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var new_toa_reflectance_sz = geet.toaReflectanceL8(img, 10, 'SZ'); // ee.Image

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var new_toa_reflectance_se = geet.toaReflectanceL8(img, 10, 'SE'); // ee.Image

  Information:
  Formula:      ρλ' = MρQcal + Aρ
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)
  Qcal          = Quantized and calibrated standard product pixel values (DN)

  SE = Local sun elevation angle. The scene center sun elevation angle in degrees is provided in the metadata (SUN_ELEVATION).
  SZ = Local solar zenith angle: SZ = 90° - SE
*/
exports.toaReflectanceL8 = function (image, band, _solarAngle) {
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
  brightnessTempL5_K:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 5 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var brightness_temp_img = geet.brightnessTempL5_K(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL5_K = function (image) {
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
brightnessTempL5_C:
Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
This one works only for Landsat 5 data.

Params:
(ee.Image) image - the Top of Atmosphere (TOA) image to convert.
 
Usage:
var geet = require('users/eduardolacerdageo/default:Function/GEET');
var brightness_temp_img = geet.brightnessTempL5_C(toa_image); // ee.Image

Information:
T           = Top of atmosphere brightness temperature (K)
Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL5_C = function (image) {
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
  brightnessTempL7_K:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 7 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var brightness_temp_img = geet.brightnessTempL7_K(toa_image); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL7_K = function (image) {
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
brightnessTempL7_C:
Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
This one works only for Landsat 7 data.

Params:
(ee.Image) image - the Top of Atmosphere (TOA) image to convert.
 
Usage:
var geet = require('users/eduardolacerdageo/default:Function/GEET');
var brightness_temp_img = geet.brightnessTempL7_C(toa_image); // ee.Image

Information:
T           = Top of atmosphere brightness temperature (K)
Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL7_C = function (image) {
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
  brightnessTempL8_K:
  Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
  This one works only for Landsat 8 data.

  Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.
  (boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var brightness_temp_img = geet.brightnessTempL8_K(toa_image); // ee.Image

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var brightness_temp_img = geet.brightnessTempL8_K(toa_image, false); // ee.Image

  Information:
  T           = Top of atmosphere brightness temperature (K)
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL8_K = function (image, _single) {
  var single = (arguments[1] !== void 1 ? false : true);
  // default is true - double band (B10 and B11) processing
  if (single === true) {
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
brightnessTempL8_C:
Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature.
This one works only for Landsat 8 data.

Params:
(ee.Image) image - the Top of Atmosphere (TOA) image to convert.
(boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!
 
Usage:
var geet = require('users/eduardolacerdageo/default:Function/GEET');
var brightness_temp_img = geet.brightnessTempL8_C(toa_image); // ee.Image

or 

var geet = require('users/eduardolacerdageo/default:Function/GEET');
var brightness_temp_img = geet.brightnessTempL8_C(toa_image, false); // ee.Image

Information:
T           = Top of atmosphere brightness temperature (K)
Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))
K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)
K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)
*/
exports.brightnessTempL8_C = function (image, _single) {
  var single = (arguments[1] !== void 1 ? false : true);
  // false - double band (B10 and B11) processing
  if (single === false) {
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
  (number) scaleNumber - the number of the spatial resolution that you
                        want to use to  resample the input image.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var landsat_10m = geet.resample(L8_img, 10); 
*/
exports.resample = function (image, scaleNumber) {
  // Get the projection information from a band.
  var band = image.select('B2');

  var resampled_image = image.resample('bilinear').reproject({
    crs: band.projection().crs(),
    scale: scaleNumber
  });

  return resampled_image;
}

/*
  resampleBand:
  Function to resample just a single band.

  Params:
  (ee.Image) band - the band to resample.
  (number) scaleNumber - the number of the spatial resolution that you
                        want to use to  resample the input band.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var landsatB10_60m = geet.resampleBand(b10, 60);
*/
exports.resampleBand = function (band, scaleNumber) {
  var resampled_band = band.resample('bilinear').reproject({
    crs: band.projection().crs(),
    scale: scaleNumber
  });
  return resampled_band;
}

/*
  loadS2ById:
  Function to filter the Sentinel-2 collection by Product ID obtained from the
  Copernicus Open Access Hub.

  Params:
  (string) id - the id of the Sentinel 2 image.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var s2_image = geet.loadS2ById('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');
*/
exports.loadS2ById = function (id) {
  var s2 = ee.ImageCollection("COPERNICUS/S2");
  var s2_filtered = s2.filterMetadata('PRODUCT_ID', 'equals', id);
  return s2_filtered;
}

/*
  s2Mosaic:
  Function to build a cloud free mosaic using the Sentinel 2 dataset.

  Params:
  (string) startDate - the start date of the dataset.
  (string) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31', roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31', roi, false); // Doesnt display the mosaic
*/
exports.s2Mosaic = function (startDate, endDate, roi, _showMosaic) {
  var s2 = ee.ImageCollection('COPERNICUS/S2');

  if (_showMosaic === undefined) {
    var showMosaic = true;
  } else {
    showMosaic = _showMosaic;
  }

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
  landsat5Mosaic:
  Function to build a cloud free mosaic using the Landsat 5 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l5_mosaic = geet.landsat5Mosaic('2005-01-01', '2005-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l5_mosaic = geet.landsat5Mosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l5_mosaic = geet.landsat5Mosaic('2005-01-01', '2005-12-31', roi, false); // Doesnt display the mosaic
*/
exports.landsat5Mosaic = function (startDate, endDate, roi, _showMosaic) {
  var l5 = ee.ImageCollection('LANDSAT/LT5_L1T_TOA');

  if (_showMosaic === undefined) {
    var showMosaic = true;
  } else {
    showMosaic = _showMosaic;
  }

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
  landsat7Mosaic:
  Function to build a cloud free mosaic using the Landsat 7 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l7_mosaic = geet.landsat7Mosaic('2003-01-01', '2003-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l7_mosaic = geet.landsat7Mosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l7_mosaic = geet.landsat7Mosaic('2003-01-01', '2003-12-31', roi, false); // Doesnt display the mosaic
*/
exports.landsat7Mosaic = function (startDate, endDate, roi, _showMosaic) {
  var l7 = ee.ImageCollection('LANDSAT/LE7_L1T_TOA');

  if (_showMosaic === undefined) {
    var showMosaic = true;
  } else {
    showMosaic = _showMosaic;
  }

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
  landsat8Mosaic:
  Function to build a cloud free mosaic using the Landsat 7 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l8_mosaic = geet.landsat8Mosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l8_mosaic = geet.landsat8Mosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l8_mosaic = geet.landsat8Mosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
*/
exports.landsat8Mosaic = function (startDate, endDate, roi, _showMosaic) {
  var l8 = ee.ImageCollection('LANDSAT/LC8_L1T_TOA');

  if (_showMosaic === undefined) {
    var showMosaic = true;
  } else {
    showMosaic = _showMosaic;
  }

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
  modisNdviMosaic:
  Function to build a cloud free NDVI mosaic using the MODIS/MOD13Q1 dataset.

  Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  optional (ee.Geometry) roi - the Region of Interest to filter the dataset.
  optional (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var modis_ndvi_mosaic = geet.modisNdviMosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic.

  or

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var modis_ndvi_mosaic = geet.modisNdviMosaic(start, finish, roi); // Display the final mosaic of the roi

  or 

  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var modis_ndvi_mosaic = geet.modisNdviMosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
*/
exports.modisNdviMosaic = function (startDate, endDate, roi, _showMosaic) {
  if (_showMosaic === undefined) {
    var showMosaic = true;
  } else {
    showMosaic = _showMosaic;
  }

  var modis = ee.ImageCollection('MODIS/MOD13Q1')
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
  Function the get the maximum value from an image.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var img_max = geet.max(img);
*/
exports.max = function (image) {
  var maxValue = image.reduce(ee.Reducer.max());
  return maxValue;
}


/*
  min:
  Function the get the minimum value from an image.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var img_min = geet.min(img);
*/
exports.min = function (image) {
  var minValue = image.reduce(ee.Reducer.min());
  return minValue;
}


/*
  ndviL5:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 5 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l5_ndvi = geet.ndviL5(img);
*/
exports.ndviL5 = function (image) {
  var l5_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
  var image_with_ndvi = image.addBands(l5_ndvi);
  return image_with_ndvi;
}


/*
  ndviL7:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 7 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l7_ndvi = geet.ndviL7(img);
*/
exports.ndviL7 = function (image) {
  var l7_ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
  var image_with_ndvi = image.addBands(l7_ndvi);
  return image_with_ndvi;
}


/*
  ndviL8:
  Function calculate the normalized difference vegetation index (NDVI) from Landsat 8 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var l8_ndvi = geet.ndviL8(img);
*/
exports.ndviL8 = function (image) {
  var l8_ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  var image_with_ndvi = image.addBands(l8_ndvi);
  return image_with_ndvi;
}


/*
  ndviS2:
  Function calculate the normalized difference vegetation index (NDVI) from Sentinel 2 data.

  Params:
  (ee.Image) image - the input image.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var s2_ndvi = geet.ndviS2(img);
*/
exports.ndviS2 = function (image) {
  var s2_ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var image_with_ndvi = image.addBands(s2_ndvi);
  return image_with_ndvi;
}


/*
  propVeg:
  Function calculate the proportional vegetation.

  Params:
  (ee.Image) image - input image with the NDVI band.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var img_pv = geet.propVeg(img);
*/
exports.propVeg = function (image) {
  // var ndvi_max = ndvi_img.reduce(ee.Reducer.max());
  // var ndvi_min = ee.Number(ndvi_img.reduce(ee.Reducer.min()));
  var ndvi = image.select('NDVI');
  var propVeg = ndvi.expression(
    '((ndvi - ndvi_min) / (ndvi_max - ndvi_min)) * ((ndvi - ndvi_min) / (ndvi_max - ndvi_min))', {
      'ndvi_max': 0.7,
      'ndvi_min': 0.05,
      'ndvi': ndvi
    }).rename('propVeg');
  var img_with_pv = image.addBands(propVeg);
  return img_with_pv;
}


/*
  landSurfaceEmissivity:
  Function calculate the surface emissifity.

  Params:
  (ee.Image) image - input image with the proportional vegetation band.
  
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var lse = geet.landSurfaceEmissivity(pv);
*/
exports.landSurfaceEmissivity = function (image) {
  var lse = image.expression(
    '(0.004 * pv_img) + 0.986', {
      'pv_img': image.select('propVeg')
    }).rename('LSE');
  var img_with_lse = image.addBands(lse);
  return img_with_lse;
}


/*
  landSurfaceTemperature:
  Function calculate the land surface temperature.

  Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
                     NDVI, PropVeg and LSE bands.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var surfTemp_img = geet.landSurfaceTemperature(img);
*/
exports.landSurfaceTemperature = function (image) {
  var p = 14380;
  var lse_band = image.select('LSE');
  var lse_log = lse_band.log();

  var lst = image.expression(
    'BT / 1 + B10 * (BT / p) * lse_log', {
      'p': p,
      'BT': image.select('Brightness_Temperature'),
      'B10': image.select('B10'),
      'lse_log': lse_log
    }).rename('LST');

  var image_with_lst = image.addBands(lst);
  return image_with_lst;
}



/*
  exportImg:
  Function to export an image to your Google Drive account.

  Params:
  (ee.Image) image - the input image.
  (string) outFilename - the name of the output file that will be exported.
  optional (number) _scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.
  optional (number) _maxPixels - the number of maximun pixels that can be exported. Default is 1e12.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.exportImg(img, 'output_img');
*/
exports.exportImg = function (image, outFilename, _scale, _maxPixels) {
  if (_scale === undefined) {
    var scale = 30;
  } else {
    scale = _scale;
  }

  if (_scale === undefined) {
    var maxPixels = 1e12;
  } else {
    maxPixels = _scale;
  }

  // Export the image, specifying scale and region.
  Export.image.toDrive({
    image: image,
    description: outFilename,
    scale: scale,
    maxPixels: maxPixels
  });
}
