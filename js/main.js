var formatString = "";

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
      basemap: "topo",
      center: [-72.68, 43.785], // lon, lat
      zoom:8,
      infoWindow: popup
    });



// -----------------Define PopupTemplates------------------------------
    //Crossing Template--------------
    var crossingPopupFeatures = "<small>DOT Crossing Number:</small> <b>${DOT_Num}</b></br><small>Line Name:</small> <b>${LineName}</b></br><small>Feature Crossed:</small> <b>${Feature_Crossed}</b></br><small>Warning Device Level:</small> <b>${WDCode}</b></br><small>Primary Surface Material:</small> <b>${SurfaceType}</b></br><small>Crossing Codition:</small> <b>${XingCond}</b></br> </br>";

    var link = domConstruct.create("a", {
      "class": "action",
      "id": "fullReport",
      "innerHTML": "Full Report",
      "href": "www.google.com",
      "target": "_blank"
    }, dojo.query(".actionList", map.infoWindow.domNode)[0]);

    var crossingTemplate = new PopupTemplate({
      title: "Crossing {DOT_Num}",
    });


    //Sign Template------------------
    var signPopupFeatures = "<small>Associated Crossing DOT#:</small> <b>${DOT_Num}</b></br><small>Type of Sign:</small> <b>${SignType}</b></br><small>Type of Post:</small> <b>${Post}</b></br><small>ASTM Reflective Sheeting:</small> <b>${Reflective}</b></br><small>Reflective Sheeting Condition:</small> <b>${ReflSheetCond}</b></br><small>Installation Date:</small> <b>${InstallDate}</b></br><small>Overall Condition:</small> <b>${SignCondition}</b></br> </br>";

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
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 3000,
    });


    //Create Rail Line Feature Layer
    var lineUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
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
          formatString += imageString;
        }
        crossingTemplate.setContent(formatString);
      });

      // var dotnum = "";
      // dotnum = graphic.attributes.DOT_Num;
      //
      // on(link, "click", selectionReportExecute);
      //
      // function selectionReportExecute () {
      //   // window.location.href = 'report.html?dotnum=' + dotnum;
      //   // location.href = 'report.html?dotnum=' + dotnum;
      //   window.open('report.html?dotnum=' + dotnum, '_blank');
      // }
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
          formatString += imageString;
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



// ---------------------------------------------------------------------
// -------Navigate to Report Page with  DOT_Num of Current Selection----------
// ---------------------------------------------------------------------


    // link.addEventListener("click", function(event) {
    //   event.preventDefault();
    //
    //   var dotnum = "";
    //   dotnum = event.graphic.attributes.DOT_Num;
    //   // window.caches.clear();
    //
    //   link.addEventListener("click", selectionReportExecute);
    //
    //   function selectionReportExecute () {
    //     // window.location.href = 'report.html?dotnum=' + dotnum;
    //     var reportUrl = "";
    //     reportUrl = window.open('report.html?dotnum=' + dotnum, '_blank');
    //     var reportLength = reportUrl;
    //   }
    //
    // });

    // on(crossingPoints, "click", function(evt) {
    //   //Create Variable to Store DOT Number of selected crossing
    //   var dotnum = "";
    //   dotnum = evt.graphic.attributes.DOT_Num;
    //   // window.caches.clear();
    //
    //   on(link, "click", selectionReportExecute);
    //
    //   function selectionReportExecute () {
    //     // window.location.href = 'report.html?dotnum=' + dotnum;
    //     var reportUrl = "";
    //     reportUrl = window.location.href = 'report.html?dotnum=' + dotnum;
    //     // reportUrl = window.open('report.html?dotnum=' + dotnum, '_blank');
    //     var reportLength = reportUrl;
    //     // reportUrl.close();
    //     // var dd = crossingPoints.getSelectedFeatures();
    //     // reportUrl;
    //   }
    // });



// -------------------------------------------------------------------



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
