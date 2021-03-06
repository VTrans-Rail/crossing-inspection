// ----------------------------------------------------------------------------
// -------------This is the mainIE9.js index.html or homepage when the browser
// is IE9. Please see the main.js file for more detailed documentation-------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

require([
  "maptiks/map",
  "esri/arcgis/utils",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/LayerInfo",
  "esri/dijit/Popup", "esri/dijit/PopupTemplate",
  "esri/dijit/LocateButton",
  "esri/dijit/Legend",
  "esri/geometry/Extent",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/Font",
  "esri/symbols/CartographicLineSymbol",
  "esri/symbols/SimpleFillSymbol", "esri/Color",
  "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/on",
  "dojo/dom-attr", "dojo/dom",
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
    Extent,
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
      maptiks_trackcode: 'afbe75a4-bb16-4c19-92cf-e2c9cd8e98ed',
      maptiks_id: 'Crossing Inspection',
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
    }, "locate-button");
    geoLocate.startup();

    on(geoLocate, "locate", function() {
      //Google Analytics
      ga('send', 'event', { eventCategory: 'Locate', eventAction: 'GeoLocate', eventLabel: 'Use Geolocation Button'});
    });
//------------------------------------------------------------------



//------------------------------------------------------------------
// -----------------Define PopupTemplates------------------------------
//------------------------------------------------------------------
    //Crossing Template--------------
    var crossingPopupFeatures = "<div id='popup-content' style='overflow-y:auto'><small>DOT Crossing Number:</small> <b>${DOT_Num}</b></br><small>Line Name:</small> <b>${LineName}</b></br><small>Feature Crossed:</small> <b>${Feature_Crossed}</b></br><small>Warning Device Level:</small> <b><span id='popup-content-warn-code'>${WDCode}</span></b></br><small>Primary Surface Material:</small> <b>${SurfaceType}</b></br><small>Crossing Codition:</small> <b>${XingCond}</b></br> </br>     <button type='button' id='popup-content-pictures' class='btn btn-sm btn-default text-center btnHelp' style='display:none;'>&#x25BC Pictures &#x25BC</button></div>";

    var crossingTemplate = new PopupTemplate({
      title: "Crossing {DOT_Num}",
    });
    //Provides warning if popup doesn't load properly and clears out editSummary
    crossingTemplate.setContent("<h1>Oops!</h1></br><b>Please close popup and try again.</b></br>The summary information and pictures for this crossing did not load properly.");


    //Sign Template------------------
    var signPopupFeatures = "<div id='popup-content' ><small>Associated Crossing DOT#:</small> <b>${DOT_Num}</b></br><small>Type of Sign:</small> <b>${SignType}</b></br><small>Type of Post:</small> <b>${Post}</b></br><small>ASTM Reflective Sheeting:</small> <b>${Reflective}</b></br><small>Reflective Sheeting Condition:</small> <b>${ReflSheetCond}</b></br><small>Installation Date:</small> <b>${InstallDate}</b></br><small>Overall Condition:</small> <b>${SignCondition}</b></br> </br>   <button type='button' id='popup-content-pictures' class='btn btn-sm btn-default text-center btnHelp' style='display:none;'>&#x25BC Pictures &#x25BC</button></div>";

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
    var crossingUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/CrossingInspection2017_inspect_Inspected/FeatureServer/0";

    var crossingPoints = new FeatureLayer(crossingUrl, {
      id: "crossing-points",
      outFields: [
          'OBJECTID','DOT_Num','Feature_Crossed','MP',
          'LineName','Division','Subdivision',
          'Branch','Town','County',
          'FRA_LandUse','WDCode','SignSignal',
          'Channelization','StopLine','RRXingPavMark',
          'DynamicEnv','GateArmsRoad','GateArmsPed',
          'GateConfig1','GateConfig2','Cant_Struc_Over',
          'Cant_Struc_Side','Cant_FL_Type','FL_MastCount',
          'Mast_FL_Type','BackSideFL','FlasherCount',
          'FlasherSize','Waypopup-contentorn','HTS_Control',
          'HTS_for_Nearby_Intersection','BellCount','HTPS',
          'HTPS_StorageDist','HTPS_StopLineDist','TrafficLnType',
          'TrafficLnCount','Paved','XingIllum',
          'SurfaceType','SurfaceType2','XingCond',
          'FlangeMaterial','XingWidth','XingLength',
          'Angle','SnoopCompliant','Comments', 'IntRd500', 'IntRdDist',
          'Num_Tracks', 'PaveMarkCond', 'RDS_AOTCLASS', 'RDS_FUNCL',
        ],
      infoTemplate: crossingTemplate,
      minScale: 650000,
    });
    crossingTemplate.setContent(crossingPopupFeatures);

    var crossingPointsSearch = new FeatureLayer("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspection2015WebAppSearch/FeatureServer/0", {
      outFields: [
          'OBJECTID','DOT_Num','Feature_Crossed','MP',
          'LineName','Division','Subdivision',
          'Branch','Town','County',
          'FRA_LandUse','WDCode','SignSignal',
          'SurfaceType','SurfaceType2','XingCond',
          'XingWidth','XingLength','Comments',
        ],
    });



    //Create Sign Feature Layer---------------------------------
    var signUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/CrossingInspection2017_inspect_Inspected/FeatureServer/1";

    var signPoints = new FeatureLayer(signUrl, {
      id: "sign-points",
      displayField: "DOT_Num",
      outFields: ["*"],
      infoTemplate: signTemplate,
      minScale: 3000,
    });
    signTemplate.setContent(signPopupFeatures);


    //Create Rail Line Feature Layer----------------------------
    var lineUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/Rail_Lines/MapServer/0";

    var railLine = new FeatureLayer(lineUrl, {
      id: "rail-line",
      outFields: ["*"],
    });


    //Create Mile Posts Feature Layers-------------------------------
    var mpTenUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/3";

    var mpFiveUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/2";

    var mpOneUrl = "https://maps.vtrans.vermont.gov/arcgis/rest/services/Rail/Rail_MilePosts/MapServer/1";

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
    var legendOpen = document.getElementById('mobile-legend-open');
    if (legendOpen) {
      legendOpen.addEventListener('click', function () {
        document.getElementById('legend').style.display = "block";
        document.getElementById('mobile-legend-open').style.display = "none";
        document.getElementById('mobile-legend-close').style.display = "block";

        //Google Analytics
        ga('send', 'event', { eventCategory: 'Legend', eventAction: 'Open', eventLabel: 'Open Mobile Legend'});
      });
    }

    var legendClose = document.getElementById('mobile-legend-close');
    if (legendClose) {
      legendClose.addEventListener('click', function () {
        document.getElementById('legend').style.display = "none";
        document.getElementById('mobile-legend-open').style.display = "block";
        document.getElementById('mobile-legend-close').style.display = "none";

        //Google Analytics
        ga('send', 'event', { eventCategory: 'Legend', eventAction: 'Close', eventLabel: 'Close Mobile Legend'});
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
    }, "legend-div");
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
    "target": "_blank",
    // "onclick": "fullReportLink(dotnum)"
  }, dojo.query(".actionList", map.infoWindow.domNode)[0]);
