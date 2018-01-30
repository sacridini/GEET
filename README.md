# GEET (Google Earth Engine Toolbox)
## Introduction:
The Google Earth Engine Toolbox (GEET) is a JavaScript single-file public domain (or MIT licensed) library for help developers to write small code base application with the Google Earth Engine (GEE) plataform.

The library also can be used to teach new developers to use the plataform even wihtout any previous programming skills.

![ndvi](https://user-images.githubusercontent.com/7756611/28606761-031da9b8-71af-11e7-8e4a-3a716e8a9886.jpg)

## Documentation: 
All functions implemented (Version 1.7 - Beta):
[svm](#svm), [cart](#cart), [rf](#rf), [kmeans](#kmeans), [simpleNDVIChangeDetection](#simplendvichangedetection), [simpleNDWIChangeDetection](#simplendwichangedetection), [simpleNDBIChangeDetection](#simplendbichangedetection), [texture](#texture), [majority](#majority), [color](#color), [plotRGB](#plotrgb), [plotNDVI](#plotndvi), [plotNDWI](#plotndwi), [plotClass](#plotclass), [landsatIndices](#landsatindices), [sentinel2Indices](#sentinel2indices), [loadImg](#loadimg), [toaRadiance](#toaradiance), [toareflectance](#toareflectance), [toaReflectanceL8](#toareflectancel8), [brightnessTempL5_K](#brightnesstempl5_k), [brightnessTempL5_C](#brightnesstempl5_c), [brightnessTempL7_K](#brightnesstempl7_k), [brightnessTempL7_C](#brightnesstempl7_c), [brightnessTempL8_K](#brightnesstempl8_k), [brightnessTempL8_C](#brightnesstempl8_c), [resample](#resample), [resampleBand](#resampleband), [loadS2ById](#loads2byid), [s2Mosaic](#s2mosaic), [landsat5Mosaic](#landsat5mosaic), [landsat7Mosaic](#landsat7mosaic), [landsat8Mosaic](#landsat8mosaic), [modisNdviMosaic](#modisndvimosaic), [max](#max), [min](#min), [ndviL5](#ndvil5), [ndviL7](#ndvil7), [ndviL8](#ndvil8), [ndviS2](#ndvis2), [propVeg](#propveg), [landSurfaceEmissivity](#landsurfaceemissivity), [landSurfaceTemperature](#landsurfacetemperature), [exportImg](#exportimg), [pca](#pca)


------------------------------------------------------------------------------

### Quickstart Guide:
### (English)
To use the library you need to click on this [link](https://code.earthengine.google.com/?accept_repo=users/elacerda/geet). It will automatically add all the code of the library in your Google Earth Engine personal account. You only need to perform this procedure once. Remember that to add the library you must already have an account on the Earth Engine platform. To know more, visit the official site of the platform: https://earthengine.google.com/ 

After adding the library you can call its functions using the function **_require_** and storing the content in a variable. In this case, we will create a variable called **_geet_** which contains all the contents of the library. Then we can use it to call library functions: 

```js 
    var geet = require('users/elacerda/geet:geet'); 
    var image = geet.loadImg('TOA', 2015); // Returns and loads an image on the map.
```

### (Português)
Para utilizar a biblioteca é preciso clicar neste [link](https://code.earthengine.google.com/?accept_repo=users/elacerda/geet). Ele adicionará automaticamente todo o código da biblioteca na sua conta pessoal do Google Earth Engine. Só é necessário realizar este procedimento uma única vez. Lembre-se que para adicionar a biblioteca é necessário já possuir uma conta na plataforma do Earth Engine. Para saber mais, visite o site oficial da plataforma: https://earthengine.google.com/  

Depois de adicionar a biblioteca é possível chamar suas funções utilizando a função **_require_** e armazenando o conteúdo em uma variável. Neste caso, criaremos uma variável chamada **_geet_** que contém todo o conteúdo da biblioteca. Depois, podemos utilizar ela para chamar as funções da biblioteca:

```js 
    var geet = require('users/elacerda/geet:geet'); 
    var image = geet.loadImg('TOA', 2015); // Retorna e carrega no mapa uma imagem.
```

------------------------------------------------------------------------------

### References:

#### svm
(image, trainingData, fieldName, kernelType) 

_Function to apply SVM classification to a image._  

##### Params:
  (ee.Image) image - The input image to classify.    
  (ee.List) trainingData - Training data (samples).      
  **optional** (string) fieldName - The name of the column that contains the class names.      
  **optional** (string) kernelType - the kernel type of the classifier.     
  
##### Usage:
```js 
    var imgClass = geet.svm(image, samplesfc, landcover);   
```
    
------------------------------------------------------------------------------

#### cart
(image, trainingData, fieldName)  

_Function to apply CART classification to a image._

##### Params:
  (ee.Image) image - The input image to classify.       
  (ee.List) trainingData - Training data (samples).     
  **optional** (string) fieldName - The name of the column that contains the class names.       
  
##### Usage:
```js 
    var imgClass = geet.cart(image, samplesfc, landcover);    
```

------------------------------------------------------------------------------

#### rf
(image, trainingData, fieldName, numOfTrees)  

_Function to apply Random Forest classification to an image._ 

##### Params:
  (ee.Image) image - The input image to classify.   
  (ee.List) trainingData - Training data (samples).   
  (string) fieldName - the name of the column that contains the class names.   
  **optional** (ee.Number) numOfTrees - the number of trees that the model will create.         
  
##### Usage:
```js
    var imgClass = geet.rf(image, samplesfc, landcover, 10);   
```
  
 ------------------------------------------------------------------------------
 
#### kmeans 
(image, roi, numClusters, scale, numPixels)  

_Function to apply RandomForest classification to an image._  

##### Params:
  (ee.Image) image - The input image to classify.     
  (list) roi - Coordenates or just a polygon of the sample area.   
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
  
#### simpleNDVIChangeDetection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDVI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndviChange, 3, 'change_detection');_ 

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
   
#### simpleNDWIChangeDetection
(img1, img2, sensor, threshold) 

_Function to detect changes between two input images using the NDWI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndwiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.            
  
##### Usage:
```js    
    var ndwiChange = geet.simpleNDWIChangeDetection( image_2014, image_2015, 'L8', 0.5);  
```
    
------------------------------------------------------------------------------

#### simpleNDBIChangeDetection
(img1, img2, sensor, threshold)  

_Function to detect changes between two input images using the NDBI index and a threshold paramter. The function adds the two masked indices and return the sum of the two. Its a good choice to call the plotClass function to visualize the result. Ex: geet.plotClass(ndbiChange, 3, 'change_detection');_ 

##### Params:
  (string) sensor = The name of the sensor that will be used. 'L5' or 'L8.  
  (ee.Image) img1 = The first input image.  
  (ee.Image) img2 = The second input image.  
  (ee.Number) threshold = The number of the threshold. All the values at the 
                          image that is gte (grater of equal) to this number 
                          will be selected.                  
  
##### Usage:
```js
    var ndbiChange = geet.simpleNDBIChangeDetection(image_2014, image_2015, 'L8', 0.5);  
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
(_color)  

_Function to return a valid color value from the object COLOR._ 

##### Params:
  (string) color - the name of the desired color. Valid options are water, 
                   forest, pasture, urban, shadow or null.                     
  
##### Usage:
```js 
    geet.color('water');  
```

------------------------------------------------------------------------------

#### plotRGB
(image, title)  

_Function to plot a RGB image._ 

##### Params:
  (ee.Image) image - the image to display.  
  **optional** (string) title - the layer title.                   
  
##### Usage:
```js
        
    geet.plotRGB(image, 'rgb_image');  
```
  
------------------------------------------------------------------------------

#### plotNDVI
(image, title)  

_Function to plot a NDVI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                   
  
##### Usage:
```js
    geet.plotNDVI(ndvi, 'ndvi_image'); 
```

------------------------------------------------------------------------------

#### plotNDWI
(image, title)  

_Function to plot a NDWI image index._ 

##### Params:
  (ee.Image) image - the image to display.  
  (string) title - the layer title.                     
  
##### Usage:
```js
    geet.plotNDWI(ndwi, 'ndwi_image'); 
```

------------------------------------------------------------------------------

#### plotClass
(image, numClasses, title)  

_Function to plot the final classification map._ 

##### Params:
  (ee.Image) image - the image to process.  
  (number) numClasses - the number of classes that your classification map has. It variates from 2 to 5 max classes only.  
  **optional** (string) title - the layer title.                       
  
##### Usage:
```js
    geet.plotClass(classified, 4, 'class_final'); 
```
 
------------------------------------------------------------------------------

#### landsatIndices  
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
    var result = geet.landsatIndices(image, 'L5'); // Will create all possible indices.  
```
 

  or specifying the index to generate:

```js 
    var result = geet.landsatIndices(image, 'L5', 'savi'); // This will create only SAVI.    
```

------------------------------------------------------------------------------

#### sentinel2Indices
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
    var result = geet.sentinel2Indices(image); // Will create all possible indices.  
```
 

  or specifying the index to generate:

```js 
    var result = geet.sentinel2Indices(image, 'savi'); // This will create only SAVI.    
```

------------------------------------------------------------------------------

#### loadImg
(collection, year, roi, title)  

_Function to get an example image to debug or test some code._     

##### Params:
  **optional** (string) collection - the type of the collection that will be filtered: RAW, TOA or SR.  
  **optional** (number) year - the year of the image that you want to get.  
  **optional** (list) roi - the latitude and longitude of a roi.  
  **optional** (string) title - the title of the plotted image.                          
  
##### Usage:
```js 
    var image = geet.loadImg(); // Returns a TOA image   
```


  or

```js
    var image = geet.loadImg('SR', 2015); // Returns a SR image   
```

------------------------------------------------------------------------------

#### toaRadiance
(image, band)  

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Radiance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                        
  
##### Usage:
```js
    var new_toa_radiance = geet.toaRadiance(img, 10); // ee.Image    
```
  

#### Information:
  Formula:     **_Lλ = MLQcal + AL_**  
  Lλ           = TOA spectral radiance (Watts/( m2 * srad * μm))    
  ML           = Band-specific multiplicative rescaling factor from the metadata (RADIANCE_MULT_BAND_x, where x is the band number)  
  AL           = Band-specific additive rescaling factor from the metadata (RADIANCE_ADD_BAND_x, where x is the band number)  
  Qcal         = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### toaReflectance
(image, band)  
_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.                         
  
##### Usage:
```js   
    var new_toa_reflectance = geet.toaReflectance(img, 10); // ee.Image    
```

#### Information:
  Formula:      **_ρλ' = MρQcal + Aρ_**  
  ρλ'           = TOA planetary reflectance, without correction for solar angle.  Note that ρλ' does not contain a correction for the sun angle.  
  Mρ            = Band-specific multiplicative rescaling factor from the metadata (REFLECTANCE_MULT_BAND_x, where x is the band number)  
  Aρ            = Band-specific additive rescaling factor from the metadata (REFLECTANCE_ADD_BAND_x, where x is the band number)  
  Qcal          = Quantized and calibrated standard product pixel values (DN)  

------------------------------------------------------------------------------

#### toaReflectanceL8
(image, band, _solarAngle)  

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance Landsat 8 version with Solar Angle correction._       

##### Params:
  (ee.Image) image - The image to process.  
  (number) band - The number of the band that you want to process.  
  (string) solarAngle - The solar angle mode. 'SE' for local sun elevation angle and 'SZ' for local solar zenith angle.                       
  
##### Usage:
```js
    var new_toa_reflectance_sz = geet.toaReflectanceL8(img, 10, 'SZ'); // ee.Image   
```


  or

```js
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

#### brightnessTempL5_K
(image)  

_Function to do a band conversion of digital numbers (DN) to Top of Atmosphere (TOA) Reflectance._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                        
  
##### Usage:  
```js
    var brightness_temp_img = geet.brightnessTempL5_K(toa_image); // ee.Image  
```
     

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### brightnessTempL5_C
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 5 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                          
  
##### Usage:
```js   
    var brightness_temp_img = geet.brightnessTempL5_C(toa_image); // ee.Image    
```   

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)   

------------------------------------------------------------------------------

#### brightnessTempL7_K
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 7 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.                            
  
##### Usage:
```js    
    var brightness_temp_img = geet.brightnessTempL7_K(toa_image); // ee.Image      
```   

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)    

------------------------------------------------------------------------------

#### brightnessTempL7_C
(image)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 7 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.  
                               
  
##### Usage:
```js  
    var brightness_temp_img = geet.brightnessTempL7_C(toa_image); // ee.Image  
```   


#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### brightnessTempL8_K
(image, single)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 8 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.   
  (boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!                             
  
##### Usage:
```js 
    var brightness_temp_img = geet.brightnessTempL8_K(toa_image); // ee.Image      
``` 

or

 ```js
    var brightness_temp_img = geet.brightnessTempL8_K(toa_image, false); // ee.Image    
``` 

#### Information:
  T           = Top of atmosphere brightness temperature (K)  
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))  
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)  
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)

