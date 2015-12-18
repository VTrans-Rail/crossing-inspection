var formatString = "";

require([
  "esri/map",
  "esri/arcgis/utils",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/LayerInfo",
  "esri/dijit/Popup", "esri/dijit/PopupTemplate",
  "esri/dijit/LocateButton",
  "esri/dijit/Legend",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/Font",
  "esri/symbols/CartographicLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color",
  "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/on",
  "dojo/dom-attr", "dojo/dom",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
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
    LayerInfo,
    Popup, PopupTemplate,
    LocateButton,
    Legend,
    UniqueValueRenderer,
    font,
    CartographicLineSymbol,
    SimpleFillSymbol, Color,
    domClass, domConstruct, query, on,
    dom,
    Query, QueryTask,
    InfoTemplate
  ) {



// --------------------Popup Shell Setup-----------------------------------
    var popup = new Popup({
      titleInBody: false,
    }, domConstruct.create("div"));
    popup.setContent("");

    //Add Popup theme
    domClass.add(popup.domNode, "light");
//----------------------------------------------------------------------



//-------------------------------------------------------------
//--------------------Create Map-----------------------------------------
//-------------------------------------------------------------
    // satellite imagery from ArcGIS Online, use levels 0 - 14
    var topoBasemap = new   ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer", {
      displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    });

    // satellite Map service from ArcGIS Online, use levels 15 - 19
    var imageryBasemap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer", {
      displayLevels: [15, 16, 17, 18, 19],
    });

    // transportation reference layer map service from ArcGIS Online, use levels 15 - 19
    var streetReferenceLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer", {
      displayLevels: [15, 16, 17, 18, 19],
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

    map.addLayer(topoBasemap);
    map.addLayer(imageryBasemap);
    map.addLayer(streetReferenceLayer);

    //Resize Popup To Fit titlePane
    map.infoWindow.resize(300, 370)
//-------------------------------------------------------------



//----------------------------------------------------------------
//---------------------Create LocateButton-----------------------
//---------------------------------------------------------------
    var geoLocate = new LocateButton({
      map: map,
      scale: 5000,
    }, "locateButton");
    geoLocate.startup();
//------------------------------------------------------------------



//------------------------------------------------------------------
// -----------------Define PopupTemplates------------------------------
//------------------------------------------------------------------
    //Crossing Template--------------
    var crossingPopupFeatures = "<div id='popupContent' style='overflow-y:auto'><small>DOT Crossing Number:</small> <b>${DOT_Num}</b></br><small>Line Name:</small> <b>${LineName}</b></br><small>Feature Crossed:</small> <b>${Feature_Crossed}</b></br><small>Warning Device Level:</small> <b><span id='warnCode'>${WDCode}</span></b></br><small>Primary Surface Material:</small> <b>${SurfaceType}</b></br><small>Crossing Codition:</small> <b>${XingCond}</b></br> </br>     <button type='button' id='popupPictures' class='btn btn-lg btn-default text-center btnHelp'>&#x25BC Pictures &#x25BC</button></div>";

    var crossingTemplate = new PopupTemplate({
      title: "Crossing {DOT_Num}",
    });
    //Provides warning if popup doesn't load properly and clears out editSummary
    crossingTemplate.setContent("<h1>Oops!</h1></br><b>Please close popup and try again.</b></br>The summary information and pictures for this crossing did not load properly.");


    //Sign Template------------------
    var signPopupFeatures = "<div id='popupContent' ><small>Associated Crossing DOT#:</small> <b>${DOT_Num}</b></br><small>Type of Sign:</small> <b>${SignType}</b></br><small>Type of Post:</small> <b>${Post}</b></br><small>ASTM Reflective Sheeting:</small> <b>${Reflective}</b></br><small>Reflective Sheeting Condition:</small> <b>${ReflSheetCond}</b></br><small>Installation Date:</small> <b>${InstallDate}</b></br><small>Overall Condition:</small> <b>${SignCondition}</b></br> </br>   <button type='button' id='popupPictures' class='btn btn-lg btn-default text-center btnHelp'>&#x25BC Pictures &#x25BC</button></div>";

    var signTemplate = new PopupTemplate({
      title: "Crossing Sign",
    });
    //Provides warning if popup doesn't load properly and clears out editSummary
    signTemplate.setContent("<h1>Oops!</h1></br><b>Please close popup and try again.</b></br>The summary information and pictures for this sign did not load properly.");
//-----------------------------------------------------------------------



