# GEET (Google Earth Engine Toolbox)
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


#### **svm - (image, trainingData, fieldName, kernelType)** 
_Function to apply SVM classification to a image._  

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
_Function to apply CART classification to a image._

##### Params:
  (ee.Image) image - The input image to classify.       
  (ee.List) trainingData - Training data (samples).     
  (string) fieldName - The name of the column that contains the class names.       
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  var imgClass = geet.cart(image, samplesfc, landcover);   

------------------------------------------------------------------------------

#### **rf - (image, trainingData, fieldName, _numOfTrees)**
_Function to apply Random Forest classification to an image._ 

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
_Function to apply RandomForest classification to an image._  

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
  
#### **simpleNDVIChangeDetection - (img1, img2, sensor, threshold)**
_Function to detect changes between two input images using the NDVI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndviChange, 3, 'change_detection');_ 

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
_Function to detect changes between two input images using the NDWI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndwiChange, 3, 'change_detection');_ 

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
_Function to detect changes between two input images using the NDBI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndbiChange, 3, 'change_detection');_ 

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

#### **texture - (image, radius)**
_Function generate a texture filter on the image._ 

##### Params:
  (ee.Image) image = The input image.  
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize more the result.                    
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  var texture = geet.texture(image_from_rio, 1);     
    
------------------------------------------------------------------------------

#### **majority - (image, radius)**
_Function to filter the final classification image and clear the salt n' pepper effect._ 

##### Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize more the result.                     
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  var majority = geet.majority(image_from_rio, 1);   

  ------------------------------------------------------------------------------

#### **color - (_color)**
_Function to return a valid color value from the object COLOR._ 

##### Params:
  (string) color - the name of the desired color. Valid options are water, 
                   forest, pasture, urban, shadow or null.                     
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  geet.color('water');    

------------------------------------------------------------------------------

#### **plotRGB - (image, _title)**
_Function to plot a RGB image._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                   
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');    
  geet.plotRGB(image, 'rgb_image');    

------------------------------------------------------------------------------

#### **plotNDVI - (image, _title)**
_Function to plot a NDVI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                   
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  geet.plotNDVI(ndvi, 'ndvi_image');  

------------------------------------------------------------------------------

#### **plotNDWI - (image, _title)**
_Function to plot a NDWI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                     
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  geet.plotNDWI(ndwi, 'ndwi_image');  

------------------------------------------------------------------------------

#### **plotClass - (image, numClasses, _title)**
_Function to plot the final classification map._ 

##### Params:
  (ee.Image) image - the image to process.  
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.  
  (string) title - the layer title.                       
  
##### Usage:
  var geet = require('users/eduardolacerdageo/default:Function/GEET');  
  geet.plotClass(classified, 4, 'class_final');  

------------------------------------------------------------------------------

#### **spectralIndices - (image, sensor, index)**
_Function to take an input image and generate indexes like: NDVI, NDWI, NDBI..._   
More indices and features will be added in the future!  
Supported indices: NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI  

##### Params:
  (ee.Image) image - the image to process.  
  (string) sensor - the sensor that you are working on Landsat 5 ('L5') or 8 ('L8').  
  (string or string array) index (optional) - you can specify the index that you want
                    if you dont specify any index the function will create all possible indices.                        
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Function/indexGen');  
    var result = geet.spectralIndices(image, 'L5'); // Will create all possible indices.  
```
 

  **or specifying the index to generate:**

```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');  
    var result = geet.spectralIndices(image, 'L5', 'savi'); // This will create only SAVI.    
```


------------------------------------------------------------------------------

#### **loadImg - (_collection, _year, _roi, _title)**
_Function to get an example image to debug or test some code._     

##### Params:
  (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.  
  (number) year - the year of the image that you want to get.  
  optional (list) roi - the latitude and longitude of a roi.  
  optional (string) title - the title of the plotted image.                          
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Functions/GEET');  
    var image = geet.loadImg(); // Returns a TOA image   
```


  **or** 

```js
     var geet = require('users/eduardolacerdageo/default:Functions/GEET');  
    var image = geet.loadImg('SR', 2015); // Returns a SR image   
```
 

------------------------------------------------------------------------------

#### **toaRadiance - (image, band)**
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                        
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');    
    var new_toa_radiance = geet.toaRadiance(img, 10); // ee.Image    
```
  

#### Information:
  Formula:     **_Lλ = MLQcal + AL_**  
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))    
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)  
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)  
  Qcal         = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### **toaReflectance - (image, band)**
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                         
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');    
    var new_toa_reflectance = geet.toaReflectance(img, 10); // ee.Image    
```

#### Information:
  Formula:      **_ρλ' = MρQcal + Aρ_**  
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.  
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)  
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)  
  Qcal          = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### **toaReflectanceL8 - (image, band, _solarAngle)** 
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance Landsat 8 version with Solar Angle correction._       

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.  
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.                       
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');  
    var new_toa_reflectance_sz = geet.toaReflectanceL8(img, 10, 'SZ'); // ee.Image   
```


  or

```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');  
    var new_toa_reflectance_se = geet.toaReflectanceL8(img, 10, 'SE'); // ee.Image    
``` 

#### Information:
  Formula:      **_ρλ' = MρQcal + Aρ_**  
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.  
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)  
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)  
  Qcal          = Quantized and calibrated standard product pixel values (DN)  

  SE = Local sun elevation angle. The scene center sun elevation angle in degrees is provided in the metadata (SUN_ELEVATION).  
  SZ = Local solar zenith angle: SZ = 90° - SE  

------------------------------------------------------------------------------

#### **brightnessTempL5_K - (image)**
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                        
  
##### Usage:  
```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');  
    var brightness_temp_img = geet.brightnessTempL5_K(toa_image); // ee.Image  
```
     

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### **brightnessTempL5_C - (image)**
_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 5 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                          
  
##### Usage:
```js
    var geet = require('users/eduardolacerdageo/default:Function/GEET');  
    var brightness_temp_img = geet.brightnessTempL5_C(toa_image); // ee.Image  
```   

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)   

------------------------------------------------------------------------------


// TODO
    ```js
    
    ```