------------------------------------------------------------------------------

#### brightnessTempL8_C
(image, single)  

_Function to convert the Top of Atmosphere image to Top of Atmosphere Brightness Temperature. This one works only for Landsat 8 data._     

##### Params:
  (ee.Image) image - the Top of Atmosphere (TOA) image to convert.   
  (boolean) single - if false, will process only the B10 band, if true, will consider B11 too. Default its true!                             
  
##### Usage:
```js  
    var brightness_temp_img = geet.brightnessTempL8_C(toa_image); // ee.Image  
``` 

or

 ```js
    var brightness_temp_img = geet.brightnessTempL8_C(toa_image, false); // ee.Image   
``` 

#### Information:
  T           = Top of atmosphere brightness temperature (K)    
  Lλ          = TOA spectral radiance (Watts/( m2 * srad * μm))    
  K1          = Band-specific thermal conversion constant from the metadata (K1_CONSTANT_BAND_x, where x is the thermal band number)    
  K2          = Band-specific thermal conversion constant from the metadata (K2_CONSTANT_BAND_x, where x is the thermal band number)  

------------------------------------------------------------------------------

#### resample
(image, scaleNumber)  

_Function to resample an input image._     

##### Params:
  (ee.Image) image - the image to resample.  
  (number) scaleNumber - the number of the spatial resolution that you
                        want to use to  resample the input image.                            
  
