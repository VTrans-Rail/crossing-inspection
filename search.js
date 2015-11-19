require([
  "esri/map", "esri/dijit/Search", "esri/layers/FeatureLayer", "esri/InfoTemplate", "dojo/domReady!"
], function (Map, Search, FeatureLayer, InfoTemplate) {
   var map = new Map("map", {
      basemap: "gray",
      center: [-97, 38], // lon, lat
      zoom: 5
   });

   var s = new Search({
      enableLabel: false,
      enableInfoWindow: true,
      showInfoWindowOnSelect: false,
      map: map
   }, "search");

   var sources = s.get("sources");

   //Push the sources used to search, by default the ArcGIS Online World geocoder is included. In addition there is a feature layer of US congressional districts. The districts search is set up to find the "DISTRICTID". Also, a feature layer of senator information is set up to find based on the senator name.

   sources.push({
      featureLayer: new FeatureLayer("http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/CrossingInspections2015/FeatureServer/1"),
      searchFields: ["DOT_Num"],
      displayField: "DOT Crossing Number",
      exactMatch: false,
      outFields: ["DOT_Num", "Feature_Crossed", "LineName", "WDCode", "XingCond"],
      name: "Railroad Crossings",
      placeholder: "3708",
      maxResults: 6,
      maxSuggestions: 6,

      //Create an InfoTemplate and include three fields
      infoTemplate: new InfoTemplate("Congressional District", "District ID: ${DISTRICTID}</br>Name: ${NAME}</br>Party Affiliation: ${PARTY}"),
      enableSuggestions: true,
      minCharacters: 0
   });

   sources.push({
      featureLayer: new FeatureLayer("http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/CrossingInspections2015/FeatureServer/0"),
      searchFields: ["Name"],
      displayField: "Name",
      exactMatch: false,
      name: "Senator",
      outFields: ["*"],
      placeholder: "Senator name",
      maxResults: 6,
      maxSuggestions: 6,

      //Create an InfoTemplate

      infoTemplate: new InfoTemplate("Senator information", "Name: ${Name}</br>State: ${State}</br>Party Affiliation: ${Party}</br>Phone No: ${Phone_Number}<br><a href=${Web_Page} target=_blank ;'>Website</a>"),

      enableSuggestions: true,
      minCharacters: 0
   });

   //Set the sources above to the search widget
   s.set("sources", sources);

   s.startup();

});
