var formatString = "";

require([
  "esri/map",
  "esri/arcgis/utils",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/dijit/Popup", "esri/dijit/PopupTemplate",
  "esri/dijit/BasemapToggle",
  "esri/dijit/LayerList",
  "esri/dijit/LocateButton",
  "esri/renderers/UniqueValueRenderer",
  // "esri/symbols/SimpleLineSymbol",
  "esri/symbols/CartographicLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color",
  "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/on",
  "dojo/dom-attr", "dojo/dom",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
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
    arcgisUtils,
    Search,
    FeatureLayer,
    ArcGISTiledMapServiceLayer,
    Popup, PopupTemplate,
    BasemapToggle,
    LayerList,
    LocateButton,
    UniqueValueRenderer,
    // SimpleLineSymbol,
    CartographicLineSymbol,
    SimpleFillSymbol, Color,
    domClass, domConstruct, query, on,
    dom,
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
    domClass.add(popup.domNode, "light");
//----------------------------------------------------------------------



//-------------------------------------------------------------
//--------------------Create Map-----------------------------------------
//-------------------------------------------------------------
    // satellite imagery from ArcGIS Online, use levels 0 - 11
    var topoBasemap = new   ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer", {
      displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    });

    // street Map service from ArcGIS Online, use levels 11 - 15
    var streetBasemap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer", {
      displayLevels: [12, 13, 14, 15, 16, 17, 18, 19],
      opacity : 0.65
    });

    // create the map and use the custom zoom levels
    var map = new Map("map", {
      // basemap: "topo",
      center: [-72.68, 43.785],
      zoom: 8,
      maxZoom:19,
      infoWindow: popup,
      showLabels: true,
    });

    // map.on("extent-change", changeScale);
    map.addLayer(topoBasemap);
    map.addLayer(streetBasemap);

    //Resize Popup To Fit titlePane
    map.infoWindow.resize(300, 370)
//-------------------------------------------------------------



//-------------------------------------------------------------
//---------------------Create BasemapToggle--------------------
//-------------------------------------------------------------
    var toggle = new BasemapToggle({
      map: map,
      basemap: "satellite",
      visible: false,
    }, "BasemapToggle");
    toggle.startup();


    //Turn on BasemapToggle when zoomed in to specific level
    map.on("extent-change", checkBasemapToggle);
    function checkBasemapToggle () {
      var zoom = map.getZoom();
      if ( zoom > 11 ) {
        toggle.show();
      } else {
        toggle.hide();
      }
    }
//-------------------------------------------------------------



//----------------------------------------------------------------
//---------------------Create LocateButton-----------------------
//---------------------------------------------------------------
    var geoLocate = new LocateButton({
      map: map
    }, "locateButton");
    geoLocate.startup();
//------------------------------------------------------------------



