require([
  "esri/map",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/dijit/Popup", "esri/dijit/PopupTemplate",
  "esri/symbols/SimpleFillSymbol", "esri/Color",
  "dojo/dom-class", "dojo/dom-construct", "dojo/on",
  // "dojox/charting/Chart", "dojox/charting/themes/Dollar",
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
    domClass, domConstruct, on,
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


// -----------------Define PopupTemplates------------------------------
    //Crossing Template
    var crossingTemplate = new PopupTemplate({
      title: "Summary Info for Crossing {DOT_Num}",

      fieldInfos: [
        { fieldName: "DOT_Num", visible: true, format: { places: 0} },
        { fieldName: "LineName", visible: true, format: { places: 0} },
        { fieldName: "Feature_Crossed", visible: true, format: { places: 0} },
        { fieldName: "WDCode", visible: true, format: { places: 0} },
        { fieldName: "SurfaceType", visible: true, format: { places: 0} },
        { fieldName: "XingCond", visible: true, format: { places: 0} },
      ],

      showAttachments: true,
    });

    //Sign Template
    var signTemplate = new PopupTemplate({
      title: "Summary Info for Crossing Sign",

      fieldInfos: [
        { fieldName: "DOT_Num", visible: true, format: { places: 0} },
        { fieldName: "SignType", visible: true, format: { places: 0} },
        { fieldName: "Post", visible: true, format: { places: 0} },
        { fieldName: "Reflective", visible: true, format: { places: 0} },
        { fieldName: "ReflSheetCond", visible: true, format: { places: 0} },
        { fieldName: "InstallDate", visible: true, format: { places: 0} },
        { fieldName: "SignCondition", visible: true, format: { places: 0} },
      ],

      showAttachments: true,
    });

    //Rail Line Template
    var lineTemplate = new PopupTemplate({
      title: "Summary Info for Rail Line",

      fieldInfos: [
        { fieldName: "LineName", visible: true, format: { places: 0} },
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

    // var crossingTemplate = new InfoTemplate("Railroad Crossing", "DOT Crossing Number: ${DOT_Num}</br>Line Name: ${LineName}</br>Feature Crossed: ${Feature_Crossed}</br>Warning Device Level: ${WDCode}</br>Crossing Codition: ${XingCond}");

    var crossingPoints = new FeatureLayer(crossingUrl, {
      id: "crossing-points",
      outFields: ["*"],
      infoTemplate: crossingTemplate,
      minScale: 200000,
    });


    //Create Sign Feature Layer
    var signUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/0";

    // var signTemplate = new InfoTemplate("Crossing Sign", "DOT Crossing Number: ${DOT_Num}</br>Sign Type: ${SignType}</br>Sign Condition: ${SignCondition}</br>Installation Date: ${InstallDate}");

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 25000,
    });


    //Create Rail Line Feature Layer
    var lineUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    // var lineTemplate = new InfoTemplate("Railroad Line", "Line Name: ${LineName}</br>Division: ${Division}</br>Subdivision: ${Subdivision}</br>Branch: ${Branch}");

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
      infoTemplate: lineTemplate
    });


    //Create AADT Line Feature Layer
    var aadtUrl = "https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/AADT_2013_StateHighways/FeatureServer/0";

    // var aadtTemplate = new InfoTemplate("Average Annual Daily Traffic", "AADT Count: ${aadt}</br>Year: ${YEAR}</br>Station ID: ${ATRStation}");

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



// ---------------------------- Build search --------------------------
    var searchWidget = new Search({
      enableLabel: false,
      enableInfoWindow: true,
      showInfoWindowOnSelect: true,
      infoWindow: popup,
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


      //Create an InfoTemplate and include three fields
      infoTemplate: crossingTemplate,
      // new InfoTemplate("Railroad Crossing", "DOT Crossing Number: ${DOT_Num}</br>Line Name: ${LineName}</br>Feature Crossed: ${Feature_Crossed}</br>Warning Device Level: ${WDCode}</br>Crossing Codition: ${XingCond}"),
      enableSuggestions: true,
      minCharacters: 0
    });


    //Push the second source used to search to searchSources array
    searchSources.push({
      featureLayer: new FeatureLayer(signUrl),
      autoNavigate: false, //This prevents automatic navigation straight to sign feature when searched
      searchFields: ["DOT_Num", "SignType"],
      suggestionTemplate: "${DOT_Num}, Sign Type: ${SignType}, Condition: ${SignCondition}, Installed: ${InstallDate}",
      exactMatch: false,
      name: "Crossing Signs",
      outFields: ["*"],
      placeholder: "Search for crossing signs by Sign Type or DOT #",
      maxResults: 15,
      maxSuggestions: 15,

      //Create an InfoTemplate
      infoTemplate: signTemplate,
      // new InfoTemplate("Crossing Sign Information", "DOT # of Associated Crossing: ${DOT_Num}</br>Type of Sign: ${SignType}</br>Condition: ${SignCondition}"),

      enableSuggestions: true,
      minCharacters: 0
    });

    //Push the third source used to search to searchSources array(World Geocoding Service).
    searchSources.push(searchWidget.sources[0]);

    // Set the source for the searchWidget to the properly ordered searchSources array
    searchWidget.set("sources", searchSources);

    //Set the countryCode for World Geocoding Service
    searchWidget.sources[2].countryCode = "US";
    searchWidget.sources[2].maxSuggestions = 4;


    //Finalize creation of the search widget
    searchWidget.startup();

});
