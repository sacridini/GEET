// ==============================================================================
// SCRIPT DE TESTE: Novas Funcionalidades do GEET (GEE Code Editor)
// Copie e cole este script no Google Earth Engine Code Editor.
// Lembre-se de alterar o 'require' para o caminho do seu repositório local
// onde o geet.js atualizado foi salvo.
// ==============================================================================

var geet = require('users/eduardolacerdageo/geet:geet'); 

// Área de Interesse (ROI) - Região com relevo e água (ex: Represa de Furnas, MG)
var roi = ee.Geometry.Point([-46.10, -20.65]).buffer(15000);
Map.centerObject(roi, 11);

print('Iniciando bateria de testes das novas funções...');

// ==============================================================================
// 1. TESTANDO RADAR (Sentinel-1) & FILTRO SPECKLE
// ==============================================================================
print('--- Testando Radar (S1) ---');

// Pré-processamento S1 (Mosaico VV, Descending)
var s1_mosaic = geet.s1_preprocess('2023-05-01', '2023-05-31', roi, 'VV', 'DESCENDING');
print('Mosaico Sentinel-1 (VV):', s1_mosaic);
Map.addLayer(s1_mosaic, {min: -25, max: 0}, 'S1 Original (VV)', false);

// Aplicando filtro Speckle (Raio de 50 metros)
var s1_smooth = geet.speckle_filter(s1_mosaic, 50);
print('Mosaico Sentinel-1 (Suavizado):', s1_smooth);
Map.addLayer(s1_smooth, {min: -25, max: 0}, 'S1 Suavizado (Filtro Speckle)', false);


// ==============================================================================
// 2. TESTANDO ANÁLISE DE TERRENO (Topografia via SRTM)
// ==============================================================================
print('--- Testando Topografia ---');

// Extração automática de Elevação, Declividade, Aspecto e Hillshade
var terrain = geet.terrain_analysis(roi);
print('Bandas de Terreno geradas:', terrain);

Map.addLayer(terrain.select('Elevation'), {min: 700, max: 1200, palette: ['blue', 'green', 'yellow', 'red']}, 'Elevação (SRTM)', false);
Map.addLayer(terrain.select('Slope'), {min: 0, max: 45, palette: ['white', 'black']}, 'Declividade (Slope)', false);
Map.addLayer(terrain.select('Hillshade'), {min: 0, max: 255}, 'Relevo Sombreado (Hillshade)', false);


// ==============================================================================
// 3. TESTANDO ÍNDICES DE ÁGUA AVANÇADOS (Sentinel-2)
// ==============================================================================
print('--- Testando Índices Hídricos ---');

// Criar um mosaico rápido do Sentinel-2 para testar a água
var s2_mosaic = geet.create_mosaic('2023-01-01', '2023-12-31', roi, false, 'S2');

// Aplicar cálculo de Turbidez (NDTI) e Clorofila (NDCI)
var water_img = geet.water_indices(s2_mosaic, 'S2');
print('Imagem com Índices Hídricos (NDTI, NDCI):', water_img);

Map.addLayer(water_img.select('NDTI'), {min: -0.2, max: 0.2, palette: ['cyan', 'blue', 'green', 'yellow']}, 'NDTI (Turbidez da Água)', false);


// ==============================================================================
// 4. TESTANDO SÉRIES TEMPORAIS (Filtro de Média Móvel / Smoothing)
// ==============================================================================
print('--- Testando Smoothing de Séries Temporais ---');

// Vamos criar uma coleção crua do Sentinel-2 (6 meses) e aplicar o NDVI em todas as imagens
var s2_col = ee.ImageCollection('COPERNICUS/S2')
               .filterBounds(roi)
               .filterDate('2023-01-01', '2023-06-30')
               .map(function(img) {
                   return geet.sentinel2_indices(img, 'NDVI');
               });

print('Coleção Original (Tamanho):', s2_col.size());

// Aplicar o Smoothing Temporal usando uma janela de 45 dias
var s2_smooth_col = geet.smooth_timeseries(s2_col, 45);

print('Coleção Suavizada Temporalmente (Janela 45 dias):', s2_smooth_col);

// Plotar um gráfico de série temporal comparando o NDVI Original vs Suavizado
var point = ee.Geometry.Point([-46.10, -20.65]); // Ponto qualquer na ROI

var chartOriginal = ui.Chart.image.series(s2_col.select('NDVI'), point, ee.Reducer.mean(), 30)
    .setOptions({title: 'Série Temporal de NDVI (Original)'});
print(chartOriginal);

var chartSmooth = ui.Chart.image.series(s2_smooth_col.select('NDVI'), point, ee.Reducer.mean(), 30)
    .setOptions({title: 'Série Temporal de NDVI (Suavizada)'});
print(chartSmooth);

print('Todos os testes foram concluídos!');
