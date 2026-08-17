// ==============================================================================
// SCRIPT DE TESTE: Refatoração do GEET (GEE Code Editor)
// Copie e cole este script no Google Earth Engine Code Editor.
// Lembre-se de alterar o 'require' para o caminho do seu repositório local
// onde o geet.js atualizado foi salvo.
// ==============================================================================

// Importe a biblioteca GEET (substitua pelo seu repositório onde o código foi atualizado)
// Exemplo: var geet = require('users/eduardolacerdageo/geet:geet');
// Se estiver testando dentro do próprio arquivo geet.js (no final do arquivo), comente a linha abaixo.
var geet = require('users/eduardolacerdageo/geet:geet'); 

// Área de Interesse (ROI) - São Paulo (apenas como exemplo)
var roi = ee.Geometry.Point([-46.6333, -23.5505]).buffer(10000);
Map.centerObject(roi, 11);

// ==============================================================================
// 1. TESTANDO MOSAICOS (Usando a nova função genérica 'create_mosaic')
// ==============================================================================
print('--- Testando Mosaicos ---');

// Mosaico Landsat 8 (deve adicionar automaticamente no mapa)
var l8_mosaic = geet.create_mosaic('2023-01-01', '2023-12-31', roi, true, 'L8');
print('Mosaico Landsat 8:', l8_mosaic);

// Mosaico Sentinel-2 (deve adicionar automaticamente no mapa)
var s2_mosaic = geet.create_mosaic('2023-01-01', '2023-12-31', roi, true, 'S2');
print('Mosaico Sentinel-2:', s2_mosaic);

// ==============================================================================
// 2. TESTANDO TEMPERATURA DE BRILHO (Usando a nova função genérica 'brightness_temp')
// ==============================================================================
print('--- Testando Temperatura de Brilho ---');

// Carregar uma imagem crua (DN) Landsat 8 para teste
var img_l8_dn = ee.ImageCollection('LANDSAT/LC08/C02/T1')
                   .filterBounds(roi)
                   .filterDate('2023-01-01', '2023-12-31')
                   .sort('CLOUD_COVER')
                   .first();

// Primeiro passo obrigatório: Converter a banda Termal (B10) para Radiância TOA
var img_l8_rad = geet.toa_radiance(img_l8_dn, 10);

// Teste 1: Kelvin - Agora passando a imagem com a banda 'TOA_Radiance' para a função universal
var bt_kelvin = geet.brightness_temp(img_l8_rad, 'L8', 'K');
print('Landsat 8 - Temperatura de Brilho (Kelvin):', bt_kelvin.select('Brightness_Temperature'));
Map.addLayer(bt_kelvin.select('Brightness_Temperature'), {min: 280, max: 310, palette: ['blue', 'yellow', 'red']}, 'Temp Brilho L8 (K)', false);

// Teste 2: Celsius
var bt_celsius = geet.brightness_temp(img_l8_rad, 'L8', 'C');
print('Landsat 8 - Temperatura de Brilho (Celsius):', bt_celsius.select('Brightness_Temperature'));
Map.addLayer(bt_celsius.select('Brightness_Temperature'), {min: 15, max: 40, palette: ['blue', 'yellow', 'red']}, 'Temp Brilho L8 (C)', false);


// ==============================================================================
// 3. TESTANDO ÍNDICES LANDSAT E SENTINEL (Otimizados para Arrays)
// ==============================================================================
print('--- Testando Índices Espectrais ---');

// Imagens base (sem os índices)
var l8_base = ee.Image(l8_mosaic);
var s2_base = ee.Image(s2_mosaic);

// Teste A: Landsat com um Array de Índices (NDVI, EVI e NDWI)
var l8_indices = geet.landsat_indices(l8_base, 'L8', ['NDVI', 'EVI', 'NDWI']);
print('Landsat 8 (NDVI, EVI, NDWI):', l8_indices);
Map.addLayer(l8_indices.select('NDVI'), {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'NDVI L8', false);

// Teste B: Sentinel-2 com um Array de Índices (NDVI, SAVI e NDBI)
var s2_indices = geet.sentinel2_indices(s2_base, ['NDVI', 'SAVI', 'NDBI']);
print('Sentinel-2 (NDVI, SAVI, NDBI):', s2_indices);
Map.addLayer(s2_indices.select('SAVI'), {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'SAVI S2', false);

// Teste C: Landsat com String Simples (Apenas GLI)
var l8_gli = geet.landsat_indices(l8_base, 'L8', 'GLI');
print('Landsat 8 (String Simples - GLI):', l8_gli);

// Teste D: Sentinel-2 chamando TODOS os índices (undefined)
var s2_todos = geet.sentinel2_indices(s2_base);
print('Sentinel-2 (Todos os índices calculados):', s2_todos);

print('Todos os testes foram submetidos! Verifique o mapa e as propriedades no Console.');
