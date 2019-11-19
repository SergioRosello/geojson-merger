var text = [];
window.onload = function () {
  document.querySelector("#file-generator").addEventListener('click', function() {
    var mergedgeoJson = merge(window.text);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mergedgeoJson));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "scene.geojson");
    dlAnchorElem.click();
    console.log("GeoJSON unidos: " + JSON.stringify(mergedgeoJson));
  });
}

function addGJToText(event){
  var reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  var fileName = event.target.files[0].name;
  reader.onload = function(event) {
    window.text.push(JSON.parse(event.target.result));
    addItem(fileName);
  };
}

function addItem(fileName){
	var ol = document.getElementById("dynamic-list");
  // Sustituir por el nombre del archivo
  var li = document.createElement("li");
  li.setAttribute('id',fileName);
  li.appendChild(document.createTextNode(fileName));
  ol.appendChild(li);
}

function merge () {
  var output = {
    type: 'FeatureCollection',
    features: []
  };
  for (var i = 0; i < window.text.length; i++) {
    var normalized = normalize(window.text[i]);
    for (var j = 0; j < normalized.features.length; j++) {
      if (normalized.features[j].geometry.type == 'LineString' && output.features.length) {
        output.features[0].geometry.coordinates.concat(normalized.features[j].geometry.coordinates);
      }
      else output.features.push(normalized.features[j]);
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
