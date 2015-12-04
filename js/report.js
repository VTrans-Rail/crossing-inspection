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
<div class='row'>
  <div class='col-xs-12'>
    <div class='page-header'>
      <h1>Crossing Report</h1>
    </div>
  </div>
</div>
<div class='row'>
	<div class='col-sm-6'>
		<div class='panel panel-primary'>
		  <div class='panel-heading'>
		    <h3 class='panel-title'>Crossing Number</h3>
		  </div>
		  <div class='panel-body text-center'>
		    <h3>
      `;

      html += featureAttributes.DOT_Num; + "</h3>"

      html += `
    </div>
  </div>
</div>
<div class='col-sm-6'>
  <div class='panel panel-danger'>
    <div class='panel-heading'>
      <h3 class='panel-title'>Surface Condition</h3>
    </div>
    <div class='panel-body text-center'>
      <h3>
      `;

      html += featureAttributes.XingCond; + "</h3>"

      html += `
      </div>
    </div>
  </div>
</div>
<div class='row img-row'>
  `;

  html += imageString;

  html += `
</div>
<div class='row'>
  <div class='col-sm-12'>
    <div class='page-header'>
      <h1><small>Location Information</small></h1>
    </div>
  </div>
</div>
<div class='row'>
  <div class='col-sm-4'>
    <div class='panel panel-default'>
      <div class='panel-heading'>Line Name</div>
        <div class='panel-body'>
          <strong>
      `;

      html += featureAttributes.LineName + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Division</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Division + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Subdivision</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Subdivision + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Branch</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Branch + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>MP</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.MP + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Road Name</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Feature_Crossed + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Town</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Town + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>County</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.County  + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-4'>
  <div class='panel panel-default'>
    <div class='panel-heading'>Land Use</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.FRA_LandUse  + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-xs-12'>
  <div class='page-header'>
    <h1><small>Crossing Information</small></h1>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Paved</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Paved  + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Surface Type</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.SurfaceType  + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Surface Type 2</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.SurfaceType2  + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Flange Material</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.FlangeMaterial + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Crossing Width</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.XingWidth + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Crossing Length</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.XingLength + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Crossing Angle</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Angle + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-info'>
    <div class='panel-heading'>Snooper Compliant</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.SnoopCompliant + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-12'>
  <div class='page-header'>
    <h1><small>Safety Information</small></h1>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Warning Device</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.WDCode + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Signs or Signals?</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.SignSignal + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Channelization</div>
      <div class='panel-body'>
        <strong>
      `;


      html += featureAttributes.Channelization + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Stop Line</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.StopLine + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Pavement Markings</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.RRXingPavMark + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Dynamic Envelope</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.DynamicEnv + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Gate Arms <small>(Vehicle)</small> </div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.GateArmsRoad + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Gate Arms <small>(Ped)</small> </div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.GateArmsPed + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Gate Configuration</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.GateConfig1 + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Special Gates</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.GateConfig2 + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Cantilevered (Road)</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Cant_Struc_Over + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Cantilevered (Side)</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Cant_Struc_Side + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Cantilevered Bulb</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Cant_FL_Type + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Mast Flashers</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.FL_MastCount + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Mast Flasher Type</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Mast_FL_Type

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Back Side Flashers</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.BackSideFL + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Flasher Total Count</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.FlasherCount + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Flasher Size</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.FlasherSize + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Wayside Horn</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.WaysideHorn + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Traffic Signal Control</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.HTS_Control + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Traffic Signal Nearby</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.HTS_for_Nearby_Intersection + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Bell Count</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.BellCount + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Traffic Pre-Signals</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.HTPS + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Storage Distance</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.HTPS_StorageDist + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Stop-line Distance</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.HTPS_StopLineDist + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Traffic Lane Type</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.TrafficLnType + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Traffic Lane Count</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.TrafficLnCount + "</strong>";

      html += `
      </div>
  </div>
</div>
</div>
<div class='row'>
<div class='col-sm-3'>
  <div class='panel panel-warning'>
    <div class='panel-heading'>Crossing Illuminated</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.XingIllum + "</strong>";

      html += `
      </div>
  </div>
</div>
<div class='col-sm-9'>
  <div class='panel panel-success'>
    <div class='panel-heading'>Comments</div>
      <div class='panel-body'>
        <strong>
      `;

      html += featureAttributes.Comments + "</strong>";
      html += `
      </div>
  </div>
</div>
</div>
      `;

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
