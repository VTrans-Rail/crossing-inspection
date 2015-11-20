require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "dojo/domReady!"
],
  function(Map, Search, InfoTemplate, FeatureLayer) {
    //Crossing Features
    var crossingPoints = new FeatureLayer("http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/CrossingInspections2015/FeatureServer/1", {
      outFields: ["*"]
    });

    var signPoints = new FeatureLayer("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/CrossingInspections2015/FeatureServer/0", {
      outFields: ["*"]
    });

    map.addLayer([crossingPoints, signPoints]);
});