//------------------------------------------------------------------
//  ---------------------- Create Feature Layers ------------------------------
//------------------------------------------------------------------
    //Create Crossing Feature Layer-------------------
    var crossingUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1";

    var crossingPoints = new FeatureLayer(crossingUrl, {
      id: "crossing-points",
      outFields: ["*"],
      infoTemplate: crossingTemplate,
      minScale: 650000,
    });
    crossingTemplate.setContent(crossingPopupFeatures);


    //Create Sign Feature Layer---------------------------------
    var signUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/0";

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      displayField: "DOT_Num",
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 3000,
    });
    signTemplate.setContent(signPopupFeatures);


    //Create Rail Line Feature Layer----------------------------
    var lineUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
    });


    //Create Mile Posts Feature Layers-------------------------------
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

    // Remove rail trails and TSRR from feature layers---------------
    railLine.setDefinitionExpression("RailTrail = 'N' AND VRLID <> 'VRL15'");
    milePostsTen.setDefinitionExpression("RailTrail = 'N' AND VRLID <> 'VRL15'");
    milePostsFive.setDefinitionExpression("RailTrail = 'N' AND VRLID <> 'VRL15'");
    milePostsOne.setDefinitionExpression("RailTrail = 'N' AND VRLID <> 'VRL15'");
//-------------------------------------------------------------------------



// -------------------------------------------------------------------
// -------------- Add Labels: Crossings with DOT_Num---------------------
// -------------------------------------------------------------------
  // crossingPoints labels
    var dotNumLabel = new esri.symbol.TextSymbol();
    dotNumLabel.font.setSize("13pt");
    dotNumLabel.font.setFamily("Verdana");
    dotNumLabel.font.setWeight(font.WEIGHT_BOLD);
    dotNumLabel.setColor(new Color([190, 232, 255, 1, 1]));
    // dotNumLabel.setHaloColor(new Color([26, 26, 26, 1])); //Option added at v3.15
    // dotNumLabel.setHaloSize("25px"); //Option added at v3.15

    var jsonLblCrossing = {
      "labelExpressionInfo": {"value": "{DOT_Num}"},
      "minScale": 20000,
    };

    var crossingLabelClass = new esri.layers.LabelClass(jsonLblCrossing);
    crossingLabelClass.symbol = dotNumLabel;

    crossingPoints.setLabelingInfo([ crossingLabelClass ]);

  // mp labels
    var mpLabel = new esri.symbol.TextSymbol();
    mpLabel.font.setSize("10pt");
    mpLabel.font.setFamily("Verdana");
    mpLabel.setColor(new Color([235,235,235, 1]));

    var jsonLblmp = {
      "labelExpressionInfo": {"value": "{MP}"},
    };

    var mpLabelClass = new esri.layers.LabelClass(jsonLblmp);
    mpLabelClass.symbol = mpLabel;

    milePostsTen.setLabelingInfo([ mpLabelClass ]);
    milePostsFive.setLabelingInfo([ mpLabelClass ]);
    milePostsOne.setLabelingInfo([ mpLabelClass ]);
// -------------------------------------------------------------------



//------------------------------------------------------------------
//----------------------Add Layers to Map--------------------------
//------------------------------------------------------------------
    map.addLayer(railLine);
    map.addLayer(milePostsTen);
    map.addLayer(milePostsFive);
    map.addLayer(milePostsOne);
    map.addLayer(crossingPoints);
    map.addLayer(signPoints);
//------------------------------------------------------------------



//-------------------------------------------------------------
//--------------------Setup Mobile Legend Controls-----------------------
//-------------------------------------------------------------
    var legendOpen = document.getElementById('openMobileLegend');
    if (legendOpen) {
      legendOpen.addEventListener('click', function () {
        document.getElementById('legend').style.display = "block";
        document.getElementById('openMobileLegend').style.display = "none";
        document.getElementById('closeMobileLegend').style.display = "block";
      });
    }

    var legendClose = document.getElementById('closeMobileLegend');
    if (legendClose) {
      legendClose.addEventListener('click', function () {
        document.getElementById('legend').style.display = "none";
        document.getElementById('openMobileLegend').style.display = "block";
        document.getElementById('closeMobileLegend').style.display = "none";
      });
    }
//-------------------------------------------------------------



