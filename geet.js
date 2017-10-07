/* 
  Author: Eduardo R. Lacerda
  e-mail: eduardolacerdageo@gmail.com
  Version: 0.0.7 (Alpha)
*/

/*
  SVM:
  Function to apply SVM classification to a image.

  Params:
  (ee.Image) image - The input image to classify
  (ee.List) trainingData - Training data (samples)  
  (string) fieldName - The name of the column that contains the class names

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.SVM(image, samplesfc, landcover);
*/
exports.SVM = function(image, trainingData, fieldName, kernelType) {
  var kernel = 'RBF';
  if (kernelType !== null) {
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
  CART:
  Function to apply CART classification to a image.

  Params:
  (ee.Image) image - The input image to classify
  (ee.List) trainingData - Training data (samples) 
  (string) fieldName - The name of the column that contains the class names

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var imgClass = geet.CART(image, samplesfc, landcover);
*/
exports.CART = function(image, trainingData, fieldName) {
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
}

// COLOR OBJECT
var COLOR = {
  WATER: '0066ff',
  FOREST: '009933',
  PASTURE: '99cc00',
  URBAN: 'ff0000',
  SHADOW: '000000',
  NULO: '808080'
};

// TODO
exports.plotRGB = function(image, title) {
  Map.addLayer(image, {}, title);
}

// TODO
exports.plotNDVI = function(image, title) {
  Map.addLayer(image, {}, title);
}

// TODO
exports.plotNDWI = function(image, title) {
  Map.addLayer(image, {}, title);
}

/*
  plotClass:
  Function to plot the final classification map.
  
  Params:
  (ee.Image) image - the image to process
  (string) title - the layer title 
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.

  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  geet.plotClass(classified, 'class_final', 4);
*/
exports.plotClass = function(image, title, numClasses) {
  switch (numClasses) {
    case 2:
      Map.addLayer(image, {min: 0, max: numClasses - 1, palette: [COLOR.SHADOW, COLOR.NULO]}, title);
      break;
    case 3:
      Map.addLayer(image, {min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.WATER]}, title);
      break;
    case 4:
      Map.addLayer(image, {min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.PASTURE, COLOR.WATER]}, title);
      break;
    case 5:
      Map.addLayer(image, {min: 0, max: numClasses - 1, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.PASTURE, COLOR.WATER, COLOR.SHADOW]}, title);
      break;
    default:
      print("Wrong number of classes. plotClass supports a number of classes from 2 to 5 only.");
      break;
  }
}

