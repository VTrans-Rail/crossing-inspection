require([
  "esri/map",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "dojo/domReady!"
  ],
  function (Map, Search, FeatureLayer, InfoTemplate) {
    var map = new Map("map", {
      basemap: "dark-gray",
      center: [-72.68, 43.785], // lon, lat
      zoom: 8
    });


    // Add map layers
    var crossingUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1";

    var crossingTemplate = new InfoTemplate("Railroad Crossing", "DOT Crossing Number: ${DOT_Num}</br>Line Name: ${LineName}</br>Feature Crossed: ${Feature_Crossed}</br>Warning Device Level: ${WDCode}</br>Crossing Codition: ${XingCond}");

    var crossingPoints = new FeatureLayer(crossingUrl, {
      id: "crossing-points",
      outFields: ["*"],
      infoTemplate: crossingTemplate
    });

    var signUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/CrossingInspections2015/FeatureServer/0";

    var signTemplate = new InfoTemplate("Crossing Sign", "DOT Crossing Number: ${DOT_Num}</br>Sign Type: ${SignType}</br>Sign Condition: ${SignCondition}</br>Installation Date: ${InstallDate}");

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      outFields: ["*"],
      infoTemplate: signTemplate
    });

    map.addLayer(crossingPoints);
    map.addLayer(signPoints);

});
