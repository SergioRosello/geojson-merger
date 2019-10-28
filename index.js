window.onload = function () {
  document.querySelector("#file-input").addEventListener('change', function() {
    // list of selected files
    var all_files = this.files;

    // first file selected by user
    var file = all_files[0];

    var reader = new FileReader();

    // file reading started
    reader.addEventListener('loadstart', function() {
      console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function(e) {
      var text = e.target.result;

      // contents of the file
      console.log("text" + text + "text");
    });

    // file reading failed
    reader.addEventListener('error', function() {
      alert('Error : Failed to read file');
    });

    console.log("Hola" + reader.readAsText(file) + "Adios!!");

    // End of querySelector
  });

  //End of onload
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