/*
  spectralIndices:
  Function to take an input image and generate indexes like:
  NDVI, NDWI, NDBI...
  
  More indices and features will be added in the future!

  Supported indices:
  NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI

  Params:
  (ee.Image) image - the image to process
  (string) sensor - the sensor that you are working on Landsat 5 ('L5') or 8 ('L8')
  (string or string array) index (optional) - you can specify the index that you want
                     if you dont specify any index the function will create all possible indices.
  Usage:
  var geet = require('users/eduardolacerdageo/default:Function/indexGen');
  var result = geet.spectralIndices(image, 'L5'); // Will create all possible indices.

  or specifying the index to generate:
  var geet = require('users/eduardolacerdageo/default:Function/indexGen');
  var result = geet.spectralIndices(image, 'L5', 'savi'); // This will create only SAVI.
*/
exports.spectralIndices = function(image, sensor, index) {
    if (index != null) {
      switch(index) {
        case 'NDVI':
          if (sensor == 'L5') {
            var i_ndvi = image.normalizedDifference(['B4','B3']).rename('NDVI');
            var newImage = image.addBands(i_ndvi);
            return newImage;
          } else if (sensor == 'L8') {
            var i_ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
            var newImage = image.addBands(i_ndvi);
            return newImage;
          } else {
            print('Wrong sensor!');
          }
          break;
        case 'NDWI':
          if (sensor == 'L5') {
            var i_ndwi =  image.normalizedDifference(['B3','B5']).rename('NDWI');
            var newImage = image.addBands(i_ndwi);
            return newImage;
          } else if (sensor == 'L8') {
            var i_ndwi =  image.normalizedDifference(['B4','B6']).rename('NDWI');
            var newImage = image.addBands(i_ndwi);
            return newImage;
          } else {
            print('Wrong sensor!');
          }
          break;
        case 'NDBI':
          if (sensor == 'L5') {
            var i_ndbi =  image.normalizedDifference(['B5','B4']).rename('NDBI');
            var newImage = image.addBands(i_ndbi);
            return newImage;
          } else if (sensor == 'L8') {
            var i_ndbi =  image.normalizedDifference(['B6','B5']).rename('NDBI');
            var newImage = image.addBands(i_ndbi);
            return newImage;
          } else {
            print('Wrong sensor!');
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
        } else if (sensor  == 'L8') {
            var i_nrvi = image.expression(
              '(RED/NIR - 1) / (RED/NIR + 1)', {
                'NIR': image.select('B5'),
                'RED': image.select('B4')
              }).rename('NRVI');
            var newImage = image.addBands(i_nrvi);
            return newImage;
        } else { 
          print('Wrong sensor!');
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
        } else if (sensor  == 'L8') {
            var i_evi = image.expression(
              '2.5 * ((NIR - RED)) / (NIR + 6 * RED - 7.5 * BLUE + 1)', {
                'NIR': image.select('B5'),
                'RED': image.select('B4'),
                'BLUE': image.select('B2')
              }).rename('EVI');
            var newImage = image.addBands(i_evi);
            return newImage;
        } else { 
          print('Wrong sensor!');
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
          } else {
            print('Wrong sensor!');
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
          } else {
            print('Wrong sensor!');
          }
          break;
      }
    } else { // END OF SWITCH 
    // Gen ALL indices
    if (sensor == 'L5') {
      var i_ndvi = image.normalizedDifference(['B4','B3']).rename('NDVI');
      var i_ndwi =  image.normalizedDifference(['B2','B4']).rename('NDWI');
      var i_ndbi =  image.normalizedDifference(['B5','B4']).rename('NDBI');
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
      var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_evi, i_savi, i_gosavi]);
      return newImage;
    } else if (sensor == 'L8') {
      var i_ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
      var i_ndwi =  image.normalizedDifference(['B3','B5']).rename('NDWI');
      var i_ndbi =  image.normalizedDifference(['B6','B5']).rename('NDBI');
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
      var newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi, i_evi, i_savi, i_gosavi]);
      return newImage;
    } else {
      print("Wrong sensor input!");
      print("Choose 'L5' to process Landsat 5 images or 'L8' for Landsat 8");
      }
    }
  };

 /*
    loadImg:
    Function to get an example image to debug or test some code. 

    Params:
    (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.
    (number) year - the year of the image that you want to get.

    Usage:
    var geet = require('users/eduardolacerdageo/default:Functions/GEET');
    var image = geet.loadImg(); // Returns a TOA image

    or 

    var geet = require('users/eduardolacerdageo/default:Functions/GEET');
    var image = geet.loadImg('SR'); // Returns a SR image

    TODO:
    visualization params for SR and RAW too!

    SR Vis: min: 104, max: 1632
    RAW Vis: min: 6809, max: 12199
*/
exports.loadImg = function(_collection, _year) {
  var collection = 'TOA';
  var year = 2015;
  var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};
  if (_year !== undefined) {
    if (_year < 2014 || _year > 2016) {
      print("Error! Available years: 2014, 2015 or 2016.");
    } else {
      year = _year;
    }
  }

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
      print("Wrong collection type. Possible inputs: 'RAW', 'TOA' or 'SR'.");
    }
  }

  var start = '-01-01';
  var finish = '-12-31';
  var roi = ee.Geometry.Point(-43.25,-22.90);
  var l8 = ee.ImageCollection(collection);
  var image = ee.Image(l8
      .filterBounds(roi)
      .filterDate(year.toString() + start, year.toString() + finish)
      .sort('CLOUD_COVER')
      .first());
       
  Map.setCenter(-43.25,-22.90, 10);
  Map.addLayer(image, visParams, 'image');
  print(image);
  return image;
}

