

//https://code.earthengine.google.com/7c9656c904f6388da405f3a5c9eac640
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = { 
    'mapbiomas': {
        'min': 0, 
        'max': 62,  
        'palette': palettes.get('classification7')
    },
    'points': {
        color: '#FF7803',
    },
    'maskAfloramento': {
        min: 0,
        max: 1,
        palette: ['FFFFFF','FE9929']
    },
    'visMosaic': {
        min: 0,
        max: 2000,
        bands: ['red_median', 'green_median', 'blue_median']
    },
    mosaicNorm: {
        bands: ['red_median', 'green_median', 'blue_median'],
        min: 0.02, 
        max: 0.8
    },
    indexRock: {
        min: 0,
        max: 1,
        palette: [
            "41ab5d","78c679","addd8e","d9f0a3","f7fcb9","ffffe5","ffffe5",
            "fff7bc","fee391","fec44f","fe9929","ec7014","cc4c02","8c2d04"
        ]
    },
    indexVeg: {
        min: 0,
        max: 1,
        palette: [
            "ffffe5","f7fcb9","d9f0a3","addd8e","78c679","41ab5d","238443","005a32"
        ]
    },
    indexSlope: {
        min: 0,
        max: 1,
        palette: [
            "252525","525252","737373","969696","bdbdbd","d9d9d9","f0f0f0","ffffff"
        ]
    }
};

// Bare Soil Index 
var agregateBandsIndexBSI = function(img){  
     
    var bsiImgY = img.expression(
        "float(((b('swir1_median') - b('red_median')) - (b('nir_median') + b('blue_median'))) / ((b('swir1_median') + b('red_median')) + (b('nir_median') + b('blue_median'))))")
            .add(1).divide(2).rename(['bsi_median']).toFloat()
    var bsiImgwet = img.expression(
        "float(((b('swir1_median_wet') - b('red_median_wet')) - (b('nir_median_wet') + b('blue_median_wet'))) / ((b('swir1_median_wet') + b('red_median_wet')) + (b('nir_median_wet') + b('blue_median_wet'))))")
            .add(1).divide(2).rename(['bsi_median_wet']).toFloat()

    var bsiImgdry = img.expression(
        "float(((b('swir1_median_dry') - b('red_median_dry')) - (b('nir_median_dry') + b('blue_median_dry'))) / ((b('swir1_median_dry') + b('red_median_dry')) + (b('nir_median_dry') + b('blue_median_dry'))))")
            .add(1).divide(2).rename(['bsi_median_dry']).toFloat()
            
    
    return img.addBands(bsiImgY).addBands(bsiImgwet).addBands(bsiImgdry)

}


// SAVI OSAVI	Optimized Soil-Adjusted Vegetation Index	vegetation	(N - R) / (N + R + 0.16)
var agregateBandsIndexSAVI =  function(img){
    var saviImgY = img.expression(
        "float((b('nir_median') - b('red_median')) / (b('nir_median') + b('red_median') + 0.16))")
           .add(1).divide(2).rename(['savi_median']).toFloat() 
    var saviImgWet = img.expression(
        "float((b('nir_median_wet') - b('red_median_wet')) / (b('nir_median_wet') + b('red_median_wet') + 0.16))")
           .add(1).divide(2).rename(['savi_median_wet']).toFloat() 

    var saviImgDry = img.expression(
        "float((b('nir_median_dry') - b('red_median_dry')) / (b('nir_median_dry') + b('red_median_dry') + 0.16))")
           .add(1).divide(2).rename(['savi_median_dry']).toFloat()         
    
    return img.addBands(saviImgY).addBands(saviImgWet).addBands(saviImgDry)

    }

// Host Rocks - SWIR1/SWIR2
var agregateBandsIndexhostyocks = function(img){    
    var hostRockImgY = img.expression(
        "float(b('swir1_median')  / b('swir2_median'))")
           .rename(['HR_median']).toFloat() 
    var hostRockImgWet = img.expression(
        "float(b('swir1_median_wet')  / b('swir2_median_wet'))")
           .rename(['HR_median_wet']).toFloat()

    var hostRockImgDry = img.expression(
        "float(b('swir1_median_dry')  / b('swir2_median_dry'))")
           .rename(['HR_median_dry']).toFloat()         
    
    return img.addBands(hostRockImgY).addBands(hostRockImgWet).addBands(hostRockImgDry)
}