##### Usage:
```js
    var landsat_10m = geet.resample(L8_img, 10);      
``` 

------------------------------------------------------------------------------

#### resampleBand
(band, scaleNumber)  

_Function to resample just a single band._     

##### Params:
  (ee.Image) band - the band to resample.  
  (number) scaleNumber - the number of the spatial resolution that you
                        want to use to  resample the input band.                           
  
##### Usage:
```js
    var landsatB10_60m = geet.resampleBand(b10, 60);  
```

------------------------------------------------------------------------------

#### loadS2ById
(id)  

_Function to filter the Sentinel-2 collection by Product ID obtained from the Copernicus Open Access Hub._     

##### Params:
  (string) id - the id of the Sentinel 2 image.                            
  
##### Usage:
```js
    var s2_image = geet.loadS2ById('S2A_MSIL1C_20170512T093041_N0205_R136_T34TDN_20170512T093649');  
```

------------------------------------------------------------------------------

#### s2Mosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Sentinel 2 dataset._     

##### Params:
  (string) startDate - the start date of the dataset.  
  (string) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                             
  
##### Usage:
```js  
    var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31'); // Display the final world mosaic.  
```

or

```js   
    var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31', roi); // Display the final mosaic of the roi  
```

or 

```js 
    var s2_mosaic = geet.s2Mosaic('2016-01-01', '2016-12-31', roi, false); // Doesnt display the mosaic  
```

