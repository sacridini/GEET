# GEET (Google Earth Engine Toolbox)

[![DOI](https://zenodo.org/badge/105400884.svg)](https://zenodo.org/badge/latestdoi/105400884)

Google Earth Engine website: https://earthengine.google.com/  
JavaScript Code Editor: https://code.earthengine.google.com/  
Documentation: https://developers.google.com/earth-engine/  
Python API: https://developers.google.com/earth-engine/python_install  

#### Development Info
**Author**: Eduardo Ribeiro Lacerda - eduardolacerdageo@gmail.com
* Researcher @ Humboldt Universität zu Berlin

## Introduction:
The Google Earth Engine Toolbox (GEET) is a JavaScript single-file library to help developers write small codebase applications with the Google Earth Engine (GEE) platform.

The library can also be used to teach new developers to use the platform even without any previous programming skills.

GEET using Landsat Collection 2 will be available soon!

![ndvi](https://user-images.githubusercontent.com/7756611/28606761-031da9b8-71af-11e7-8e4a-3a716e8a9886.jpg)

## Documentation: 
All functions implemented (Version 1.5.0 - Beta):

### Machine Learning & Classification
- [svm](#svm)
- [cart](#cart)
- [rf](#rf)
- [naive_bayes](#naive_bayes)
- [max_ent](#max_ent)
- [kmeans](#kmeans)

### Spectral Indices & Transformations
- [landsat_indices](#landsat_indices)
- [sentinel2_indices](#sentinel2_indices)
- [water_indices](#water_indices)
- [tasseled_cap](#tasseled_cap)
- [pca](#pca)
- [ndviS2](#ndviS2)

### Change Detection
- [ndvi_change_detection](#ndvi_change_detection)
- [ndwi_change_detection](#ndwi_change_detection)
- [ndbi_change_detection](#ndbi_change_detection)
- [burn_severity](#burn_severity)

### Time Series & Mosaics
- [create_mosaic](#create_mosaic)
- [smooth_timeseries](#smooth_timeseries)
- [build_annual_landsat_timeseries](#build_annual_landsat_timeseries)
- [landsat_timeseries](#landsat_timeseries)
- [landsat_timeseries_by_pathrow](#landsat_timeseries_by_pathrow)
- [landsat_timeseries_by_roi](#landsat_timeseries_by_roi)
- [harmonic_trend](#harmonic_trend)

### Radar
- [s1_preprocess](#s1_preprocess)
- [speckle_filter](#speckle_filter)

### Topography
- [terrain_analysis](#terrain_analysis)
- [topographic_correction](#topographic_correction)
- [calculate_twi](#calculate_twi)
- [calculate_tpi_tri](#calculate_tpi_tri)
- [extract_drainage](#extract_drainage)

### Pre-Processing & Calibration
- [harmonize_sensors](#harmonize_sensors)
- [toa_radiance](#toa_radiance)
- [toa_reflectance](#toa_reflectance)
- [brightness_temp](#brightness_temp)
- [surface_emissivity](#surface_emissivity)
- [surface_temperature_tm](#surface_temperature_tm)
- [surface_temperature_oli](#surface_temperature_oli)
- [lst_calc_ls5](#lst_calc_ls5)
- [lst_calc_ls7](#lst_calc_ls7)
- [lst_calc_ls8](#lst_calc_ls8)
- [cloudmask](#cloudmask)
- [cloudmask_sr](#cloudmask_sr)
- [fmask](#fmask)
- [resample](#resample)
- [resample_band](#resample_band)
- [geom_filter](#geom_filter)

### Statistics & Math
- [zonal_statistics](#zonal_statistics)
- [reduce_image](#reduce_image)
- [spearmans_correlation](#spearmans_correlation)
- [linear_fit](#linear_fit)
- [texture](#texture)
- [majority](#majority)
- [prop_veg](#prop_veg)

### Visualization, Utilities & Export
- [plot](#plot)
- [color](#color)
- [export_image](#export_image)
- [load_image](#load_image)
- [load_id_s2](#load_id_s2)
- [collection2image](#collection2image)

### Object-Based Image Analysis (GEOBIA)
- [segmentation_snic](#segmentation_snic)
- [obia_classification](#obia_classification)
- [filter_small_objects](#filter_small_objects)

------------------------------------------------------------------------------

### Quickstart Guide:
### (English)
To use the library, you need to click on this [link](https://code.earthengine.google.com/?accept_repo=users/eduardolacerdageo/geet). It will automatically add all the code of the library in your Google Earth Engine personal account. You only need to perform this procedure once. Remember that to add the library, you must already have an account on the Earth Engine platform. To know more, visit the official site of the platform: https://earthengine.google.com/ 

After adding the library, you can call its functions using the function **_require_** and store the content in a variable. In this case, we will create a variable called **_geet_** which contains all the contents of the library. Then we can use it to call library functions: 

```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var image = geet.load_image('TOA', 2015); // Returns and loads an image on the map.
```

### (Português)
Para utilizar a biblioteca, é preciso clicar neste [link](https://code.earthengine.google.com/?accept_repo=users/eduardolacerdageo/geet). Ele adicionará automaticamente todo o código da biblioteca à sua conta pessoal do Google Earth Engine. Só é necessário realizar este procedimento uma única vez. Lembre-se que para adicionar a biblioteca é necessário já possuir uma conta na plataforma do Earth Engine. Para saber mais, visite o site oficial da plataforma: https://earthengine.google.com/  

Depois de adicionar a biblioteca é possível chamar suas funções utilizando a função **_require_** e armazenando o conteúdo em uma variável. Neste caso, criaremos uma variável chamada **_geet_** que contém todo o conteúdo da biblioteca. Depois, podemos utilizá-la para chamar as funções da biblioteca:

```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var image = geet.load_image('TOA', 2015); // Retorna e carrega no mapa uma imagem.
```

-------------------------------------------------------------------------

------------------------------------------------------------------------------
## Machine Learning & Classification
------------------------------------------------------------------------------

#### svm
(image, trainingData, fieldName, kernelType, resolution) 

_Function to apply SVM classification to an image._  

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

_Function to apply CART classification to an image._

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
  (array of strings) bands - The input band names that will be chosen to train the model.  
  (FeatureCollection) trainingData - All the training data (samples).  
  (string) fieldName - The name of the column that contains the class names.  
  **optional** (number) numOfTrees - The number of trees that the model will create. Default is 10.  
  **optional** (number) resolution - The spatial resolution of the input image. Default is 30 (Landsat).    
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

_Function to apply the Fast Naive Bayes classification to an image._ 

##### Params:
  (ee.Image) image - The input image to classify.       
  (FeatureCollection) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.    
  **optional** (number) resolution - The spatial resolution of the input image. Default is 30 (Landsat).   
  
##### Usage:
```js
    var imgClass = geet.naive_bayes(image, samplesfc, landcover);    
```
  
  or

```js
    var imgClass = geet.naive_bayes(image, samplesfc, landcover, 30);  
```

------------------------------------------------------------------------------

#### max_ent
(image, trainingData, fieldName, resolution) 

_Function to apply the GMO Maximum Entropy classification to an image._ 

##### Params:
  (ee.Image) image - The input image to classify.       
  (FeatureCollection) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.    
  **optional** (number) resolution - The spatial resolution of the input image. Default is 30 (Landsat).     
  
##### Usage:
```js
    var imgClass = geet.max_ent(image, samplesfc, landcover);   
```
  
  or

```js
   var imgClass = geet.max_ent(image, samplesfc, landcover, 30);   
```

------------------------------------------------------------------------------

#### kmeans 
(image, roi, numClusters, resolution, numPixels)  

_Function to apply RandomForest classification to an image._  

##### Params:
  (ee.Image) image - The input image to classify.     
  (Feature/Geometry) roi - A polygon containing the study area.
  **optional** (number) _numClusters - the number of clusters that will be used. Default is 15.  
  **optional** (number) _scale - the scale number. The scale relates to the image's spatial resolution. Landsat is 30, so the default is 30 also.  
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

------------------------------------------------------------------------------
## Spectral Indices & Transformations
------------------------------------------------------------------------------

#### landsat_indices  
(image, sensor, index)  

_Function to take an input image and generate indices like: NDVI, NDWI, NDBI..._   
More indices and features will be added in the future!  
Supported indices: NDVI, NDWI, NDBI, NRVI, EVI, SAVI and GOSAVI  

##### Params:
  (ee.Image) image - the image to process.  
  (string) sensor - the sensor that you are working on: Landsat 5 ('L5'), 7 ('L7'), and 8 ('L8').  
  **optional** (string or string array) index  - you can specify the index that you want
                    . If you don't specify any index, the function will create all possible indices.                        
  
##### Usage:
```js  
    var result = geet.landsat_indices(image, 'L5'); // Will create all possible indices.  
```
 

  or specifying the index to generate:

```js 
    var result = geet.landsat_indices(image, 'L5', 'savi'); // This will create only SAVI.    
```

  or specifying an array of indices to generate:

```js 
    var result = geet.landsat_indices(image, 'L5', ['ndvi', 'evi', 'ndwi']); // Creates only NDVI, EVI, and NDWI.    
```

------------------------------------------------------------------------------

#### sentinel2_indices
(image, index)  

_Function to take an input image and generate indices using the Sentinel 2 dataset._

------------------------------------------------------------------------------

#### water_indices
(image, sensor)

_Function to generate advanced water quality indices: NDTI (Normalized Difference Turbidity Index) and NDCI (Normalized Difference Chlorophyll Index)._

##### Params:
  (ee.Image) image - the input image.
  (string) sensor - 'L8', 'L9' or 'S2'.

##### Usage:
```js  
    var water_img = geet.water_indices(s2_image, 'S2'); 
```

------------------------------------------------------------------------------

#### tasseled_cap
(image, sensor)

_Generic function to create a Tasseled Cap image._

##### Params:
  (ee.Image) image - the input image.
  (string) sensor - 'L5', 'L7', 'L8', 'L9', or 'S2'.

##### Usage:
```js
  var image_tcap = geet.tasseled_cap(img, 'L8');  
```

------------------------------------------------------------------------------

#### pca
(image, nbands, scale, maxPixels)  

_Function produces the principal components analysis of an image._     

##### Params:
  (ee.Image) image - the input image.  
  **optional** (number) nBands - the number of bands of the image. Default is 12.  
  **optional** (number) scale - the scale number. The scale relates to the image's spatial resolution. Landsat is 30, so the default is 30 also.  
  **optional** (number) maxPixels - the maximum number of pixels that can be exported. Default is 1e10.                            
  
##### Usage:
```js
    var pca = geet.pca(img);
    var pca_image = ee.Image(pca[0]);
    Map.addLayer(pca_image);
```

------------------------------------------------------------------------------

#### ndviS2
(image)  

_Function that calculates the normalized difference vegetation index (NDVI) from Sentinel 2 data._     

##### Params:
  (ee.Image) image - the input image.                               
  
##### Usage:
```js
    var s2_ndvi = geet.ndviS2(img);
```

------------------------------------------------------------------------------

------------------------------------------------------------------------------
## Change Detection
------------------------------------------------------------------------------

#### ndvi_change_detection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDVI index and a threshold parameter. The function adds the two masked indices and returns the sum of the two. It's a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndviChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values in the 
                          image that are greater than or equal to this number 
                          will be selected.           
  
##### Usage:
```js    
    var ndviChange = geet.simpleNDVIChangeDetection(image_2014, image_2015, 'L8', 0.5);   
```

------------------------------------------------------------------------------

#### ndwi_change_detection
(img1, img2, sensor, threshold) 

_Function to detect changes between two input images using the NDWI index and a threshold parameter. The function adds the two masked indices and returns the sum of the two. It's a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndwiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that are greater than or equal to this number 
                          will be selected.            
  
##### Usage:
```js    
    var ndwiChange = geet.ndwi_change_detection( image_2014, image_2015, 'L8', 0.5);  
```

------------------------------------------------------------------------------

#### ndbi_change_detection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDBI index and a threshold parameter. The function adds the two masked indices and returns the sum. It's a good choice to call the plot_class function to visualize the result. Ex: geet.plot_class(ndbiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that are greater than or equal to this number 
                          will be selected.                  
  
##### Usage:
```js
    var ndbiChange = geet.ndbi_change_detection(image_2014, image_2015, 'L8', 0.5);  
```

------------------------------------------------------------------------------

------------------------------------------------------------------------------
## Time Series & Mosaics
------------------------------------------------------------------------------

#### create_mosaic
(startDate, endDate, roi, showMosaic, sensor)

_Generic function to build a cloud-free mosaic for Landsat 5, 7, 8, 9, or Sentinel-2._

##### Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.
  **optional** (bool) showMosaic - set to false if you don't want to display the mosaic. Default is true.
  (string) sensor - 'L5', 'L7', 'L8', 'L9' or 'S2'.

##### Usage:
```js  
    var mosaic = geet.create_mosaic('2023-01-01', '2023-12-31', roi, true, 'L8'); 
```

------------------------------------------------------------------------------

#### smooth_timeseries
(collection, windowSize)

_Function to apply a moving average filter to smooth a time series of images (e.g., NDVI series)._

##### Params:
  (ee.ImageCollection) collection - the input image collection to smooth.
  **optional** (number) windowSize - the moving window size in days. Default is 30.

##### Usage:
```js  
    var smoothed_ndvi = geet.smooth_timeseries(ndvi_collection, 45); 
```

------------------------------------------------------------------------------



------------------------------------------------------------------------------

#### topographic_correction
(image, dem)

_Applies Topographic Illumination Correction to optical images using the Cosine correction method. This is extremely useful for removing terrain shadows in mountainous areas, relying on the solar elevation and azimuth stored in the image's metadata._

##### Params:
  (ee.Image) image - the optical image to correct (e.g., Landsat or Sentinel).
  (ee.Image) dem - (optional) the Digital Elevation Model to use. Defaults to SRTM.

##### Usage:
```js
  var corrected_img = geet.topographic_correction(landsat_img);
```

------------------------------------------------------------------------------

#### calculate_twi
(roi)

_Calculates the Topographic Wetness Index (TWI). This index combines local slope and flow accumulation to quantify topographic control on hydrological processes, making it excellent for identifying wetlands, springs, and water accumulation zones._

##### Params:
  (ee.Geometry) roi - (optional) the region of interest to clip the outputs.

##### Usage:
```js
  var twi = geet.calculate_twi(roi);
  Map.addLayer(twi, {min: 5, max: 20, palette: ['red', 'yellow', 'green', 'blue']}, 'TWI');
```

------------------------------------------------------------------------------

#### calculate_tpi_tri
(roi)

_Calculates the Topographic Position Index (TPI) and Terrain Ruggedness Index (TRI) based on focal mean and focal standard deviation. TPI is used to classify valleys and ridges, while TRI is used to map terrain unevenness._

##### Params:
  (ee.Geometry) roi - (optional) the region of interest to clip the outputs.

##### Usage:
```js
  var terrain_indices = geet.calculate_tpi_tri(roi);
  var tpi = terrain_indices.select('TPI');
  var tri = terrain_indices.select('TRI');
```

------------------------------------------------------------------------------

#### extract_drainage
(roi, threshold)

_Automatically extracts the drainage/stream network based on a flow accumulation threshold using the HydroSHEDS dataset._

##### Params:
  (ee.Geometry) roi - (optional) the region of interest.
  (number) threshold - (optional) the flow accumulation threshold (in pixels) to define a stream. Defaults to 500.

##### Usage:
```js
  var rivers = geet.extract_drainage(roi, 1000);
  Map.addLayer(rivers, {palette: ['blue']}, 'Drainage Network');
```

------------------------------------------------------------------------------

#### build_annual_mss_timeseries
(roi)

_Function to build an annual Landsat MSS (Landsat 1, 2, 3, 4, 5) timeseries from 1972 to 1999. The function normalizes the distinct bands of older satellites into 'GREEN', 'RED', 'NIR1', 'NIR2', masks clouds using QA_PIXEL, calculates NDVI, and generates median annual mosaics._  

##### Params:  
  (ee.Point) roi - the region of interest that will define the study area  
                        
  
##### Usage:
```js   
    var mss_timeseries = geet.build_annual_mss_timeseries(roi);     
```

------------------------------------------------------------------------------

#### build_annual_landsat_timeseries
(roi)

_Function to build an annual Landsat (5, 7, 8, and 9) TOA time series from 1985 to 2030. The function also masks clouds and shadows, normalizes bands to standard English names, and generates all indices (NDVI, NDWI, SAVI, Tasseled Cap)._  

##### Params:  
  (ee.Point) roi - the region of interest that will define the study area and the Landsat path row  
                        
  
##### Usage:
```js   
    var ls_timeseries = geet.build_annual_landsat_timeseries(roi);     
```

------------------------------------------------------------------------------

#### landsat_timeseries
(sensor, type, path, row)

_Generic function to build an annual Landsat timeseries for a specific sensor._

##### Params:
  (string) sensor - 'L5', 'L7', 'L8', 'L9'.
  (string) type - 'TOA' or 'SR'.
  (number) path - the WRS-2 path.
  (number) row - the WRS-2 row.

##### Usage:
```js
  var l8_ts = geet.landsat_timeseries('L8', 'TOA', 221, 71);
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

_Function that returns an image collection with all Landsat images (5 and 8) from a defined roi. Remember to specify the type of the collection (raw, toa or sr)._  

##### Params:
  (string) type - the type of the collection (RAW, TOA, or SR)  
  (ee.Geometry) roi - the Region of Interest to filter the dataset                                
  
##### Usage:
```js   
    var ls_collection = geet.landsat_timeseries_by_roi('SR', roi); 
```

------------------------------------------------------------------------------

------------------------------------------------------------------------------
## Radar & Topography
------------------------------------------------------------------------------

#### s1_preprocess
(startDate, endDate, roi, polarization, orbit)

_Function to load and preprocess Sentinel-1 SAR (Radar) GRD Data._

##### Params:
  (ee.Date) startDate - the start date of the dataset.
  (ee.Date) endDate - the end date of the dataset.
  **optional** (ee.Geometry) roi - the Region of Interest.
  **optional** (string) polarization - 'VV', 'VH', 'HH', 'HV'. Default is 'VV'.
  **optional** (string) orbit - 'DESCENDING' or 'ASCENDING'. Default is 'DESCENDING'.

##### Usage:
```js  
    var radar_img = geet.s1_preprocess('2023-01-01', '2023-12-31', roi, 'VV', 'DESCENDING'); 
```

------------------------------------------------------------------------------

#### speckle_filter
(image, radius)

_Function to apply a focal median filter to reduce SAR speckle noise._

##### Params:
  (ee.Image) image - the input SAR image.
  **optional** (number) radius - the radius of the filter in meters. Default is 30.

##### Usage:
```js  
    var smooth_radar = geet.speckle_filter(radar_img, 50); 
```

------------------------------------------------------------------------------

#### terrain_analysis
(roi)

_Function to generate Elevation, Slope, Aspect, and Hillshade bands from the SRTM 30m DEM._

##### Params:
  **optional** (ee.Geometry) roi - the Region of Interest to clip the DEM.

##### Usage:
```js  
    var terrain = geet.terrain_analysis(roi); 
    // Contains bands: 'Elevation', 'Slope', 'Aspect', 'Hillshade'
```

------------------------------------------------------------------------------

------------------------------------------------------------------------------
## Pre-Processing & Calibration
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

------------------------------------------------------------------------------

#### toa_reflectance
(image, band, sensor, solarAngle)

_Generic function to calculate TOA Reflectance from raw DN._

##### Params:
  (ee.Image) image - the input raw image.
  (string) band - the band name to process.
  (string) sensor - 'L5', 'L7', 'L8', or 'L9'.
  **optional** (number) solarAngle - solar angle if absent from metadata.

##### Usage:
```js
  var ref_img = geet.toa_reflectance(raw_img, 'B4', 'L8');
```

------------------------------------------------------------------------------

#### brightness_temp
(image, sensor, unit, two_channel)

_Generic function to convert the Top of Atmosphere (TOA Radiance) image to Brightness Temperature._

##### Params:
  (ee.Image) image - the TOA Radiance image to convert.
  (string) sensor - 'L5', 'L7', 'L8' or 'L9'
  (string) unit - 'K' (Kelvin) or 'C' (Celsius)
  **optional** (bool) two_channel - for L8/L9 only, if true, processes both B10 and B11. Default is true.

##### Usage:
```js  
    var bt_img = geet.brightness_temp(toa_rad_image, 'L8', 'C'); 
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

_Function that calculates the land surface temperature (Landsat 5)._     

##### Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
                     NDVI, prop_veg, and LSE bands.                            
  
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
                     NDVI, prop_veg, and LSE bands.                            
  
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

_Function that creates a cloud mask from a Surface Reflectance Landsat input image._     

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

_Function to cloud mask a Surface Reflectance Landsat input image._     

##### Params:
  (ee.Image) original_image - the original input image with all the bands.  
                           
  
##### Usage:
```js  
    var masked_img = geet.fmask(img); 
```

------------------------------------------------------------------------------

#### resample
(image, scale, mode)  

_Function to resample an input image._     

##### Params:
  (ee.Image) image - the image to resample.  
  (number) scale - the spatial resolution you
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

#### geom_filter
(geom, column, symbol, value) 

_Function to filter a geometry/feature by value._     

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

------------------------------------------------------------------------------
## Statistics & Math
------------------------------------------------------------------------------

#### reduce_image
(image, reducerType, roi, scale, maxPixels)

_Generic function to calculate statistical reducers for a region._

##### Params:
  (ee.Image) image - the input image.
  (string) reducerType - 'max', 'min', 'mean', 'median', 'mode', 'sd', 'variance', 'amplitude'.
  (ee.Geometry) roi - the Region of Interest.
  **optional** (number) scale - the scale in meters. Default is 30.
  **optional** (number) maxPixels - the max pixels. Default is 1e9.

##### Usage:
```js
  var stats = geet.reduce_image(img, 'mean', roi, 30);  
```

------------------------------------------------------------------------------

#### spearmans_correlation
(image, roi, scale, maxPixels)  

_Function the get the spearmans correlation value from an image and returns a dictionary with all band values._

##### Params:
  (ee.Image) image1 - the first input image.    
  (ee.Image) image2 - the second input image.    
  (ee.Geometry) roi - the region of interest.     
  **optional** (ee.Number) scale - the scale number. The scale relates to the image's spatial resolution. The default is 30.    
  **optional** (number) maxPixels - the maximum number of pixels that can be exported. Default is 1e10.             

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
  **optional** (ee.Number) scale - the scale number. The scale relates to the image's spatial resolution. The default is 30.    
  **optional** (number) maxPixels - the maximum number of pixels that can be exported. Default is 1e10.             

##### Usage: 
```js 
    var linearFit = geet.linear_fit(img1, img2, roi);  
```

or

```js 
    var linearFit = geet.linear_fit(img1, img2, roi, 30, 1e12);  
```

------------------------------------------------------------------------------

#### texture
(image, radius)  

_Function generate a texture filter on the image._ 

##### Params:
  (ee.Image) image = The input image.  
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize the result more.                    
  
##### Usage:
```js   
    var texture = geet.texture(image_from_rio, 1);         
```

------------------------------------------------------------------------------

#### majority
(image, radius)  

_Function to filter the final classification image and clear the salt-and-pepper effect._ 

##### Params:
  (ee.Image) image = The input image.
  (ee.Number) radius = the radius number that defines the effect level of the filter. 
                      Bigger numbers generalize the result more.                     
  
##### Usage:
```js 
    var majority = geet.majority(image_from_rio, 1);  
```

------------------------------------------------------------------------------

#### prop_veg
(image)  

_Function that calculates the proportional vegetation._     

##### Params:
  (ee.Image) image - input image with the NDVI band.                              
  
##### Usage:
```js
    var img_pv = geet.prop_veg(img);
```

------------------------------------------------------------------------------

------------------------------------------------------------------------------
## Visualization, Utilities & Export
------------------------------------------------------------------------------

#### plot
(image, type, name, options)

_A smart wrapper for Map.addLayer that automatically applies standard color palettes and normalization ranges for common remote sensing products._

##### Params:
  (ee.Image) image - The input image to be visualized.
  (string) type - 'rgb', 'false_color', 'ndvi', 'ndwi', 'ndbi', 'class', 'gray'.
  (string) name - The name of the layer (default 'GEET Layer').
  **optional** (Object) options - Optional overrides: {min: 0, max: 1, palette: [], bands: [], sensor: 'L8'}.

##### Usage:
```js
  // Automatically plots an NDVI image from red to dark green (-1 to 1)
  geet.plot(ndvi_image, 'ndvi', 'Vegetation Index');
  
  // Automatically plots an RGB for Landsat 8
  geet.plot(l8_img, 'rgb', 'True Color', {sensor: 'L8'});
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

#### export_image
(image, scale)  

_Function to export an image to your Google Drive account._     

##### Params:
  (ee.Image) image - the input image.  
  **optional** (number) _scale - the scale number.The scale relates to the image's spatial resolution. Landsat is 30, so the default is 30 also.                             
  
##### Usage:
```js
    geet.export_image(img);
```

or

```js
    geet.export_image(sentinel2_img, 10);
```

------------------------------------------------------------------------------

#### load_image
(collection, year, roi, cloudfree)  

_Function to get an example image to debug or test some code._     

##### Params:
  **optional** (string) collection - the type of the collection that will be filtered: RAW, TOA, or SR.  
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

#### load_id_s2
(id)  

_Function to filter the Sentinel-2 collection by Product ID obtained from the Copernicus Open Access Hub._     

##### Params:
  (string) id - the ID of the Sentinel-2 image.                            
  
##### Usage:
```js
    var s2_image = geet.load_id_s2('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');  
```

------------------------------------------------------------------------------

#### collection2image
(image, previous)    

_Function to merge all images of one image collection into a single band._       

##### Params:
  (ee.Image) image - The image of the image collection to add as a band.  
  (ee.Image) previous - The output image.                              
  
##### Usage:
```js 
    var geet = require('users/eduardolacerdageo/geet:geet'); 
    var merged_image = image_collection.iterate(geet.collection2image, ee.Image([]));   
```



------------------------------------------------------------------------------

#### imad
(current, prev)

_Iteratively Reweighted Multivariate Alteration Detection (iMAD) algorithm. Developed by Dr. Allan Nielsen and implemented in GEE by Dr. Mort Canty. This is a highly advanced statistical algorithm for detecting changes between two images and finding Pseudo-Invariant Features (PIFs) that didn't change._

##### Params:
  (ee.Image) current - The target image.
  (ee.Dictionary) prev - The iteration dictionary containing state.

------------------------------------------------------------------------------

#### radcalbatch
(current, prev)

_Performs Relative Radiometric Normalization using orthogonal regression on the invariant pixels discovered by the iMAD algorithm. Crucial for harmonizing a time series of images to a single reference image._

##### Params:
  (ee.Image) current - The image to normalize.
  (ee.Dictionary) prev - The dictionary containing the reference image.

------------------------------------------------------------------------------

#### segmentation_snic
(image, size, compactness)

_Function to segment an image using the SNIC (Simple Non-Iterative Clustering) algorithm._

##### Params:
  (ee.Image) image - the input image.
  **optional** (number) size - The superpixel seed location spacing (default 10).
  **optional** (number) compactness - The compactness factor (default 1).

##### Usage:
```js
  var snic = geet.segmentation_snic(img, 15, 1);
```

------------------------------------------------------------------------------

#### obia_classification
(image, trainingData, fieldName, options)

_Function to perform a complete Object-Based Image Analysis (GEOBIA) classification._
_It automatically generates superpixels (SNIC), extracts spectral, spatial (geometry), and textural (GLCM) features per object, and classifies them using Machine Learning._

##### Params:
  (ee.Image) image - The raw input image to segment and classify.
  (ee.FeatureCollection) trainingData - The training samples.
  (string) fieldName - The class column name.
  **optional** (Object) options - Dictionary of OBIA parameters:
      {
         snicSize: 15,
         snicCompactness: 1,
         classifier: 'rf', // 'rf', 'cart', 'svm'
         includeTexture: false,
         includeGeometry: true,
         scale: 30
      }

##### Usage:
```js
  var obia_results = geet.obia_classification(img, samples, 'class', {
      snicSize: 20,
      includeGeometry: true,
      includeTexture: true,
      classifier: 'rf'
  });
  
  // Extract the final classified map
  var classified = obia_results.select('classification');
```

------------------------------------------------------------------------------

#### filter_small_objects
(image, minArea, maxSize)

_Eliminates small patches in a classified image (Minimum Mapping Unit filter) by replacing them with the most common neighboring class._

##### Params:
  (ee.Image) image - The classified image (single band).
  (number) minArea - The minimum area in square meters (e.g., 10000 for 1 hectare).
  **optional** (number) maxSize - The focal mode radius to fill gaps (default 50).

##### Usage:
```js
  // Filter out any object smaller than 1 hectare (10,000 sq meters)
  var cleaned_map = geet.filter_small_objects(classified, 10000);
```

------------------------------------------------------------------------------

#### harmonic_trend
(timeseries, dependent_band)

_Generates a Fourier Harmonic Trend model for a time-series to extract Seasonality (Phase and Amplitude) and Linear Trend._

##### Params:
  (ee.ImageCollection) timeseries - the input time-series image collection.
  (string) dependent_band - the band to model (e.g., 'NDVI').

##### Usage:
```js
  var trend = geet.harmonic_trend(landsat_ts, 'NDVI');
```

------------------------------------------------------------------------------

#### zonal_statistics
(image, featureCollection, reducerType, scale)

_Extracts zonal statistics from an image using polygons._

##### Params:
  (ee.Image) image - the input image.
  (ee.FeatureCollection) featureCollection - the polygon regions.
  (string) reducerType - 'max', 'min', 'mean', 'median', 'mode', 'sd', 'variance', 'sum'.
  **optional** (number) scale - the scale in meters (default 30).

##### Usage:
```js
  var stats = geet.zonal_statistics(ndvi_img, polygons, 'mean', 30);
```

------------------------------------------------------------------------------

#### harmonize_sensors
(image, source, target)

_Harmonizes spectral values between Sentinel-2 and Landsat-8 using OLS regression coefficients._

##### Params:
  (ee.Image) image - the input image.
  (string) source - 'S2' or 'L8'.
  (string) target - 'S2' or 'L8'.

##### Usage:
```js
  var harmonized = geet.harmonize_sensors(s2_img, 'S2', 'L8');
```

------------------------------------------------------------------------------

#### burn_severity
(pre_fire, post_fire, sensor)

_Calculates the Normalized Burn Ratio (NBR), Delta NBR (dNBR), and Burn Severity Classes._

##### Params:
  (ee.Image) pre_fire - the pre-fire image.
  (ee.Image) post_fire - the post-fire image.
  **optional** (string) sensor - 'L8', 'L9', 'S2', etc. (default 'L8').

##### Usage:
```js
  var severity = geet.burn_severity(img_before, img_after, 'L8');
```

------------------------------------------------------------------------------


------------------------------------------------------------------------------

### Deprecated Functions (Legacy Support)

_The following functions have been deprecated to streamline the GEET library. They are still exported as "stubs" that will throw an informative error if called, guiding legacy code users to the new, integrated functions._

- `build_annual_ls5_timeseries`, `build_annual_ls7_timeseries`, `build_annual_ls8_timeseries` -> **Replaced by:** `build_annual_landsat_timeseries(roi)`
- `landsat5_timeseries`, `landsat7_timeseries`, `landsat8_timeseries` -> **Replaced by:** `landsat_timeseries(sensor, type)`

_If your legacy scripts use any of these old functions, please update them to use the new integrated functions, which offer better performance, Collection 2 compliance, and support for newer sensors like Landsat 9._
