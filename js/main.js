require([
  "esri/map",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/dijit/Popup", "esri/dijit/PopupTemplate",
  "esri/symbols/SimpleFillSymbol", "esri/Color",
  "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/on",
  "dojo/dom-attr", "dojo/dom",
  // "dojox/charting/Chart", "dojox/charting/themes/Dollar",
  "esri/tasks/query", "esri/tasks/QueryTask",
  "esri/InfoTemplate",
  "dojo/domReady!"
  ],


//------------------------------------------------------------------
// ----------------------Initialize Functions-----------------------
//------------------------------------------------------------------
  function (
    Map,
    Search,
    FeatureLayer,
    Popup, PopupTemplate,
    SimpleFillSymbol, Color,
    domClass, domConstruct, query, on,
    // domAttr, dom,
    Query, QueryTask,
    InfoTemplate
  ) {



// --------------------Popup Shell Setup-----------------------------------
    var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
    var popup = new Popup({
      fillSymbol: fill,
      titleInBody: false
    }, domConstruct.create("div"));

    //Add Popup theme
    domClass.add(popup.domNode, "dark");



//--------------------Create Map-----------------------------------------
    var map = new Map("map", {
      basemap: "dark-gray",
      center: [-72.68, 43.785], // lon, lat
      zoom:8,
      infoWindow: popup
    });

    // map.infoWindow.resize(300, 700);



// -----------------Define PopupTemplates------------------------------
    //Crossing Template
    var crossingPopupFeatures = "DOT Crossing Number: {DOT_Num}</br>Line Name: {LineName}</br>Feature Crossed: {Feature_Crossed}</br>Warning Device Level: {WDCode}</br>Primary Crossing Surface Material: {SurfaceType}</br>Crossing Codition: {XingCond}";

    var link = domConstruct.create("a", {
      "class": "action",
      "id": "fullReport",
      "innerHTML": "Full Report",
      "href": "javascript:void(0);"
    }, dojo.query(".actionList", map.infoWindow.domNode)[0]);

    var crossingTemplate = new PopupTemplate({
      title: "Railroad Crossing {DOT_Num}",

      // description: crossingPopupFeatures,


      description: crossingPopupFeatures + "</br></br><a href='report.html'>Full Report</a>" + "</br></br><input id='selectionReport' type='button' value='Full Report'>",

      showAttachments: true,
    });



    //Sign Template
    var signTemplate = new PopupTemplate({
      title: "Crossing Sign",

      fieldInfos: [
        { fieldName: "DOT_Num", label: "DOT Crossing Number", visible: true, format: { places: 0} },
        { fieldName: "SignType", label: "Type of Sign", visible: true, format: { places: 0} },
        { fieldName: "Post", label: "Type of Sign Post", visible: true, format: { places: 0} },
        { fieldName: "Reflective", label: "ASTM Reflective Sheeting", visible: true, format: { places: 0} },
        { fieldName: "ReflSheetCond", label: "Reflective Sheeting Condition", visible: true, format: { places: 0} },
        { fieldName: "InstallDate", label: "Installation Date", visible: true, format: { places: 0} },
        { fieldName: "SignCondition", label: "Overall Condition", visible: true, format: { places: 0} },
      ],

      showAttachments: true,
    });

    //Rail Line Template
    var lineTemplate = new PopupTemplate({
      title: "Summary Info for Rail Line",

      fieldInfos: [
        { fieldName: "LineName", label: "Rail Line", visible: true, format: { places: 0} },
        { fieldName: "Division", visible: true, format: { places: 0} },
        { fieldName: "Subdivision", visible: true, format: { places: 0} },
        { fieldName: "Branch", visible: true, format: { places: 0} },
      ],
    });

    //AADT Template
    var aadtTemplate = new PopupTemplate({
      title: "Average Annual Daily Traffic at Station {ATRStation}",

      fieldInfos: [
        { fieldName: "aadt", label: "AADT", visible: true, format: { places: 0} },
        { fieldName: "ATRStation", label: "Automated Traffic Recording Station", visible: true, format: { places: 0} },
        { fieldName: "YEAR", label: "Last Year Counted", visible: true, format: { places: 0} },
        { fieldName: "RouteName", label: "Route Name", visible: true, format: { places: 0} },
        { fieldName: "RouteNum", label: "Route Number", visible: true, format: { places: 0} },
      ],
    });



//  ---------------------- Add map layers ------------------------------
    //Create Crossing Feature Layer
    var crossingUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1";

    var crossingPoints = new FeatureLayer(crossingUrl, {
      id: "crossing-points",
      outFields: ["*"],
      infoTemplate: crossingTemplate,
      minScale: 200000,
    });


    //Create Sign Feature Layer
    var signUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/0";

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 25000,
    });


    //Create Rail Line Feature Layer
    var lineUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
      infoTemplate: lineTemplate
    });


    //Create AADT Line Feature Layer
    var aadtUrl = "https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/AADT_2013_StateHighways/FeatureServer/0";

    var aadtLine = new FeatureLayer(aadtUrl, {
      id: "aadt-line",
      outFields: ["*"],
      infoTemplate: aadtTemplate,
      minScale: 50000,
    });

    //Add Layers to Map
    map.addLayer(aadtLine);
    map.addLayer(railLine);
    map.addLayer(crossingPoints);
    map.addLayer(signPoints);




     // ------------------------------------------------------------------
      var queryTask = new esri.tasks.QueryTask(crossingUrl);

      var query = new esri.tasks.Query();

      query.returnGeometry = true;
      query.outFields = ["*"];

      on(link, "click", selectionReportExecute);


      function selectionReportExecute (event) {
        // Create possible filters
        // query.where = "DOT_Num IN '(" + crossingPoints + ")'";
        query.geometry = event.mapPoint;
        queryTask.execute(query, showResults);
        window.location.href = 'report.html';

        }

        function showResults (results) {
          var resultItems = [];
          var resultCount = results.features.length;
          for (var i = 0; i < resultCount; i++) {
            var featureAttributes = results.features[i].attributes;
            for (var attr in featureAttributes) {
              resultItems.push("<b>" + attr + ":</b>  " + featureAttributes[attr] + "<br>");
            }
            resultItems.push("<br>");
          }
          dom.byId("info").innerHTML = resultItems.join("");
        }



    // -------------------------------------------------------------------



