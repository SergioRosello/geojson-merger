window.onload = function () {
  var routeElement = document.getElementById("rutas");


  if (routeElement) {
    routeElement.addEventListener('change', mergeGeoJson);
  }
}

function mergeGeoJson(){
  var input = document.getElementById("rutas");
  console.log(input.files[0]);
  var mergedGeoJSON = merge(input);
  console.log(JSON.stringify(mergedGeoJSON));
}

function merge (inputs) {
  var output = {
    type: 'FeatureCollection',
    features: []
  };
  for (var i = 0; i < inputs.length; i++) {
    var normalized = normalize(inputs[i]);
    for (var j = 0; j < normalized.features.length; j++) {
      output.features.push(normalized.features[j]);
    }
  }
  return output;
}
var types = {
  Point: 'geometry',
  MultiPoint: 'geometry',
  LineString: 'geometry',
  MultiLineString: 'geometry',
  Polygon: 'geometry',
  MultiPolygon: 'geometry',
  GeometryCollection: 'geometry',
  Feature: 'feature',
  FeatureCollection: 'featurecollection'
};

/**
 * Normalize a GeoJSON feature into a FeatureCollection.
 *
 * @param {object} gj geojson data
 * @returns {object} normalized geojson data
 */
function normalize(gj) {
  if (!gj || !gj.type) return null;
  var type = types[gj.type];
  if (!type) return null;

  if (type === 'geometry') {
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: gj
      }]
    };
  } else if (type === 'feature') {
    return {
      type: 'FeatureCollection',
      features: [gj]
    };
  } else if (type === 'featurecollection') {
    return gj;
  }
}