// Ferrous Rocks - SWIR1/NIR
var agregateBandsIndexFerrRocks = function(img){
    var ferrRockImgY = img.expression(
        "float(b('swir1_median')  / b('nir_median'))")
           .rename(['FR_median']).toFloat() 

    var ferrRockImgWet = img.expression(
        "float(b('swir1_median_wet')  / b('nir_median_wet'))")
           .rename(['FR_median_wet']).toFloat() 
             
    var ferrRockImgDry = img.expression(
        "float(b('swir1_median_dry')  / b('nir_median_dry'))")
           .rename(['FR_median_dry']).toFloat() 
    
    return img.addBands(ferrRockImgY).addBands(ferrRockImgWet).addBands(ferrRockImgDry)
};

// Eisenhydroxid-Index - SWIR2/RED
var agregateBandsIndexEisenIndex = function(img){
    
    var eisenIndexImgY = img.expression(
        "float(b('swir2_median')  / b('red_median'))")
           .rename(['EI_median']).toFloat()        

    var eisenIndexImgWet = img.expression(
        "float(b('swir2_median_wet')  / b('red_median_wet'))")
           .rename(['EI_median_wet']).toFloat()  
    
    var eisenIndexImgDry = img.expression(
        "float(b('swir2_median_dry')  / b('red_median_dry'))")
           .rename(['EI_median_dry']).toFloat()  
    
    return img.addBands(eisenIndexImgY).addBands(eisenIndexImgWet).addBands(eisenIndexImgDry)
}


// 
var CalculateIndiceAllinOne = function(imageW){
    
    imageW = agregateBandsIndexSAVI(imageW)
    imageW = agregateBandsIndexBSI(imageW)
    imageW = agregateBandsIndexhostyocks(imageW)
    imageW = agregateBandsIndexFerrRocks(imageW)
    imageW = agregateBandsIndexEisenIndex(imageW)
    
    return imageW
};

var featuresreduce = [
    'blue_median', 'blue_median_wet', 'blue_median_dry',  
    'green_median', 'green_median_dry', 'green_median_wet',
    'red_median', 'red_median_dry', 'red_median_wet', 
    'nir_median', 'nir_median_dry',  'nir_median_wet',
    'swir1_median', 'swir1_median_dry', 'swir1_median_wet',
    'swir2_median', 'swir2_median_wet', 'swir2_median_dry', 
    'evi2_median', 'evi2_median_dry', 'evi2_median_wet', 
    'savi_median_dry', 'gcvi_median_dry', 
    'slope'
]
var assetStast = 'projects/mapbiomas-workspace/AMOSTRAS/col8/CAATINGA/ROIs/stats_mosaics/all_statisticsL81985';
var inputAsset = 'projects/mapbiomas-workspace/AMOSTRAS/col8/CAATINGA/POS-CLASS/toExp';
var assetMosaic = 'projects/nexgenmap/MapBiomas2/LANDSAT/BRAZIL/mosaics-2';
var assetAreas = 'projects/mapbiomas-workspace/AMOSTRAS/col8/CAATINGA/AFLORAMENTO/shp_areas_para_cluster';
var lst_years = [
  '1985','1986','1987','1988','1989','1990','1991','1992','1993','1994',
  '1995','1996','1997','1998','1999','2000','2001','2002','2003','2004',
  '2005','2006','2007','2008','2009','2010','2011','2012','2013','2014',
  '2015','2016','2017','2018','2019','2020','2021'
];
var yearMosaic = 2020;
var imgMaps = ee.ImageCollection(inputAsset).filter(
                          ee.Filter.eq('version', '3'))

print("imagens mapas ", imgMaps);
var geom = imgMaps.first().geometry();
var Region = areaCluster.bounds()
var featColStast = ee.FeatureCollection(assetStast);
print(featColStast.first());

var imagens_mosaic = ee.ImageCollection(assetMosaic).filter(
                                ee.Filter.eq('biome', 'CAATINGA'))
                                    .filterBounds(areaCluster).filter(
                                        ee.Filter.eq('year', yearMosaic))
                                        .select(featuresreduce)                                        
                                        //.mosaic().clip(areaCluster.bounds());        