// -----------------Define PopupTemplates------------------------------
    //Crossing Template--------------
    var crossingPopupFeatures = "<div style='overflow-y:auto'><small>DOT Crossing Number:</small> <b>${DOT_Num}</b></br><small>Line Name:</small> <b>${LineName}</b></br><small>Feature Crossed:</small> <b>${Feature_Crossed}</b></br><small>Warning Device Level:</small> <b>${WDCode}</b></br><small>Primary Surface Material:</small> <b>${SurfaceType}</b></br><small>Crossing Codition:</small> <b>${XingCond}</b></br> </br>";

    var link = domConstruct.create("a", {
      "class": "action",
      "id": "fullReport",
      "innerHTML": "Full Report Link",
      "href": "www.google.com",
      "target": "_blank"
    }, dojo.query(".actionList", map.infoWindow.domNode)[0]);

    var crossingTemplate = new PopupTemplate({
      title: "Crossing {DOT_Num}",
    });


    //Sign Template------------------
    var signPopupFeatures = "<div style='overflow-y:auto'><small>Associated Crossing DOT#:</small> <b>${DOT_Num}</b></br><small>Type of Sign:</small> <b>${SignType}</b></br><small>Type of Post:</small> <b>${Post}</b></br><small>ASTM Reflective Sheeting:</small> <b>${Reflective}</b></br><small>Reflective Sheeting Condition:</small> <b>${ReflSheetCond}</b></br><small>Installation Date:</small> <b>${InstallDate}</b></br><small>Overall Condition:</small> <b>${SignCondition}</b></br> </br>";

    var signTemplate = new PopupTemplate({
      title: "Crossing Sign",
    });


    //AADT Template--------------------
    var aadtTemplate = new PopupTemplate({
      title: "Traffic Data",

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
      id: "crossingPoints",
      outFields: ["*"],
      infoTemplate: crossingTemplate,
      minScale: 650000,
    });


    //Create Sign Feature Layer
    var signUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/0";

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      displayField: "DOT_Num",
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 3000,
    });


    //Create Rail Line Feature Layer----------------------------
    var lineUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
    });

    // --------------------------------------------------
    //Create AADT Line Feature Layer--------------------------------
    // --------------------------------------------------
    var aadtUrl = "https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/AADT_2013_StateHighways/FeatureServer/0";

    var aadtLine = new FeatureLayer(aadtUrl, {
      mode: FeatureLayer.MODE_AUTO,
      outFields: ["*"],
      infoTemplate: aadtTemplate,
      minScale: 288000,
    });

    var aadtSymbol = new CartographicLineSymbol(    );
    aadtSymbol.style = CartographicLineSymbol.STYLE_DASH;
    aadtSymbol.setCap("ROUND");
    aadtSymbol.setJoin("ROUND");
    aadtSymbol.setColor([230, 0, 169, 1]);

    //Create a unique value renderer and its unique value info
    var renderer = new UniqueValueRenderer(aadtSymbol);

    /**********************************************
    * Define a size visual variable to vary the width
    * of each highway based on its annual average daily
    * traffic count.
    *********************************************/
    renderer.setVisualVariables([{
        type: "sizeInfo",
        field: "aadt",
        valueUnit: "unknown",
        minSize: 2.5,
        maxSize: 10,
        minDataValue: 10,
        maxDataValue: 56000
    }]);

    //Set the renderer on the layer and add the layer to the map
    aadtLine.setRenderer(renderer);
    // --------------------------------------------------
    // --------------------------------------------------



    //Create Mile Posts Feature Layers
    var mpTenUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/3";

    var mpFiveUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/2";

    var mpOneUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/1";

    var milePostsTen = new FeatureLayer (mpTenUrl, {
      id: "mile-post-ten",
      outFields: ["MP"],
      labelingInfo: ["MP"],
    });

    var milePostsFive = new FeatureLayer (mpFiveUrl, {
      id: "mile-post-five",
      outFields: ["MP"],
      labelingInfo: ["MP"],
    });

    var milePostsOne = new FeatureLayer (mpOneUrl, {
      id: "mile-post-one",
      outFields: ["MP"],
      labelingInfo: ["MP"],
      minScale: 50000,
    });



    //Add Layers to Map
    map.addLayer(aadtLine);
    // map.addLayer(aadtLineBase);
    map.addLayer(railLine);
    map.addLayer(milePostsTen);
    map.addLayer(milePostsFive);
    map.addLayer(milePostsOne);
    map.addLayer(crossingPoints);
    map.addLayer(signPoints);
//-------------------------------------------------------------------------



//-------------------------------------------------------------------------
//-----------------------LayerToggle--------------------------------
//-------------------------------------------------------------------------
    var toggleLayers = [
      {
        layer: signPoints,
        content: "<b>Signs</b> <img src='img/favicon.png' alt='site image' height=17px style='border-radius:4px; float:right; right:5px'>",
      },
      {
        layer: aadtLine,
        content: "<b>AADT</b> <img src='img/aadtSymbol.png' alt='site image' width=60px style='border-radius:4px; float:right; right:5px'>",
      },
    ];

    var myLayerList = new LayerList({
      map: map,
      layers: toggleLayers,
      theme: "vtransTheme",
    }, "layerList");
    myLayerList.startup();
//-------------------------------------------------------------------------