------------------------------------------------------------------------------

#### landsat5Mosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 5 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l5_mosaic = geet.landsat5Mosaic('2005-01-01', '2005-12-31'); // Display the final world mosaic. 
```

or

```js
    var l5_mosaic = geet.landsat5Mosaic(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l5_mosaic = geet.landsat5Mosaic('2005-01-01', '2005-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### landsat7Mosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 7 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l7_mosaic = geet.landsat7Mosaic('2003-01-01', '2003-12-31'); // Display the final world mosaic. 
```

or

```js
    var l7_mosaic = geet.landsat7Mosaic(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l7_mosaic = geet.landsat7Mosaic('2003-01-01', '2003-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### landsat8Mosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free mosaic using the Landsat 8 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var l8_mosaic = geet.landsat8Mosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic. 
```

or

```js
    var l8_mosaic = geet.landsat8Mosaic(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var l8_mosaic = geet.landsat8Mosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### modisNdviMosaic
(startDate, endDate, roi, showMosaic)  

_Function to build a cloud free NDVI mosaic using the MODIS/MOD13Q1 dataset._     

##### Params:
  (ee.Date) startDate - the start date of the dataset.  
  (ee.Date) endDate - the end date of the dataset.  
  **optional** (ee.Geometry) roi - the Region of Interest to filter the dataset.  
  **optional** (bool) _showMosaic - set to false if you dont want to display the mosaic. Default is true.                               
    
##### Usage:
```js
    var modis_ndvi_mosaic = geet.modisNdviMosaic('2015-01-01', '2015-12-31'); // Display the final world mosaic. 
```

or

```js
    var modis_ndvi_mosaic = geet.modisNdviMosaic(start, finish, roi); // Display the final mosaic of the roi
```

or 

```js
    var modis_ndvi_mosaic = geet.modisNdviMosaic('2015-01-01', '2015-12-31', roi, false); // Doesnt display the mosaic
```

------------------------------------------------------------------------------

#### max
(image)  

_Function the get the maximum value from an image._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var img_max = geet.max(img);     
```

------------------------------------------------------------------------------

#### min
(image)  

_Function the get the minimum value from an image._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var img_max = geet.min(img);    
```

------------------------------------------------------------------------------

#### ndviL5 
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 5 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l5_ndvi = geet.ndviL5(img);  
```

------------------------------------------------------------------------------

#### ndviL7
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 7 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l7_ndvi = geet.ndviL7(img);  
```

------------------------------------------------------------------------------

#### ndviL8
(image)  

_Function calculate the normalized difference vegetation index (NDVI) from Landsat 8 data._     

##### Params:
  (ee.Image) image - the input image.                             
  
##### Usage:
```js
    var l8_ndvi = geet.ndviL8(img);  
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

#### propVeg
(image)  

_Function calculate the proportional vegetation._     

##### Params:
  (ee.Image) image - input image with the NDVI band.                              
  
##### Usage:
```js
    var img_pv = geet.propVeg(img);
```

------------------------------------------------------------------------------

#### landSurfaceEmissivity
(image)  

_Function calculate the surface emissifity._     

##### Params:
  (ee.Image) image - input image with the proportional vegetation band.                            
  
##### Usage:
```js
    var lse = geet.landSurfaceEmissivity(pv);
```

------------------------------------------------------------------------------

#### landSurfaceTemperature
(image)  

_Function calculate the land surface temperature._     

##### Params:
  (ee.Image) image - the input image with the TOA_Radiance, Brightness_Temperature,
                     NDVI, PropVeg and LSE bands.                            
  
##### Usage:
```js
    var surfTemp_img = geet.landSurfaceTemperature(img);
```

------------------------------------------------------------------------------

#### exportImg
(image, outFilename, scale, maxPixels)  

_Function to export an image to your Google Drive account._     

##### Params:
  (ee.Image) image - the input image.  
  (string) outFilename - the name of the output file that will be exported.  
  **optional** (number) _scale - the scale number.The scale is related to the spatial resolution of the image. Landsat is 30, so the default is 30 also.  
  **optional** (number) _maxPixels - the number of maximun pixels that can be exported. Default is 1e12.                            
  
##### Usage:
```js
    geet.exportImg(img, 'output_classification');
```

or

```js
    geet.exportImg(img, 'output_sentinel2_classification', 10);
```

or 

```js
    geet.exportImg(img, 'output_sentinel2_classification', 10, 1e13);
```

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