// ---------------------------- Build search --------------------------
    var searchWidget = new Search({
      enableLabel: false,
      enableInfoWindow: true,
      showInfoWindowOnSelect: true,
      enableHighlight: false,
      allPlaceholder: "Search for Railroad Crossings, Signs, Addresses or Places",
      map: map,
    }, "search");

    //Create blank searchSources array
    var searchSources = [];

    //Push the first source used to search to searchSources array
    searchSources.push({
      featureLayer: new FeatureLayer(crossingUrl),
      searchFields: ["DOT_Num", "RRXingNum", "Town", "County", "LineName", "Feature_Crossed"],
      suggestionTemplate: "${DOT_Num}, Line: ${LineName}, Street: ${Feature_Crossed}, Warning Device: ${WDCode}, Condition: ${XingCond}",
      exactMatch: false,
      outFields: ["*"],
      name: "Railroad Crossings",
      placeholder: "Search by DOT #, Line, Street, Town, or County",
      maxResults: 15,
      maxSuggestions: 15,

      //Create an InfoTemplate
      infoTemplate: crossingTemplate,

      enableSuggestions: true,
      minCharacters: 0
    });



    //Push the second source used to search to searchSources array(World Geocoding Service).
    searchSources.push(searchWidget.sources[0]);

    // Set the source for the searchWidget to the properly ordered searchSources array
    searchWidget.set("sources", searchSources);

    //Set the countryCode for World Geocoding Service
    searchWidget.sources[1].countryCode = "US";
    searchWidget.sources[1].maxSuggestions = 4;

    //Finalize creation of the search widget
    searchWidget.startup();

});
