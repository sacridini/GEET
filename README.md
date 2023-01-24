# GEET (Google Earth Engine Toolbox)

[![DOI](https://zenodo.org/badge/105400884.svg)](https://zenodo.org/badge/latestdoi/105400884)

Google Earth Engine website: https://earthengine.google.com/  
JavaScript Code Editor: https://code.earthengine.google.com/  
Documentation: https://developers.google.com/earth-engine/  
Python API: https://developers.google.com/earth-engine/python_install  

#### Development Info
**Author**: Eduardo Ribeiro Lacerda - Associate Researcher @ IIS - International Institute for Sustainability / PhD Candidate @ UFF - Universidade Federal Fluminense (Brazil - Rio de Janeiro)  
**Contact**: eduardolacerdageo@gmail.com

## Introduction:
The Google Earth Engine Toolbox (GEET) is a JavaScript single-file library for help developers to write small code base application with the Google Earth Engine (GEE) plataform.

The library also can be used to teach new developers to use the plataform even without any previous programming skills.

GEET using Landsat collection 2 will be available soon!

![ndvi](https://user-images.githubusercontent.com/7756611/28606761-031da9b8-71af-11e7-8e4a-3a716e8a9886.jpg)

## Documentation: 
All functions implemented (Version 0.7.6 - Beta):  
[svm](#svm)  
[cart](#cart)   
[rf](#rf)  
[naive_bayes](#naive_bayes)  
[max_ent](#gmo_max_ent)    
[kmeans](#kmeans)   
[ndvi_change_detection](#ndvi_change_detection)  
[ndwi_change_detection](#ndwi_change_detection)  
[ndbi_change_detection](#ndbi_change_detection)  
[texture](#texture)  
[majority](#majority)  
[color](#color)  
[plot_rgb](#plot_rgb)  
[plot_ndvi](#plot_ndvi)   
[plot_ndwi](#plot_ndwi)  
[plot_class](#plot_class)  
[landsat_indices](#landsat_indices)  
[sentinel2_indices](#sentinel2_indices)  
[load_image](#load_image)      
[collection2image](#collection2image)  
[toa_radiance](#toa_radiance)  
[toa_reflectance](#toa_reflectance)  
[toa_reflectance_l8](#toa_reflectance_l8)  
[brightness_temp_l5k](#brightness_temp_l5k)  
[brightness_temp_l5c](#brightness_temp_l5c)  
[brightness_temp_l7k](#brightness_temp_l7k)  
[brightness_temp_l7c](#brightness_temp_l7c)  
[brightness_temp_l8k](#brightness_temp_l8k)  
[brightness_temp_l8c](#brightness_temp_l8c)  
[resample](#resample)  
[resample_band](#resample_band)  
[load_id_s2](#load_id_s2)  
[build_annual_landsat_timeseries](#build_annual_landsat_timeseries)  
[landsat_timeseries_by_pathrow](#landsat_timeseries_by_pathrow)  
[landsat_timeseries_by_roi](#landsat_timeseries_by_roi)  
[ls5_timeseries_by_pathrow](#ls5_timeseries_by_pathrow)    
[ls7_timeseries_by_pathrow](#ls7_timeseries_by_pathrow)    
[ls8_timeseries_by_pathrow](#ls8_timeseries_by_pathrow)    
[mosaic_s2](#mosaic_s2)  
[mosaic_l5](#mosaic_l5)  
[mosaic_l7](#mosaic_l7)  
[mosaic_l8](#mosaic_l8)  
[modis_ndvi_mosaic](#modis_ndvi_mosaic)  
[max](#max)  
[min](#min)  
[mean](#mean)  
[median](#median)  
[mode](#mode)  
[sd](#sd)  
[variance](#variance)  
[amplitude](#amplitude)  
[spearmans_correlation](#spearmans_correlation)  
[linear_fit](#linear_fit)  
[ndvi_l5](#ndvi_l5)  
[ndvi_l7](#ndvi_l7)  
[ndvi_l8](#ndvi_l8)  
[ndviS2](#ndvis2)  
[prop_veg](#prop_veg)  
[surface_emissivity](#surface_emissivity)     
[surface_temperature_tm](#surface_temperature_tm)        
[surface_temperature_oli](#surface_temperature_oli)  
[lst_calc_ls5](#lst_calc_ls5)  
[lst_calc_ls7](#lst_calc_ls7)  
[lst_calc_ls8](#lst_calc_ls8)  
[export_image](#export_image)      
[cloudmask](#cloudmask)    
[cloudmask_sr](#cloudmask_sr)  
[fmask](#fmask)       
[pca](#pca)      
[geom_filter](#geom_filter)  
[tasseledcap_oli](#tasseledcap_oli)  
[tasseledcap_tm5](#tasseledcap_tm5)  
[tasseledcap_tm7](#tasseledcap_tm7)  
[tasseledcap_s2](#tasseledcap_s2)             


------------------------------------------------------------------------------

### Quickstart Guide:
### (English)
To use the library you need to click on this [link](https://code.earthengine.google.com/?accept_repo=users/eduardolacerdageo/geet). It will automatically add all the code of the library in your Google Earth Engine personal account. You only need to perform this procedure once. Remember that to add the library you must already have an account on the Earth Engine platform. To know more, visit the official site of the platform: https://earthengine.google.com/ 

After adding the library you can call its functions using the function **_require_** and storing the content in a variable. In this case, we will create a variable called **_geet_** which contains all the contents of the library. Then we can use it to call library functions: 

```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var image = geet.load_image('TOA', 2015); // Returns and loads an image on the map.
```

### (Português)
Para utilizar a biblioteca é preciso clicar neste [link](https://code.earthengine.google.com/?accept_repo=users/eduardolacerdageo/geet). Ele adicionará automaticamente todo o código da biblioteca na sua conta pessoal do Google Earth Engine. Só é necessário realizar este procedimento uma única vez. Lembre-se que para adicionar a biblioteca é necessário já possuir uma conta na plataforma do Earth Engine. Para saber mais, visite o site oficial da plataforma: https://earthengine.google.com/  

Depois de adicionar a biblioteca é possível chamar suas funções utilizando a função **_require_** e armazenando o conteúdo em uma variável. Neste caso, criaremos uma variável chamada **_geet_** que contém todo o conteúdo da biblioteca. Depois, podemos utilizar ela para chamar as funções da biblioteca:

```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var image = geet.load_image('TOA', 2015); // Retorna e carrega no mapa uma imagem.
```

------------------------------------------------------------------------------

### References:

#### svm
(image, trainingData, fieldName, kernelType, resolution) 

_Function to apply SVM classification to a image._  

##### Params:
  (ee.Image) image - The input image to classify.    
  (FeatureCollection) trainingData - Training data (samples).      
  **optional** (string) fieldName - The name of the column that contains the class names.      
  **optional** (string) kernelType - the kernel type of the classifier.  
  **optional** (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).     
  
##### Usage:
```js 
    var imgClass = geet.svm(image, samplesfc, landcover);   
```
    
------------------------------------------------------------------------------

#### cart
(image, trainingData, fieldName, resolution)  

_Function to apply CART classification to a image._

##### Params:
  (ee.Image) image - The input image to classify.       
  (FeatureCollection) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.  
  **optional** (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).         
  
##### Usage:
```js 
    var imgClass = geet.cart(image, samplesfc, landcover);    
```

------------------------------------------------------------------------------

#### rf
(image, trainingData, fieldName, numOfTrees, resolution, cv_split)  

_Function to apply Random Forest classification to an image._ 

##### Params:
  (ee.Image) image - The input image to classify.  
  (array of strings) bands - The input band names that will be choosed to train the model.  
  (FeatureCollection) trainingData - All the training data (samples).  
  (string) fieldName - The name of the column that contains the class names.  
  **optional** (number) numOfTrees - The number of trees that the model will create. Default is 10.  
  **optional** (number) resolution - the spatial resolution of the input image. Default is 30 (landsat).    
  **optional** (number) cv_split - The cross validation split percentage.               
  
##### Usage:
```js
    var imgClass = geet.rf(image, bands, samplesfc, landcover, 10);   
```
or

```js
    var imgClass = geet.rf(image, bands, samplesfc, landcover, 10, 30, 0.7);  
```
 ------------------------------------------------------------------------------

 #### naive_bayes
(image, trainingData, fieldName, resolution)  

_Function to apply the Fast Naive Bayes classification to a image._ 

##### Params:
  (ee.Image) image - The input image to classify.       
  (FeatureCollection) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.    
  **optional** (number) resolution - The spatial resolution of the input image. Default is 30 (landsat).   
  
##### Usage:
```js
    var imgClass = geet.naive_bayes(image, samplesfc, landcover);    
```
  
  or

```js
    var imgClass = geet.naive_bayes(image, samplesfc, landcover, 30);  
```
  
 ------------------------------------------------------------------------------

 #### gmo_max_ent
(image, trainingData, fieldName, resolution) 

_Function to apply the GMO Maximum Entropy classification to a image._ 

##### Params:
  (ee.Image) image - The input image to classify.       
  (FeatureCollection) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.    
  **optional** (number) resolution - The spatial resolution of the input image. Default is 30 (landsat).     
  
##### Usage:
```js
    var imgClass = geet.gmo_max_ent(image, samplesfc, landcover);   
```
  
  or

```js
   var imgClass = geet.naive_bayes(image, samplesfc, landcover, 30);   
```
  
 ------------------------------------------------------------------------------
 
#### kmeans 
(image, roi, numClusters, resolution, numPixels)  

_Function to apply RandomForest classification to an image._  

##### Params:
  (ee.Image) image - The input image to classify.     
  (Feature/Geometry) roi - A polygon containing the study area.
  **optional** (number) _numClusters - the number of clusters that will be used. Default is 15.  
  **optional** (number) _scale - the scale number. The scale is related to the spatial resolution of the image. Landsat is 30, sou the default is 30 also.  
  **optional** (number) _numPixels - the number of pixels that the classifier will take samples from the roi.           
  
##### Usage:
```js
    var imgClass = geet.kmeans(image, roi);    
```
  
  or

```js
    var imgClass = geet.kmeans(image, roi, 20, 10, 6000);  
```
  
  ------------------------------------------------------------------------------
  
#### ndvi_change_detection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDVI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndviChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.           
  
##### Usage:
```js    
    var ndviChange = geet.simpleNDVIChangeDetection(image_2014, image_2015, 'L8', 0.5);   
```
   
------------------------------------------------------------------------------
   
#### ndwi_change_detection
(img1, img2, sensor, threshold) 

_Function to detect changes between two input images using the NDWI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndwiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.            
  
##### Usage:
```js    
    var ndwiChange = geet.ndwi_change_detection( image_2014, image_2015, 'L8', 0.5);  
```
    
------------------------------------------------------------------------------

#### ndbi_change_detection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDBI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndbiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.                  
  
##### Usage:
```js
    var ndbiChange = geet.ndbi_change_detection(image_2014, image_2015, 'L8', 0.5);  
```
   
------------------------------------------------------------------------------

#### texture
(image, radius)  

_Function generate a texture filter on the image._ 

##### Params:
  (ee.Image) image = The input image.  
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize more the result.                    
  
##### Usage:
```js   
    var texture = geet.texture(image_from_rio, 1);         
```  
    
------------------------------------------------------------------------------

#### majority
(image, radius)  

_Function to filter the final classification image and clear the salt n' pepper effect._ 

##### Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize more the result.                     
  
##### Usage:
```js 
    var majority = geet.majority(image_from_rio, 1);  
``` 

  ------------------------------------------------------------------------------

#### color
(_color_)  

_Function to return a valid color value from the object COLOR._ 

##### Params:
  (string) color - the name of the desired color. Valid options are water, 
                   forest, pasture, urban, shadow or null.                     
  
##### Usage:
```js 
    geet.color('water');  
```

------------------------------------------------------------------------------

#### plot_rgb
(image, title)  

_Function to plot a RGB image._ 

##### Params:
  (ee.Image) image - the image to display.  
  **optional** (string) title - the layer title.                   
  
##### Usage:
```js
        
    geet.plot_rgb(image, 'rgb_image');  
```
  
------------------------------------------------------------------------------

#### plot_ndvi
(image, title)  

_Function to plot a NDVI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                   
  
##### Usage:
```js
    geet.plot_ndvi(ndvi, 'ndvi_image'); 
```

------------------------------------------------------------------------------

#### plot_ndwi
(image, title)  

_Function to plot a NDWI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                     
  
##### Usage:
```js
    geet.plot_ndwi(ndwi, 'ndwi_image'); 
```

------------------------------------------------------------------------------

#### plot_class
(image, numClasses, title)  

_Function to plot the final classification map._ 

##### Params:
  (ee.Image) image - the image to process.  
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.  
  **optional** (string) title - the layer title.                       
  
##### Usage:
```js
    geet.plot_class(classified, 4, 'class_final'); 
```
 
------------------------------------------------------------------------------

#### landsat_indices  
(image, sensor, index)  

_Function to take an input image and generate indexes like: NDVI, NDWI, NDBI..._   
More indices and features will be added in the future!  
Supported indices: NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI  

##### Params:
  (ee.Image) image - the image to process.  
  (string) sensor - the sensor that you are working on Landsat 5 ('L5') 7 ('L7') and 8 ('L8').  
  **optional** (string or string array) index  - you can specify the index that you want
                    if you dont specify any index the function will create all possible indices.                        
  
##### Usage:
```js  
    var result = geet.landsat_indices(image, 'L5'); // Will create all possible indices.  
```
 

  or specifying the index to generate:

```js 
    var result = geet.landsat_indices(image, 'L5', 'savi'); // This will create only SAVI.    
```

------------------------------------------------------------------------------

#### sentinel2_indices
(image, index)  

_Function to take an input image and generate indexes using the Sentinel 2 dataset._   

#### Supported indices:
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

##### Params:
  (ee.Image) image - the image to process.   
  **optional** (string or string array) index  - you can specify the index that you want
                    if you dont specify any index the function will create all possible indices.                        
  
##### Usage:
```js  
    var result = geet.sentinel2_indices(image); // Will create all possible indices.  
```
 

  or specifying the index to generate:

```js 
    var result = geet.sentinel2_indices(image, 'savi'); // This will create only SAVI.    
```

------------------------------------------------------------------------------

#### load_image
(collection, year, roi, cloudfree)  

_Function to get an example image to debug or test some code._     

##### Params:
  **optional** (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.  
  **optional** (number) year - the year of the image that you want to get.  
  **optional** (list) roi - the latitude and longitude of a roi.  
  **optional** (bool) cloudFree - true for cloud mask processing and mean calculation.                           
  
##### Usage:
```js 
    var image = geet.load_image(); // Returns a TOA image   
```


  or

```js
    var image = geet.load_image('SR', 2015); // Returns a SR image   
```

------------------------------------------------------------------------------

#### collection2image
(image, previous)    

_Function to merge all imagens of one image collection into a single band._       

##### Params:
  (ee.Image) image - The image of the image collection to add as a band.  
  (ee.Image) previous - The output image.                              
  
##### Usage:
```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var merged_image = image_collection.iterate(geet.collection2image, ee.Image([]));   
```

------------------------------------------------------------------------------


#### toa_radiance
(image, band)  

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                        
  
##### Usage:
```js
    var new_toa_radiance = geet.toa_radiance(img, 10); // ee.Image    
```
  

#### Information:
  Formula:     **_Lλ = MLQcal + AL_**  
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))    
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)  
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)  
  Qcal         = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### toa_reflectance
(image, band)  
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                         
  
##### Usage:
```js   
    var new_toa_reflectance = geet.toa_reflectance(img, 10); // ee.Image    
```

#### Information:
  Formula:      **_ρλ' = MρQcal + Aρ_**  
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.  
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)  
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)  
  Qcal          = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### toa_reflectance_l8
(image, band, _solarAngle_)

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance Landsat 8 version with Solar Angle correction._       

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.  
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.                       
  
##### Usage:
```js
    var new_toa_reflectance_sz = geet.toa_reflectance_l8(img, 10, 'SZ'); // ee.Image   
```


  or

```js
    var new_toa_reflectance_se = geet.toa_reflectance_l8(img, 10, 'SE'); // ee.Image    
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

#### brightness_temp_l5k
(image)  

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                        
  
##### Usage:  
```js
    var brightness_temp_img = geet.brightness_temp_l5k(toa_image); // ee.Image  
```
     

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### brightness_temp_l5c
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 5 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                          
  
##### Usage:
```js   
    var brightness_temp_img = geet.brightness_temp_l5c(toa_image); // ee.Image    
```   

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)   

------------------------------------------------------------------------------

#### brightness_temp_l7k
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 7 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                            
  
##### Usage:
```js    
    var brightness_temp_img = geet.brightness_temp_l7k(toa_image); // ee.Image      
```   

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)    

------------------------------------------------------------------------------

#### brightness_temp_l7c
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 7 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.  
                               
  
##### Usage:
```js  
    var brightness_temp_img = geet.brightness_temp_l7c(toa_image); // ee.Image  
```   


#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### brightness_temp_l8k
(image, single)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 8 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.   
  (boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!                             
  
##### Usage:
```js 
    var brightness_temp_img = geet.brightness_temp_l8k(toa_image); // ee.Image      
``` 

or

 ```js
    var brightness_temp_img = geet.brightness_temp_l8k(toa_image, false); // ee.Image    
``` 

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)

------------------------------------------------------------------------------

#### brightness_temp_l8c
(image, single)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 8 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.   
  (boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!                             
  
##### Usage:
```js  
    var brightness_temp_img = geet.brightness_temp_l8c(toa_image); // ee.Image  
``` 

or

 ```js
    var brightness_temp_img = geet.brightness_temp_l8c(toa_image, false); // ee.Image   
``` 

#### Information:
  T           = Top of atmosphere brightness temperature (K)    
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))    
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)    
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### resample
(image, scale, mode)  

_Function to resample an input image._     

##### Params:
  (ee.Image) image - the image to resample.  
  (number) scale - the number of the spatial resolution that you
                        want to use to  resample the input image.  
  (string) mode - The interpolation mode to use. One of 'bilinear' or 'bicubic'.  
  
##### Usage:
```js
    var landsat_10m = geet.resample(L8_img, 10, 'bilinear');      
``` 

------------------------------------------------------------------------------

#### resample_band
(band, scale, mode)  

_Function to resample just a single band._     

##### Params:
  (ee.Image) band - the band to resample.  
  (number) scale - the number of the spatial resolution that you
                        want to use to  resample the input band.  
  (string) mode - The interpolation mode to use. One of 'bilinear' or 'bicubic'.    
  
##### Usage:
```js
    var landsatB10_60m = geet.resample_band(b10, 60, 'bicubic');  
```

------------------------------------------------------------------------------

#### load_id_s2
(id)  

_Function to filter the Sentinel-2 collection by Product ID obtained from the Copernicus Open Access Hub._     

##### Params:
  (string) id - the id of the Sentinel 2 image.                            
  
##### Usage:
```js
    var s2_image = geet.load_id_s2('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');  
```

------------------------------------------------------------------------------


#### build_annual_landsat_timeseries
(roi)

_Function to build a annual Landsat surface reflectance timeseries from 1985 to 2017. The function also mask clouds and shadow and create some indices bands like NDVI, NDWI and SAVI._  

##### Params:  
  (ee.Point) roi - the region of interest that will define the study area and the landsat path row  
                        
  
##### Usage:
```js   
    var ls_timeseries = geet.build_annual_landsat_timeseries(roi);     
```     

------------------------------------------------------------------------------

#### landsat_timeseries_by_pathrow
(type, path, row)

_Function that return a image collection with all landsat images (5 and 8) from a defined path row. Remember to specify the type of the collection (raw, toa or sr)._  

##### Params:
  (string) type - the type of the collection (RAW, TOA or SR)  
  (number) path - the path number of the image  
  (number) row - the row number of the image                              
  
##### Usage:
```js   
  	var ls_collection = geet.landsat_timeseries_by_pathrow('SR', 217, 76);   
```			

------------------------------------------------------------------------------

#### landsat_timeseries_by_roi
(type, path, row)

_Function that return a image collection with all landsat images (5 and 8) from a defined roi. Remember to specify the type of the collection (raw, toa or sr)._  

##### Params:
  (string) type - the type of the collection (RAW, TOA or SR)  
  (ee.Geometry) roi - the Region of Interest to filter the dataset                                
  
##### Usage:
```js   
    var ls_collection = geet.landsat_timeseries_by_roi('SR', roi); 
```

------------------------------------------------------------------------------

#### ls5_timeseries_by_pathrow  
(type, path, row)   

_Function that return a image collection with all landsat 5 images from a defined path row._     

##### Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image
                            
  
##### Usage:
```js
	var ls_collection = geet.ls5_timeseries_by_pathrow('SR', 220, 77); 
```

------------------------------------------------------------------------------

#### ls7_timeseries_by_pathrow  
(type, path, row)   

_Function that return a image collection with all landsat 7 images from a defined path row._     

##### Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image
                            
  
##### Usage:
```js
	var ls_collection = geet.ls7_timeseries_by_pathrow('SR', 220, 77); 
```

------------------------------------------------------------------------------

#### ls8_timeseries_by_pathrow  
(type, path, row)   

_Function that return a image collection with all landsat 8 images from a defined path row._     

##### Params:
  (string) type - the type of the collection (RAW, TOA or SR)
  (number) path - the path number of the image
  (number) row - the row number of the image
                            
  
##### Usage:
```js
	var ls_collection = geet.ls5_timeseries_by_pathrow('SR', 220, 77); 
```

------------------------------------------------------------------------------

#### mosaic_s2
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free TOA mosaic using the Sentinel 2 dataset._     

##### Params:
  (string) startDate - the start date of the dataset.  
  (string) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                             
  
##### Usage:
```js  
    var s2_mosaic = geet.mosaic_s2('2016-01-01', '2016-12-31'); // Display the final world mosaic.  
```

or

```js   
    var s2_mosaic = geet.mosaic_s2('2016-01-01', '2016-12-31', roi); // Display the final mosaic of the roi  
```

or 

```js 
    var s2_mosaic = geet.mosaic_s2('2016-01-01', '2016-12-31', roi, false); // Doesnt display the mosaic  
```

------------------------------------------------------------------------------

#### mosaic_l5
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 5 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l5_mosaic = geet.mosaic_l5('2005-01-01', '2005-12-31'); // Display the final world mosaic. 
```

or

```js
    var l5_mosaic = geet.mosaic_l5(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l5_mosaic = geet.mosaic_l5('2005-01-01', '2005-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### mosaic_l7
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 7 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l7_mosaic = geet.mosaic_l7('2003-01-01', '2003-12-31'); // Display the final world mosaic. 
```

or

```js
    var l7_mosaic = geet.mosaic_l7(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l7_mosaic = geet.mosaic_l7('2003-01-01', '2003-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### mosaic_l8
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 8 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l8_mosaic = geet.mosaic_l8('2015-01-01', '2015-12-31'); // Display the final world mosaic. 
```

or

```js
    var l8_mosaic = geet.mosaic_l8(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l8_mosaic = geet.mosaic_l8('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### modis_ndvi_mosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free NDVI mosaic using the MODIS/MOD13Q1 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var modis_ndvi_mosaic = geet.modis_ndvi_mosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic. 
```

or

```js
    var modis_ndvi_mosaic = geet.modis_ndvi_mosaic(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var modis_ndvi_mosaic = geet.modis_ndvi_mosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### max
(image, roi, scale, maxPixels)  

_Function the get the maximum value from an image and returns an dictionary with all band values._     

##### Params:
  (ee.Image) image - the input image.   
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.  
  **optional** (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.  
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.                              
  
##### Usage:
```js
    var img_max = geet.max(img);     
```

or

```js
   var img_max = geet.max(img, roi, 30, 1e12); 
```

------------------------------------------------------------------------------

#### min
(image, roi, scale, maxPixels)  

_Function the get the minimum value from an image and returns an dictionary with all band values._     

##### Params:
  (ee.Image) image - the input image.  
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.      
  **optional** (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.    
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.                               
  
##### Usage:
```js
    var img_min = geet.min(img);    
```

or

```js
   var img_min = geet.min(img, roi, 30, 1e12); 
```

------------------------------------------------------------------------------

#### mean
(image, roi, scale, maxPixels)  

_Function the get the mean value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.      
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.            
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.   
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.       

##### Usage: 
```js 
    var mean = geet.mean(img);  
```

or

```js 
    var mean = geet.mean(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### median
(image, roi, scale, maxPixels)   

_Function the get the median value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.        
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.           
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.         
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.         

##### Usage: 
```js 
    var median = geet.median(img);  
```

or

```js 
    var median = geet.median(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### mode
(image, roi, scale, maxPixels)  

_Function the get the mode value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.        
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.           
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.         
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.         

##### Usage: 
```js 
    var mode = geet.mode(img);  
```

or

```js 
    var mode = geet.mode(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### sd
(image, roi, scale, maxPixels)  

_Function the get the standard deviation value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.        
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.           
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.         
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.         

##### Usage: 
```js 
    var standardDeviation = geet.sd(img);  
```

or

```js 
    var standardDeviation = geet.sd(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### variance
(image, roi, scale, maxPixels)  


_Function the get the variance value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.        
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.           
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.         
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.         

##### Usage: 
```js 
    var variance = geet.variance(img);  
```

or

```js 
    var variance = geet.variance(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### amplitude
(image, roi, scale, maxPixels)  

_Function the get the amplitude value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image - the input image.        
  **optional** (ee.Geometry) roi - the region of interest. Default is set to the image geometry.           
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.         
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.         

##### Usage: 
```js 
    var amplitude = geet.amplitude(img);  
```

or

```js 
    var amplitude = geet.amplitude(img, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### spearmans_correlation
(image, roi, scale, maxPixels)  

_Function the get the spearmans correlation value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image1 - the first input image.    
  (ee.Image) image2 - the second input image.    
  (ee.Geometry) roi - the region of interest.     
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.    
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.             

##### Usage: 
```js 
    var spearmansCorrelation = geet.spearmans_correlation(img1, img2, roi);  
```

or

```js 
    var spearmansCorrelation = geet.spearmans_correlation(img1, img2, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### linear_fit
(image, roi, scale, maxPixels)  

_Function that computes the slope and offset for a (weighted) linear regression of 2 inputs. It returns a dictionary._

##### Params:
  (ee.Image) image1 - the first input image.    
  (ee.Image) image2 - the second input image.    
  (ee.Geometry) roi - the region of interest.     
  **optional** (ee.Number) scale - the scale number.The scale is related to the spatial resolution of the image. The default is 30.    
  **optional** (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.             

##### Usage: 
```js 
    var linearFit = geet.linear_fit(img1, img2, roi);  
```

or

```js 
    var linearFit = geet.linear_fit(img1, img2, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### ndvi_l5 
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 5 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l5_ndvi = geet.ndvi_l5(img);  
```

------------------------------------------------------------------------------

#### ndvi_l7
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 7 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l7_ndvi = geet.ndvi_l7(img);  
```

------------------------------------------------------------------------------

#### ndvi_l8
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 8 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l8_ndvi = geet.ndvi_l8(img);  
```

------------------------------------------------------------------------------

#### ndviS2
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Sentinel 2 data._     

##### Params:
  (ee.Image) image - the input image.                               
  
##### Usage:
```js
    var s2_ndvi = geet.ndviS2(img);
```

------------------------------------------------------------------------------

#### prop_veg
(image)  

_Function calculate the proportional vegetation._     

##### Params:
  (ee.Image) image - input image with the NDVI band.                              
  
##### Usage:
```js
    var img_pv = geet.prop_veg(img);
```

------------------------------------------------------------------------------

#### surface_emissivity
(image)  

_Function calculate the surface emissifity._     

##### Params:
  (ee.Image) image - input image with the proportional vegetation band.                            
  
##### Usage:
```js
    var lse = geet.surface_emissivity(pv);
```

------------------------------------------------------------------------------

#### surface_temperature_tm
(image)  

_Function calculate the land surface temperature (Landsat 5)._     

##### Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
                     NDVI, prop_veg and LSE bands.                            
  
##### Usage:
```js
    var surfTemp_img = geet.surface_temperature_tm(img);
```

------------------------------------------------------------------------------

#### surface_temperature_oli
(image)  

_Function calculate the land surface temperature (Landsat 8)._     

##### Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
                     NDVI, prop_veg and LSE bands.                            
  
##### Usage:
```js
    var surfTemp_img = geet.surface_temperature_oli(img);
```

------------------------------------------------------------------------------

#### lst_calc_ls5
(image)  

_Function calculate the land surface temperature from a Landsat 5 image doing all the process in a single function._     

##### Params:
  (ee.Image) image - the input Landsat 5 image.                         
  
##### Usage:
```js
      var geet = require('users/eduardolacerdageo/geet:geet');
      var lst = geet.lst_calc_ls5(img);
```

------------------------------------------------------------------------------

#### lst_calc_ls7
(image)  

_Function calculate the land surface temperature from a Landsat 7 image doing all the process in a single function._     

##### Params:
  (ee.Image) image - the input Landsat 7 image.                         
  
##### Usage:
```js
      var geet = require('users/eduardolacerdageo/geet:geet');
      var lst = geet.lst_calc_ls7(img);
```
------------------------------------------------------------------------------

#### lst_calc_ls8
(image)  

_Function calculate the land surface temperature from a Landsat 8 image doing all the process in a single function._     

##### Params:
  (ee.Image) image - the input Landsat 8 image.                         
  
##### Usage:
```js
      var geet = require('users/eduardolacerdageo/geet:geet');
      var lst = geet.lst_calc_ls8(img);
```
------------------------------------------------------------------------------

#### export_image
(image, scale)  

_Function to export an image to your Google Drive account._     

##### Params:
  (ee.Image) image - the input image.  
  **optional** (number) _scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.                             
  
##### Usage:
```js
    geet.export_image(img);
```

or

```js
    geet.export_image(sentinel2_img, 10);
```

------------------------------------------------------------------------------

#### cloudmask
(image)  

_Function create a cloud mask from a Landsat input image._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var cloudmask_img = geet.cloudmask(img);
```

------------------------------------------------------------------------------

#### cloudmask_sr
(original_image, qa_image)   

_Function create a cloud mask from a Surface Reflectance Landsat input image._     

##### Params:
  (ee.Image) original_image - the original input image with all the bands.  
  (ee.Image) qa_band - the input QA band (pixel_qa band).  
                           
  
##### Usage:
```js  
    var img = images.first();
    var QA = img.select(['pixel_qa']);
    var masked_img = geet.cloudmask_sr(img, QA); 
```

------------------------------------------------------------------------------


#### fmask  
(original_image)   

_Function to cloud mask an Surface Reflectance Landsat input image._     

##### Params:
  (ee.Image) original_image - the original input image with all the bands.  
                           
  
##### Usage:
```js  
    var masked_img = geet.fmask(img); 
```

#### Information:  
  PS: Special thanks to "HMSP": https://gis.stackexchange.com/users/93552/hmsp  

------------------------------------------------------------------------------

#### pca
(image, nbands, scale, maxPixels)  

_Function produce the principal components analysis of an image._     

##### Params:
  (ee.Image) image - the input image.  
  optional (number) nBands - the number of the bands of the image. Default is 12.  
  optional (number) scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.  
  optional (number) maxPixels - the number of maximun pixels that can be exported. Default is 1e10.                            
  
##### Usage:
```js
    var pca = geet.pca(img);
    var pca_image = ee.Image(pca[0]);
    Map.addLayer(pca_image);
```

#### Information:  
  Modified from https://github.com/mortcanty/earthengine/blob/master/src/eePca.py

------------------------------------------------------------------------------

#### geom_filter
(geom, column, symbol, value) 

_Function filter a geometry/feature by value._     

##### Params:
  (ee.Geometry) geom - the input geometry.  
  (string) column - the column name.  
  (string) symbol - the symbol. Ex: >, >=, <, <= or =.  
  (number) value - the value that will be used by the filter.                               
  
##### Usage:
```js
      var geom_filtered = geet.geom_filter(geom, 'AreaSqKm', '>', 25000);
```

------------------------------------------------------------------------------

#### tasseledcap_oli
(image) 

_Function to create a Tasselled Cap using an Landsat 8 image._     

##### Params:
  (ee.Image) image - the input image.                                   
  
##### Usage:
```js
      var image_tcap = geet.tasseledcap_oli(img);  
```

------------------------------------------------------------------------------

#### tasseledcap_tm5
(image) 

_Function to create a Tasselled Cap using an Landsat 5 image._     

##### Params:
  (ee.Image) image - the input image.                                   
  
##### Usage:
```js
      var image_tcap = geet.tasseledcap_tm5(img);  
```

------------------------------------------------------------------------------

#### tasseledcap_tm7
(image) 

_Function to create a Tasselled Cap using an Landsat 7 image._     

##### Params:
  (ee.Image) image - the input image.                                   
  
##### Usage:
```js
      var image_tcap = geet.tasseledcap_tm7(img);  
```

------------------------------------------------------------------------------

#### tasseledcap_s2
(image) 

_Function to create a Tasselled Cap on a Sentinel 2 image._     

##### Params:
  (ee.Image) image - the input image.                                   
  
##### Usage:
```js
      var image_tcap = geet.tasseledcap_s2(img);  
```

------------------------------------------------------------------------------