//------------------------------------------------------------------
//----------------------Build Legend----------------------------
//------------------------------------------------------------------
  map.on("load", function() {
    var layerInfo = [
      {
        layer: signPoints, title: "Common Crossing Signs"
      },
      {
        layer: crossingPoints, title: "Railroad Crossings"
      },
      {
        layer: milePostsTen, title: "Mile Posts"
      },
      {
        layer: railLine, title: "Railroad Lines", hideLayers: [0], defaultSymbol: false
      }];

    var legendDijit = new Legend({
      map: map,

      layerInfos: layerInfo,

      respectCurrentMapScale: true,
    }, "legendDiv");
    legendDijit.startup();
  });

//------------------------------------------------------------------



//------------------------------------------------------------------------
//----------Create Full Report link with a filler href---------------------
//------------------------------------------------------------------------
  var link = domConstruct.create("a", {
    "class": "btn btn-sm btn-default btn-report",
    "role": "button",
    "id": "fullReport",
    "innerHTML": "Full Report",
    "href": "www.google.com",
    "target": "_blank"
  }, dojo.query(".actionList", map.infoWindow.domNode)[0]);
//------------------------------------------------------------------------



//---------------------------------------------------------------------------
//---------------------Display Photos in Popup--------------------------------
//---------------------------------------------------------------------------
//---------------------Build Link to Report Page--------------------------------
//---------------------------------------------------------------------------
  on(map.infoWindow, "selection-change", when);

  var interval = 3000;
  function when (interval) {
    var deferred = new dojo.Deferred();

    var featureCount = popup.count;

    if ( featureCount > 0 ) {

      //Updates link to report page
      var dotnum = popup.getSelectedFeature().attributes.DOT_Num;
      link.href = "report.html?dotnum=" + dotnum;

      // Updates Domain Codes to Coded Value, aka description or alias
      if (document.getElementById('warnCode')) {
        var warn = document.getElementById('warnCode').innerHTML;

        if (warn === "StopYield") {
          document.getElementById('warnCode').innerHTML = "Stop or Yield";
        } else if (warn === "XB") {
          document.getElementById('warnCode').innerHTML = "Crossbucks";
        } else if (warn === "Flashers") {
          document.getElementById('warnCode').innerHTML = "Flashing Lights";
        } else if (warn === "Gates") {
          document.getElementById('warnCode').innerHTML = "1 to 3 Gates";
        } else if (warn === "FullQuad") {
          document.getElementById('warnCode').innerHTML = "Four Quad (full barrier) Gates";
        } else if (warn === "Other") {
          document.getElementById('warnCode').innerHTML = "Other signs or signals";
        } else if (warn === "Other AWD") {
          document.getElementById('warnCode').innerHTML = "Other Active Device (flagging)";
        } else if (warn === "None") {
          document.getElementById('warnCode').innerHTML = "No signs or signals";
        }
      }


      var pictureOpen = document.getElementById('popupPictures');
      if (pictureOpen) {
        pictureOpen.addEventListener('click', function () {
          pictureOpen.style.display = "none";

          var objectId = popup.getSelectedFeature().attributes.OBJECTID;

          formatString = "";

          var imageString = "<table><tr>";
          var imageStyle = "alt='site image' width='100%'";

          var selectedLayer = "";

          var selectedLayerId = popup.getSelectedFeature()._layer.id;

          if ( selectedLayerId.length > 12 ) {
            selectedLayer = crossingPoints;
          } else {
            selectedLayer = signPoints;
            var transform = "style='transform:rotate(90deg); margin-top:42px; margin-bottom:15px'"
            if ( /webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
              transform = "";
            }
            imageStyle += transform;
          }

          selectedLayer.queryAttachmentInfos(objectId).then(function(response){
            var imgSrc;
            if (response.length === 0) {
              deferred.resolve("no attachments");
            }
            else {
              for ( i = 0; i < response.length; i++) {
                imgSrc = response[i].url;
                imageString += "<tr><td></br></td></tr><tr><td><div class='img-link'><a href='" + imgSrc + "' target='_blank' class='btn btn-xs btn-default btnImage' role='button'>Image " + (i+1) + ": View Full Image</a></div></td></tr><tr><td><div class='actual-image'><img src='" + imgSrc + "' " + imageStyle + "></div></td></tr>";
              }
              formatString += imageString;
            }
          }).then(function(response) {
              var summaryInfo = document.getElementById("popupContent").innerHTML;
              document.getElementById("popupContent").innerHTML = summaryInfo + formatString;
            });
        });
      } else {
        setTimeout(function(){ when(interval);}, interval);
      }
    }
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
      suggestionDelay: 0,
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
