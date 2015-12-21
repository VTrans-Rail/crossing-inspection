//get querystring value
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


require([
  "dojo/dom", "dojo/on",
  "esri/tasks/query", "esri/tasks/QueryTask",
  "esri/layers/FeatureLayer",
  "dojo/domReady!"
], function (dom, on, Query, QueryTask, FeatureLayer) {

  var queryTask = new QueryTask("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1");

  var query = new Query();

  query.returnGeometry = false;
  query.outFields = [
    'OBJECTID','DOT_Num','Feature_Crossed','MP',
    'LineName','Division','Subdivision',
    'Branch','Town','County',
    'FRA_LandUse','WDCode','SignSignal',
    'Channelization','StopLine','RRXingPavMark',
    'DynamicEnv','GateArmsRoad','GateArmsPed',
    'GateConfig1','GateConfig2','Cant_Struc_Over',
    'Cant_Struc_Side','Cant_FL_Type','FL_MastCount',
    'Mast_FL_Type','BackSideFL','FlasherCount',
    'FlasherSize','WaysideHorn','HTS_Control',
    'HTS_for_Nearby_Intersection','BellCount','HTPS',
    'HTPS_StorageDist','HTPS_StopLineDist','TrafficLnType',
    'TrafficLnCount','Paved','XingIllum',
    'SurfaceType','SurfaceType2','XingCond',
    'FlangeMaterial','XingWidth','XingLength',
    'Angle','SnoopCompliant','Comments'
  ];

  var dotnumqs = getParameterByName("dotnum");


//-----------------------------------------------------
//------------Working Section------------------------------
//-----------------------------------------------------

  var crossingUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1";

  var crossingPoints = new FeatureLayer(crossingUrl, {
    id: "crossingPoints",
  });


  if (dotnumqs)
    {
      query.where = "DOT_Num like '%" + dotnumqs + "%'";
      queryTask.execute(query,getPhotos);
    }

    var imageString = "";


  function getPhotos (results) {
    var resultCount = results.features.length;
    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;
      var objectId = featureAttributes.OBJECTID;
      // ------------Get Picture URls and Build Image Tags------------------

      var imgClass = "class='img-responsive'";
      var imageStyle = "alt='site image' width='100%'";
      var deferred = new dojo.Deferred;

      crossingPoints.queryAttachmentInfos(objectId).then(function(response){
        var imgSrc;
        if (response.length === 0) {
          deferred.resolve("no attachments");
        }
        else {
          for ( i = 0; i < response.length; i++) {
            imgSrc = response[i].url;
            // imageString += "<div class='col-sm-6 col-md-4'><img src='" + imgSrc + "' " + imgClass + " " + imageStyle + "></div>";
            imageString += "<div data-field-span='1'><img src='" + imgSrc + "' " + imgClass + " " + imageStyle + "></div>";
          }
        }

        //consolelog messages used to help debug image loading issues
        console.log("This text should be followed by the html string for the images if page loaded correctly (This is within the queryAttachment): " + imageString);
      });
      //---------------------------------------------------------------------
    }
  }


//-----------------------------------------------------
//-----------------------------------------------------



  //Ensures that photos load by preventing the rest of the report from being generated until the attachment query from being complete
  on(crossingPoints, "query-attachment-infos-complete", beginReport);
  function beginReport () {
    if (dotnumqs)
      {
        query.where = "DOT_Num like '%" + dotnumqs + "%'";
        queryTask.execute(query,showResults);
      }
  }


  // on(dom.byId("execute"), "click", execute);
  //
  // function execute () {
  //   //Create possible filters
  //   query.where = "DOT_Num like '%" + dom.byId("searchInput").value + "%' OR RRXingNum like '%" + dom.byId("searchInput").value + "%' OR XingCond like '%" + dom.byId("searchInput").value + "%'";
  //   queryTask.execute(query, showResults);
  // }

  function showResults (results) {
    var resultItems = [];
    var resultCount = results.features.length;

    //consolelog messages used to help debug image loading issues
    console.log("This text should be followed by the html string for the images if page loaded correctly (This is within the showResults function): " + imageString);
    // console.log(objectId);

    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;

      var html=`
      <form class="grid-form">
          <fieldset>
              <legend>Crossing Details</legend>
              <div data-row-span="4">
                  <div data-field-span="1" id='xing-num' onmouseover='displayMD(this)' onmouseout='hideMD(this)' ontouchstart='displayMD(this)' ontouchend='hideMD(this)'>
                    <label>Crossing Number</label>
                    <input type="text" disabled="true" value="` + featureAttributes.DOT_Num + `">
                  </div>
                  <div data-field-span="1" id='surf-cond' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>Surface Condition</label>
                    <input type="text" disabled="true" value="` + featureAttributes.XingCond + `">
                  </div>
                  <div data-field-span="1" id='feature-crossed' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>Road Name</label>
                    <input type="text" disabled="true" value="` + featureAttributes.Feature_Crossed + `">
                  </div>
                  <div data-field-span="1" id='town' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>Town</label>
                    <input type="text" disabled="true" value="` + featureAttributes.Town + `">
                  </div>
              </div>
              <div data-row-span="4">
                  <div data-field-span="2" id='rail-division' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>Rail Division</label>
                    <input type="text" disabled="true" value="` + featureAttributes.Division + `">
                  </div>
                  <div data-field-span="1" id='rail-subdivision' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>Subdivision</label>
                    <input type="text" disabled="true" value="` + featureAttributes.Subdivision + `">
                  </div>
                  <div data-field-span="1" id='mile-post' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                    <label>MP</label>
                    <input type="text" disabled="true" value="` + featureAttributes.MP + `">
                  </div>
              </div>
          </fieldset>
          <fieldset>
            <legend>Crossing Photos</legend>
            <div data-row-span="2">` + imageString + `</div>
            <!--<div data-row-span="2">
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6798">
              </div>
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6799">
              </div>
            </div>
            <div data-row-span="2">
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6800">
              </div>
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6801">
              </div>
            </div>
            <div data-row-span="2">
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6802">
              </div>
              <div data-field-span="1">
                <input type="image" disabled="true" src="http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1/401/attachments/6803">
              </div>
            </div>-->
          </fieldset>
          <fieldset>
            <legend>Crossing Details</legend>
            <!-- <div data-row-span="6">
              <div data-field-span="1">
                <label>Paved</label>
                <input type="checkbox" disabled="true" checked>
              </div>
              <div data-field-span="1">
                <label>Illuminated</label>
                <input type="checkbox" disabled="true" checked>
              </div>
              <div data-field-span="1">
                <label>Road within 500'</label>
                <input type="checkbox" disabled="true" checked>
              </div>
            </div> -->
            <!-- <div data-row-span="5">
              <div data-field-span="1">
                <label>AOT Class</label>
                <input type="text" disabled="true" value="3">
              </div>
              <div data-field-span="1">
                <label>Functional Class</label>
                <input type="text" disabled="true" value="3">
              </div>
              <div data-field-span="2">
                <label>Pavement Marking Condition</label>
                <input type="text" disabled="true" value="Good">
              </div>
              <div data-field-span="1">
                <label>Number of Tracks</label>
                <input type="text" disabled="true" value="3">
              </div>
            </div> -->
            <div data-row-span="6">
              <div data-field-span="2" id='surf-type' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Main Surface Material</label>
                <input type="text" disabled="true" value="` + featureAttributes.SurfaceType + `">
              </div>
              <div data-field-span="2" id='surf-type-two' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Secondary Surface Material</label>
                <input type="text" disabled="true" value="` + featureAttributes.SurfaceType2 + `">
              </div>
              <div data-field-span="1" id='snooper' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Snooper Compliant</label>
                <input type="text" disabled="true" value="` + featureAttributes.SnoopCompliant + `">
              </div>
              <div data-field-span="1" id='flange-material' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Flange Material</label>
                <input type="text" disabled="true" value="` + featureAttributes.FlangeMaterial + `">
              </div>
            </div>
            <div data-row-span="6">
              <div data-field-span="2" id='number-tracks' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Number of Tracks</label>
                <input type="text" disabled="true" value="` + featureAttributes.NumTracks + `">
              </div>
              <div data-field-span="2" id='crossing-angle' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Angle</label>
                <input type="text" disabled="true" value="` + featureAttributes.Angle + `">
              </div>
              <div data-field-span="1" id='crossing-width' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Width</label>
                <input type="text" disabled="true" value="` + featureAttributes.XingWidth + `">
              </div>
              <div data-field-span="1" id='crossing-length' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Length</label>
                <input type="text" disabled="true" value="` + featureAttributes.XingLength + `">
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Safety Information</legend>
            <div data-row-span="3">
              <div data-field-span="1" id='warning-device-code' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Warning Device</label>
                <input type="text" disabled="true" value="` + featureAttributes.WDCode + `">
              </div>
              <div data-field-span="1" id='channelization' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Channelization</label>
                <input type="text" disabled="true" value="` + featureAttributes.Channelization + `">
              </div>
              <div data-field-span="1" id='illuminated' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Illuminated</label>
                <input type="text" disabled="true" value="` + featureAttributes.XingIllum + `">
              </div>
            </div>
            <div data-row-span="4">
              <div data-field-span="1" id='paved' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Paved</label>
                <input type="text" disabled="true" value="` + featureAttributes.Paved + `">
              </div>
              <div data-field-span="1" id='stop-line' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Stop Line</label>
                <input type="text" disabled="true" value="` + featureAttributes.StopLine + `">
              </div>
              <div data-field-span="1" id='rr-pave-mark' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>RR Pavement Markings</label>
                <input type="text" disabled="true" value="` + featureAttributes.RRXingPavMark + `">
              </div>
              <div data-field-span="1" id='pave-mark-cond' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Pavement Markings Condition</label>
                <input type="text" disabled="true" value="` + featureAttributes.PavMarkCond + `">
              </div>
            </div>
            <div data-row-span="3">
              <div data-field-span="1" id='gates-road' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Gate Arms (Vehicle)</label>
                <input type="text" disabled="true" value="` + featureAttributes.GateArmsRoad + `">
              </div>
              <div data-field-span="1" id='gates-ped' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Gate Arms (Pedestrian)</label>
                <input type="text" disabled="true" value="` + featureAttributes.GateArmsPed + `">
              </div>
              <div data-field-span="1" id='gate-config' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Gate Configuration</label>
                <input type="text" disabled="true" value="` + featureAttributes.GateConfig1 + `">
              </div>
            </div>
            <div data-row-span="3">
              <div data-field-span="1" id='cant-struc-over' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Catilevered Masts over Road</label>
                <input type="text" disabled="true" value="` + featureAttributes.Cant_Struc_Over + `">
              </div>
              <div data-field-span="1" id='cant-struc-side' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Cantilevered Mast Beside Road</label>
                <input type="text" disabled="true" value="` + featureAttributes.Cant_Struc_Side + `">
              </div>
              <div data-field-span="1" id='cant-bulb-type' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Cantilevered Bulbs</label>
                <input type="text" disabled="true" value="` + featureAttributes.Cant_FL_Type + `">
              </div>
            </div>
            <div data-row-span="2">
              <div data-field-span="1" id='basic-mast-count' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Mast Count (Not Cantilevered)</label>
                <input type="text" disabled="true" value="` + featureAttributes.FL_MastCount + `">
              </div>
              <div data-field-span="1" id='mast-bulb-type' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Mast Bulbs</label>
                <input type="text" disabled="true" value="` + featureAttributes.Mast_FL_Type + `">
              </div>
            </div>
            <div data-row-span="4">
              <div data-field-span="1" id='back-side-fl' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Back or Side Flashers</label>
                <input type="text" disabled="true" value="` + featureAttributes.BackSideFL + `">
              </div>
              <div data-field-span="1" id='flasher-count' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Total Flasher Pair Count</label>
                <input type="text" disabled="true" value="` + featureAttributes.FlasherCount + `">
              </div>
              <div data-field-span="1" id='flasher-size' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Flasher Bulb Size</label>
                <input type="text" disabled="true" value="` + featureAttributes.FlasherSize + `">
              </div>
              <div data-field-span="1" id='bell-count' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Bell Count</label>
                <input type="text" disabled="true" value="` + featureAttributes.BellCount + `">
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Vehicular Traffic Information</legend>
            <div data-row-span="2">
              <div data-field-span="1" id='traffic-lane-type' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Traffic Lane Type</label>
                <input type="text" disabled="true" value="` + featureAttributes.TrafficLnType + `">
              </div>
              <div data-field-span="1" id='traffic-lane-count' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Traffic Lane Count</label>
                <input type="text" disabled="true" value="` + featureAttributes.TrafficLnCount + `">
              </div>
            </div>
            <div data-row-span="3">
              <div data-field-span="1" id='hts-nearby-int' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Traffic Signal Nearby</label>
                <input type="text" disabled="true" value="` + featureAttributes.HTS_for_Nearby_Intersection + `">
              </div>
              <div data-field-span="1" id='int-road' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Intersection Nearby (less 500 ft)</label>
                <input type="text" disabled="true" value="` + featureAttributes.IntRd500 + `">
              </div>
              <div data-field-span="1" id='int-road-distance' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Distance to Intersection</label>
                <input type="text" disabled="true" value="` + featureAttributes.IntRdDist + `">
              </div>
            </div>
            <div data-row-span="2">
              <div data-field-span="1" id='road-funcl' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>Functional Classification</label>
                <input type="text" disabled="true" value="` + featureAttributes.RDS_FUNCL + `">
              </div>
              <div data-field-span="1" id='road-aot' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <label>AOT Classification</label>
                <input type="text" disabled="true" value="` + featureAttributes.RDS_AOTCLASS + `">
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>General Comments</legend>
            <div data-row-span="1">
              <div data-field-span="1" id='comments' onmouseover='displayMD(this)' onmouseout='hideMD(this)'>
                <input type="text" disabled="true" value="` + featureAttributes.Comments + `">
              </div>
            </div>
          </fieldset>
      </form>`;

    }
    dom.byId("info").innerHTML = html;
  }

  // function showResults (results) {
  //   var resultItems = [];
  //   var resultCount = results.features.length;
  //   for (var i = 0; i < resultCount; i++) {
  //     var featureAttributes = results.features[i].attributes;
  //     for (var attr in featureAttributes) {
  //         resultItems.push("<div class='col-xs-12 col-sm-4 col-md-3'><strong>" + attr + ":</strong> " + featureAttributes[attr] + "</div>");
  //       }
  //     resultItems.push("<br>");
  //   }
  //   dom.byId("info").innerHTML = resultItems.join("");
  // }
});