var imgMapAflor = ee.Image.constant(0).clip(geom);
lst_years.forEach(function(yyear){
    var nameImg = 'CAATINGA-' + yyear + '-3';
    var imMapYY = ee.Image(inputAsset + '/'+ nameImg).eq(29);
    imgMapAflor = imgMapAflor.add(imMapYY);
})

var normalizeImg_porBanda = function(imCol, featSt){
    var newImgCol = imCol.map(function(img){
                        var idIm = img.id();
                        var imgNormal = img.addBands(ee.Image.constant(1));
                        imgNormal = imgNormal.select(['constant']);
                        var bandMos = [
                              'blue_median', 'blue_median_wet', 'blue_median_dry', 
                              'green_median', 'green_median_dry', 'green_median_wet',
                              'red_median', 'red_median_dry', 'red_median_wet',  
                              'nir_median', 'nir_median_dry', 'nir_median_wet',  
                              'swir1_median', 'swir1_median_dry', 'swir1_median_wet', 
                              'swir2_median', 'swir2_median_wet', 'swir2_median_dry'
                          ];

                        bandMos.forEach(function(bnd){
                            var bndMed = bnd + '_mean';
                            var bndStd = bnd + '_stdDev';
                            var band_tmp = img.select(bnd);
                            //  calcZ = (arrX - xmean) / xstd;
                            var calcZ = band_tmp.subtract(ee.Image.constant(featSt.get(bndMed)))
                                              .divide(ee.Image.constant(featSt.get(bndStd)));
                            //     expBandAft =  np.exp(-1 * calcZ)
                            var expBandAft = calcZ.multiply(ee.Image.constant(-1)).exp();
                            //     return 1 / (1 + expBandAft)
                            var bndend = expBandAft.add(ee.Image.constant(1)).pow(ee.Image.constant(-1));
                            imgNormal = imgNormal.addBands(bndend.rename(bnd));
                        });
                        imgNormal = imgNormal.select(bandMos).toFloat();
                        imgNormal = CalculateIndiceAllinOne(imgNormal);

                        return imgNormal.addBands(img.select('slope').divide(1000).rename('slope')).clip(Region);
                    });
                    
    return newImgCol;
};

var featFiltered = featColStast.filterBounds(imagens_mosaic.first().geometry()).first();
print("statistic selected ", featFiltered);
print("loading Image Collection ", imagens_mosaic)
var imgColNorm = normalizeImg_porBanda(imagens_mosaic, featFiltered);
imgColNorm = imgColNorm.mosaic();
var vCluster = 1;
// Processso de clusters
var pmtsImg = {
    region: areaCluster, // área de amostragem
    scale: 30,
    numPixels: 10000,
    //factor: 0.2 // porcentagems de pixels na image
}
// Feature com todas as 100000 amostras aleatorias
var ROI = imgColNorm.sample(pmtsImg)

// <var nomeCluster = ee.Clusterer.wekaFunçãoCluster(parámetrosCluster).train(nomeVarTraining)>
var pmtClustCas = {
    minClusters: 2,
    maxClusters: 3,
    distanceFunction: 'Manhattan',
    maxIterations: 150
}
var CKMeans = ee.Clusterer.wekaCascadeKMeans(pmtClustCas).train(ROI)

var ImgClustCKM = imgColNorm.cluster(CKMeans,'CKMeans');

Map.addLayer(imgColNorm, vis.mosaicNorm, 'mosaicNorma');
Map.addLayer(imgColNorm.select('slope'), vis.indexSlope, 'slope', false);
Map.addLayer(imgColNorm.select('savi_median'), vis.indexVeg, 'SAVI', false);
Map.addLayer(imgColNorm.select('HR_median'), vis.indexRock, 'HR_m', false);
Map.addLayer(imgColNorm.select('FR_median'), vis.indexRock, 'FR_m', false);
Map.addLayer(imgColNorm.select('EI_median'), vis.indexRock, 'EI_m', false);
Map.addLayer(imgMapAflor.selfMask(), {min:0, max: 1}, 'afloramento Col8');
Map.addLayer(ImgClustCKM.randomVisualizer(), {}, 'Kmeans', false)
Map.addLayer(ImgClustCKM.eq(vCluster).selfMask(), vis.maskAfloramento, 'AflorCluster');
