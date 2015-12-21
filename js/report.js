//get querystring value
"use strict";

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

require(["dojo/dom", "dojo/on", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "dojo/domReady!"], function (dom, on, Query, QueryTask, FeatureLayer) {

  var queryTask = new QueryTask("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1");

  var query = new Query();

  query.returnGeometry = false;
  query.outFields = ['OBJECTID', 'DOT_Num', 'Feature_Crossed', 'MP', 'LineName', 'Division', 'Subdivision', 'Branch', 'Town', 'County', 'FRA_LandUse', 'WDCode', 'SignSignal', 'Channelization', 'StopLine', 'RRXingPavMark', 'DynamicEnv', 'GateArmsRoad', 'GateArmsPed', 'GateConfig1', 'GateConfig2', 'Cant_Struc_Over', 'Cant_Struc_Side', 'Cant_FL_Type', 'FL_MastCount', 'Mast_FL_Type', 'BackSideFL', 'FlasherCount', 'FlasherSize', 'WaysideHorn', 'HTS_Control', 'HTS_for_Nearby_Intersection', 'BellCount', 'HTPS', 'HTPS_StorageDist', 'HTPS_StopLineDist', 'TrafficLnType', 'TrafficLnCount', 'Paved', 'XingIllum', 'SurfaceType', 'SurfaceType2', 'XingCond', 'FlangeMaterial', 'XingWidth', 'XingLength', 'Angle', 'SnoopCompliant', 'Comments'];

  var dotnumqs = getParameterByName("dotnum");

  //-----------------------------------------------------
  //------------Working Section------------------------------
  //-----------------------------------------------------

  var crossingUrl = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1";

  var crossingPoints = new FeatureLayer(crossingUrl, {
    id: "crossingPoints"
  });

  if (dotnumqs) {
    query.where = "DOT_Num like '%" + dotnumqs + "%'";
    queryTask.execute(query, getPhotos);
  }

  var imageString = "";

  function getPhotos(results) {
    var resultCount = results.features.length;
    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;
      var objectId = featureAttributes.OBJECTID;
      // ------------Get Picture URls and Build Image Tags------------------

      var imgClass = "class='img-responsive'";
      var imageStyle = "alt='site image' width='100%'";
      var deferred = new dojo.Deferred();

      crossingPoints.queryAttachmentInfos(objectId).then(function (response) {
        var imgSrc;
        if (response.length === 0) {
          deferred.resolve("no attachments");
        } else {
          for (i = 0; i < response.length; i++) {
            imgSrc = response[i].url;
            imageString += "<div class='col-sm-6 col-md-4'><img src='" + imgSrc + "' " + imgClass + " " + imageStyle + "></div>";
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
  function beginReport() {
    if (dotnumqs) {
      query.where = "DOT_Num like '%" + dotnumqs + "%'";
      queryTask.execute(query, showResults);
    }
  }

  // on(dom.byId("execute"), "click", execute);
  //
  // function execute () {
  //   //Create possible filters
  //   query.where = "DOT_Num like '%" + dom.byId("searchInput").value + "%' OR RRXingNum like '%" + dom.byId("searchInput").value + "%' OR XingCond like '%" + dom.byId("searchInput").value + "%'";
  //   queryTask.execute(query, showResults);
  // }

  function showResults(results) {
    var resultItems = [];
    var resultCount = results.features.length;

    //consolelog messages used to help debug image loading issues
    console.log("This text should be followed by the html string for the images if page loaded correctly (This is within the showResults function): " + imageString);
    // console.log(objectId);

    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;

      var html = "\n<div class='row'>\n  <div class='col-xs-12'>\n    <div class='page-header'>\n      <h1>Crossing Report</h1>\n    </div>\n  </div>\n</div>\n<div class='row'>\n\t<div class='col-sm-6'>\n\t\t<div class='panel panel-primary'>\n\t\t  <div id='xing-num' class='panel-heading' onmouseover='displayMD()' onmouseout='hideMD()'>\n\t\t    <h3 class='panel-title'>Crossing Number</h3>\n\t\t  </div>\n\t\t  <div class='panel-body text-center'>\n\t\t    <h3>\n      ";

      html += featureAttributes.DOT_Num;+"</h3>";

      html += "\n    </div>\n  </div>\n</div>\n<div class='col-sm-6'>\n  <div class='panel panel-danger'>\n    <div class='panel-heading'>\n      <h3 class='panel-title'>Surface Condition</h3>\n    </div>\n    <div class='panel-body text-center'>\n      <h3>\n      ";

      html += featureAttributes.XingCond;+"</h3>";

      html += "\n      </div>\n    </div>\n  </div>\n</div>\n<div class='row img-row'>\n  ";

      html += imageString;

      html += "\n</div>\n<div class='row'>\n  <div class='col-sm-12'>\n    <div class='page-header'>\n      <h1><small>Location Information</small></h1>\n    </div>\n  </div>\n</div>\n<div class='row'>\n  <div class='col-sm-4'>\n    <div class='panel panel-default'>\n      <div class='panel-heading'>Line Name</div>\n        <div class='panel-body'>\n          <strong>\n      ";

      html += featureAttributes.LineName + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Division</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Division + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Subdivision</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Subdivision + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Branch</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Branch + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>MP</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.MP + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Road Name</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Feature_Crossed + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Town</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Town + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>County</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.County + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-4'>\n  <div class='panel panel-default'>\n    <div class='panel-heading'>Land Use</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.FRA_LandUse + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-xs-12'>\n  <div class='page-header'>\n    <h1><small>Crossing Information</small></h1>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Paved</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Paved + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Surface Type</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.SurfaceType + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Surface Type 2</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.SurfaceType2 + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Flange Material</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.FlangeMaterial + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Crossing Width</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.XingWidth + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Crossing Length</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.XingLength + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Crossing Angle</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Angle + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-info'>\n    <div class='panel-heading'>Snooper Compliant</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.SnoopCompliant + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-12'>\n  <div class='page-header'>\n    <h1><small>Safety Information</small></h1>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Warning Device</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.WDCode + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Signs or Signals?</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.SignSignal + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Channelization</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Channelization + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Stop Line</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.StopLine + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Pavement Markings</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.RRXingPavMark + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Dynamic Envelope</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.DynamicEnv + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Gate Arms <small>(Vehicle)</small> </div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.GateArmsRoad + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Gate Arms <small>(Ped)</small> </div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.GateArmsPed + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Gate Configuration</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.GateConfig1 + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Special Gates</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.GateConfig2 + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Cantilevered (Road)</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Cant_Struc_Over + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Cantilevered (Side)</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Cant_Struc_Side + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Cantilevered Bulb</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Cant_FL_Type + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Mast Flashers</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.FL_MastCount + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Mast Flasher Type</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Mast_FL_Type;

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Back Side Flashers</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.BackSideFL + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Flasher Total Count</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.FlasherCount + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Flasher Size</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.FlasherSize + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Wayside Horn</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.WaysideHorn + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Traffic Signal Control</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.HTS_Control + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Traffic Signal Nearby</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.HTS_for_Nearby_Intersection + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Bell Count</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.BellCount + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Traffic Pre-Signals</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.HTPS + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Storage Distance</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.HTPS_StorageDist + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Stop-line Distance</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.HTPS_StopLineDist + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Traffic Lane Type</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.TrafficLnType + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Traffic Lane Count</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.TrafficLnCount + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n</div>\n<div class='row'>\n<div class='col-sm-3'>\n  <div class='panel panel-warning'>\n    <div class='panel-heading'>Crossing Illuminated</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.XingIllum + "</strong>";

      html += "\n      </div>\n  </div>\n</div>\n<div class='col-sm-9'>\n  <div class='panel panel-success'>\n    <div class='panel-heading'>Comments</div>\n      <div class='panel-body'>\n        <strong>\n      ";

      html += featureAttributes.Comments + "</strong>";
      html += "\n      </div>\n  </div>\n</div>\n</div>\n      ";
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
