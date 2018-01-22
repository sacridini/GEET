## Introduction:
The Google Earth Engine Toolbox (GEET) is a JavaScript single-file public domain (or MIT licensed) library for help developers to write small code base application with the Google Earth Engine (GEE) plataform.

The library also can be used to teach new developers to use the plataform even wihtout any previous programming skills.

![ndvi](https://user-images.githubusercontent.com/7756611/28606761-031da9b8-71af-11e7-8e4a-3a716e8a9886.jpg)

## Documentation: 
All functions implemented (Version 1.0 - Beta):
**svm,
cart,
rf,
kmeans,
simpleNDVIChangeDetection,
simpleNDWIChangeDetection,
simpleNDBIChangeDetection,
filterDateRange,
texture,
majority,
color,
plotRGB,
plotNDVI,
plotNDWI,
plotClass,
spectralIndices,
loadImg,
toaRadiance,
toaReflectance,
toaReflectanceL8,
brightnessTempL5_K,
brightnessTempL5_C,
brightnessTempL7_K,
brightnessTempL7_C,
brightnessTempL8_K,
brightnessTempL8_C,
resample,
resampleBand,
loadS2ById,
s2Mosaic,
landsat5Mosaic,
landsat7Mosaic,
landsat8Mosaic,
modisNdviMosaic,
max,
min,
ndviL5,
ndviL7,
ndviL8,
ndviS2,
propVeg,
landSurfaceEmissivity,
landSurfaceTemperature**


### 1 - Classifiers
#### **svm - (image, trainingData, fieldName, kernelType)** 
##### _Function to apply SVM classification to a image._  
##### Params:
  (ee.Image) image - The input image to classify.    
  (ee.List) trainingData - Training data (samples).      
  (string) fieldName - The name of the column that contains the class names.      
  (string) kernelType - the kernel type of the classifier.     
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Functions/GEET');  
  var imgClass = geet.svm(image, samplesfc, landcover);    
  
------------------------------------------------------------------------------

#### **cart - (image, trainingData, fieldName)**
##### _Function to apply CART classification to a image._
##### Params:
  (ee.Image) image - The input image to classify.       
  (ee.List) trainingData - Training data (samples).     
  (string) fieldName - The name of the column that contains the class names.       
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  var imgClass = geet.cart(image, samplesfc, landcover);   

------------------------------------------------------------------------------

#### **rf - (image, trainingData, fieldName, _numOfTrees)**
##### _Function to apply Random Forest classification to an image._ 
##### Params:
  (ee.Image) image - The input image to classify.   
  (ee.List) trainingData - Training data (samples).   
  (string) fieldName - the name of the column that contains the class names.   
  (ee.Number) numOfTrees - the number of trees that the model will create.         
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');   
  var imgClass = geet.rf(image, samplesfc, landcover, 10);    
  
 ------------------------------------------------------------------------------
 
 #### **kmeans - (image, roi, _numClusters, _scale, _numPixels)**
 ##### _Function to apply RandomForest classification to an image._  
##### Params:
(ee.Image) image - The input image to classify.     
  (list) roi - Coordenates or just a polygon of the sample area.   
  optional (number) _numClusters - the number of clusters that will be used. Default is 15.  
  optional (number) _scale - the scale number. The scale is related to the spatial resolution of the image. Landsat is 30, sou the default is 30 also.  
  optional (number) _numPixels - the number of pixels that the classifier will take samples from the roi.           
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');   
  var imgClass = geet.kmeans(image, roi);   

  **or**

  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  var imgClass = geet.kmeans(image, roi, 20, 10, 6000);  
  
  ------------------------------------------------------------------------------
  
### 2 - Change Detection
#### **simpleNDVIChangeDetection - (img1, img2, sensor, threshold)**
##### _Function to detect changes between two input images using the NDVI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndviChange, 3, 'change_detection');_ 
##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.           
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  var ndviChange = geet.simpleNDVIChangeDetection(image_2014, image_2015, 'L8', 0.5);  
  
------------------------------------------------------------------------------
   
#### **simpleNDWIChangeDetection - (img1, img2, sensor, threshold)**
##### _Function to detect changes between two input images using the NDWI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndwiChange, 3, 'change_detection');_ 
##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.            
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  var ndwiChange = geet.simpleNDWIChangeDetection( image_2014, image_2015, 'L8', 0.5);  
  
------------------------------------------------------------------------------

#### **simpleNDBIChangeDetection - (img1, img2, sensor, threshold)**
##### _Function to detect changes between two input images using the NDBI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndbiChange, 3, 'change_detection');_ 
##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.                  
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');
  var ndbiChange = geet.simpleNDBIChangeDetection(image_2014, image_2015, 'L8', 0.5);
  
------------------------------------------------------------------------------

// TODO