//------------------------------------------------------------------------



//---------------------------------------------------------------------------
//---------------------Display Photos in Popup--------------------------------
//---------------------------------------------------------------------------
//---------------------Build Link to Report Page------------------------------
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

      //Google Analytics -- Records when the full report link is chosen from the popup along with the DOT num of the crossing
      link.onclick = function () {
            ga('send', 'event', { eventCategory: 'Popup', eventAction: 'View Full Report', eventLabel: dotnum + ' - Full Report Link Hit'});
          }


      // Google Analytics
      if( popup.getSelectedFeature()._layer.id.length > 12 ) {
        ga('send', 'event', { eventCategory: 'Popup', eventAction: 'Crossing Popup View', eventLabel: dotnum + ' - Crossing Popup Views'});
      } else {
        ga('send', 'event', { eventCategory: 'Popup', eventAction: 'Sign Popup View', eventLabel: dotnum + ' - Sign Popup Views'});
      }


      // Updates Domain Codes to Coded Value, aka description or alias
      if (document.getElementById('popup-content-warn-code')) {
        var warn = document.getElementById('popup-content-warn-code').innerHTML;

        if (warn === "StopYield") {
          document.getElementById('popup-content-warn-code').innerHTML = "Stop or Yield";
        } else if (warn === "XB") {
          document.getElementById('popup-content-warn-code').innerHTML = "Crossbucks";
        } else if (warn === "Flashers") {
          document.getElementById('popup-content-warn-code').innerHTML = "Flashing Lights";
        } else if (warn === "Gates") {
          document.getElementById('popup-content-warn-code').innerHTML = "1 to 3 Gates";
        } else if (warn === "FullQuad") {
          document.getElementById('popup-content-warn-code').innerHTML = "Four Quad (full barrier) Gates";
        } else if (warn === "Other") {
          document.getElementById('popup-content-warn-code').innerHTML = "Other signs or signals";
        } else if (warn === "Other AWD") {
          document.getElementById('popup-content-warn-code').innerHTML = "Other Active Device (flagging)";
        } else if (warn === "None") {
          document.getElementById('popup-content-warn-code').innerHTML = "No signs or signals";
        }
      }


      var pictureOpen = document.getElementById('popup-content-pictures');


      pictureOpen.style.display = "inline-block";

      if (pictureOpen) {
        pictureOpen.addEventListener('click', function () {
          pictureOpen.style.display = "none";

          var objectId = popup.getSelectedFeature().attributes.OBJECTID;

          var imageString = "<table><tr>";
          var imageStyle = "alt='site image' width='100%'";

          var selectedLayer = "";

          var selectedLayerId = popup.getSelectedFeature()._layer.id;

          if ( selectedLayerId.length > 12 ) {
            selectedLayer = crossingPoints;
          } else {
            selectedLayer = signPoints;
          }

          selectedLayer.queryAttachmentInfos(objectId).then(function(response){
            var imgSrc;
            if (response.length === 0) {
              deferred.resolve("no attachments");
            }
            else {
              if (selectedLayerId.length > 12) {
                for ( j = 0; j < response.length; j++ ) {
                  imgSrc = response[j].url;
                  imageString += "<tr><td></br></td></tr><tr><td><div class='img-link'><a onclick='crossingImageGA()' href='photo.html?url=" + imgSrc + "' target='_blank' class='btn btn-xs btn-default btnImage' role='button'>Image " + (j+1) + ": View Full Image</a></div></td></tr><tr><td><div class='actual-image'>" + "<img src='" + imgSrc + "' " + imageStyle + ">" + "</div></td></tr>";
                }
              } else {
                for ( j = 0; j < response.length; j++ ) {
                  imgSrc = response[j].url;
                  imageString += "<tr><td></br></td></tr><tr><td><div class='img-link'><a onclick='signImageGA()' href='photo.html?url=" + imgSrc + "' target='_blank' class='btn btn-xs btn-default btnImage' role='button'>Image " + (j+1) + ": View Full Image</a></div></td></tr><tr><td><div class='actual-image'>" + "<img src='" + imgSrc + "' " + imageStyle + ">" + "</div></td></tr>";
                }
              }
            }
          }).then(function(response) {
              var summaryInfo = document.getElementById("popup-content").innerHTML;
              document.getElementById("popup-content").innerHTML = summaryInfo + imageString;

              //Google Analytics
              ga('send', 'event', { eventCategory: 'Popup', eventAction: 'View', eventLabel: 'Popup Image Views'});
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
      allPlaceholder: "Search by DOT #, Rail Line, Condition, or Place",
      enableLabel: false,
      enableInfoWindow: true,
      showInfoWindowOnSelect: false,
      enableHighlight: false,
      map: map,
      suggestionDelay: 0,
    }, "search");

    //Create blank searchSources array
    var searchSources = [];

    //Push the first source used to search to searchSources array
    searchSources.push({
      featureLayer: crossingPointsSearch,
      searchFields: ["DOT_Num", "RRXingNum", "Town", "County", "LineName", "Division", "Subdivision", "Branch", "Feature_Crossed", "XingCond"],
      displayField: "DOT_Num",
      suggestionTemplate: "${DOT_Num}: The ${LineName} crosses ${Feature_Crossed} in ${Town}. (${XingCond})",
      exactMatch: false,
      outFields: ["DOT_Num", "RRXingNum", "Town", "County", "LineName", "Feature_Crossed", "XingCond"],
      name: "Railroad Crossings",
      placeholder: "Search by DOT #, Line, Street, Town, or County",
      maxResults: 500,
      maxSuggestions:500,

      enableSuggestions: true,
      minCharacters: 0
    });

    if (map.width < 358) {
      searchWidget.allPlaceholder = "Search";
      // document.getElementById("search_input").style.fontSize = "1.25em";
    } else if (map.width < 439) {
      searchWidget.allPlaceholder = "Search Crossings or Places";
      document.getElementById("search_input").style.fontSize = "1em";
    }

    //create extent to limit search Results
    var extent = new esri.geometry.Extent({
      "xmin":-73.31,
      "ymin":42.75,
      "xmax":-71.65,
      "ymax":45.00,
    });

    searchWidget.sources[0].maxSuggestions = 5;
    searchWidget.sources[0].searchExtent = extent;

    //Push the second source used to search to searchSources array(World Geocoding Service).
    searchSources.push(searchWidget.sources[0]);

    // Set the source for the searchWidget to the properly ordered searchSources array
    searchWidget.set("sources", searchSources);


    //Finalize creation of the search widget
    searchWidget.startup();

    on(searchWidget, "search-results", function() {

      var searchString = searchWidget.value;

      //Google Analytics --- Records Total Amount of Searches Executed
      ga('send', 'event', { eventCategory: 'Search', eventAction: 'Execute', eventLabel: 'Search Executed'});

      //Google Analytics -- Records the string that was present when the search is executed. If a feature is picked from the dropdown menu, the display name, or DOT_Num, is recorded as the input string
      ga('send', 'event', { eventCategory: 'SearchString', eventAction: 'Total', eventLabel: searchString });


      if (searchWidget.searchResults === null) {
        //Google Analytics -- Records any searches executed that returned 0 results
        ga('send', 'event', { eventCategory: 'Search', eventAction: 'Failure', eventLabel: 'Search Input Had No Results'});

        //Google Analytics -- Records any failed searches organized by search term
        ga('send', 'event', { eventCategory: 'SearchString', eventAction: 'Failure', eventLabel: searchString + ' - Search Input Had No Results'});
      }
      else {
        var results = new Array(searchWidget.searchResults[0]);
        var selections = results[0]

        //Google Analytics -- Records any search that at least one crossing match for results
        ga('send', 'event', { eventCategory: 'Search', eventAction: 'Success', eventLabel: 'Search Input Had Results'});
        if (results[0].length === 1) {
          //Google Analytics -- Records searches that have only one result. Indicates that the user probably knew what crossing they were looking for and successfuly found it with the current search widget settings.
          ga('send', 'event', { eventCategory: 'Search', eventAction: 'Precise', eventLabel: 'Search Input Had Exactly One Result'});
        }
      }
    });

    on(searchWidget, "suggest-results", function() {
      if (searchWidget.suggestResults === null) {
        //do nothing
      } else {

        var originalSuggestions = document.getElementsByClassName("suggestionsMenu")[0].innerHTML;

        var suggestions = new Array(searchWidget.suggestResults[0]);

        var insertSuggestCount = "<li id='search-suggest-totals' tabindex='0'>" + suggestions[0].length + " crossings match your current query.<hr style='margin: 10px 0px 5px 0px; padding: 0px 14px;'></li>";

        var newSuggestions = "<div>" + insertSuggestCount + originalSuggestions.slice(5);

        document.getElementsByClassName("suggestionsMenu")[0].innerHTML = newSuggestions;
      }
    })
});