//---------------------------------------------------------------------------
//---------------------Display Photos in Popup--------------------------------
//---------------------------------------------------------------------------
//---------------------Build Link to Report Page--------------------------------
//---------------------------------------------------------------------------

    var selectQuery = new esri.tasks.Query();

    //Crossings
    on(crossingPoints, "click", function(evt){
      map.infoWindow.hide();
      formatString = crossingPopupFeatures;
      var objectId = evt.graphic.attributes[crossingPoints.objectIdField];
      selectQuery.objectIds = [objectId];
      crossingPoints.selectFeatures(selectQuery);

      //Updates link to report page
      var dotnum = evt.graphic.attributes.DOT_Num;
      link.href = "report.html?dotnum=" + dotnum;
    });

    on(crossingPoints, "error", function (err){
      console.log("error with crossingPoints; " + err.message);
    });

    on(crossingPoints, 'selection-complete', setCrossingWindowContent);

    // map.addLayers([crossingPoints]);

    function setCrossingWindowContent(results){
      var imageString = "<table><tr>";
      var imageStyle = "alt='site image' width='100%'";
      var deferred = new dojo.Deferred;
      var graphic = results.features[0];
      var objectId = graphic.attributes[crossingPoints.objectIdField];

      crossingPoints.queryAttachmentInfos(objectId).then(function(response){
        var imgSrc;
        if (response.length === 0) {
          deferred.resolve("no attachments");
        }
        else {
          for ( i = 0; i < response.length; i++) {
            imgSrc = response[i].url;
            imageString += "<tr><td></br></td></tr><tr><td><a href='" + imgSrc + "' target='_blank'>Image " + (i+1) + ": Click to View Full Image</a></td></tr><tr><td><img src='" + imgSrc + "' " + imageStyle + "></td></tr>";
          }
          //Add closing div tag to to match the opening div tag in crossingPopupFeatures that
          formatString += imageString + "</div>";
        }
        crossingTemplate.setContent(formatString);
      });
    }

    // Signs
    on(signPoints, "click", function(evt){
      map.infoWindow.hide();
      formatString = signPopupFeatures;
      var  objectId = evt.graphic.attributes[signPoints.objectIdField];
      selectQuery.objectIds = [objectId];
      signPoints.selectFeatures(selectQuery);
    });

    on(signPoints, "error", function (err){
      console.log("error with signPoints; " + err.message);
    });

    on(signPoints, 'selection-complete', setSignWindowContent);

    // map.addLayers([signPoints]);

    function setSignWindowContent(results){
      var imageString = "<table><tr>";
      var imageStyle = "alt='site image' width='100%'";
      var deferred = new dojo.Deferred;
      var graphic = results.features[0];
      var  objectId = graphic.attributes[signPoints.objectIdField];

      signPoints.queryAttachmentInfos(objectId).then(function(response){
        var imgSrc;
        if (response.length === 0) {
          deferred.resolve("no attachments");
        }
        else {
          for ( i = 0; i < response.length; i++) {
            imgSrc = response[i].url;
            imageString += "<tr><td></br></td></tr><tr><td><a href='" + imgSrc + "' target='_blank'>Image " + (i+1) + ": Click to View Full Image</a></td></tr><tr><td><img src='" + imgSrc + "' " + imageStyle + "></td></tr>";
          }
          formatString += imageString + "</div>";
        }
        signTemplate.setContent(formatString);
      });
    }
//---------------------------------------------------------------------------



// ---------------------------------------------------------------------
// -------------------Maximize Popup for Small Devices----------------------
// ---------------------------------------------------------------------
    on(map, "click", function(evt) {
      if ( map.width < 415 ) {
        map.infoWindow.maximize();
      }
    });
//-----------------------------------------------------------------------



// ---------------------------- Build search --------------------------
    var searchWidget = new Search({
      enableLabel: false,
      enableInfoWindow: true,
      showInfoWindowOnSelect: false,
      enableHighlight: false,
      allPlaceholder: "Search for Railroad Crossings, Signs, Addresses or Places",
      map: map,
    }, "search");

    //Create blank searchSources array
    var searchSources = [];

    //Push the first source used to search to searchSources array
    searchSources.push({
      featureLayer: crossingPoints,
      searchFields: ["DOT_Num", "RRXingNum", "Town", "County", "LineName", "Feature_Crossed"],
      displayField: "DOT_Num",
      suggestionTemplate: "${DOT_Num}: The ${LineName} crosses ${Feature_Crossed} in ${Town}. (${XingCond})",
      exactMatch: false,
      outFields: ["*"],
      name: "Railroad Crossings",
      placeholder: "Search by DOT #, Line, Street, Town, or County",
      maxResults: 30,
      maxSuggestions: 45,

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
