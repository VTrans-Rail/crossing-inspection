//get querystring value
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


require([
  "dojo/dom", "dojo/on",
  "esri/tasks/query", "esri/tasks/QueryTask", "dojo/domReady!"
], function (dom, on, Query, QueryTask) {

  var queryTask = new QueryTask("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1");

  var query = new Query();

  query.returnGeometry = false;
  query.outFields = [
    'DOT_Num','Feature_Crossed','MP',
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

  if (dotnumqs)
    {
      query.where = "DOT_Num like '%" + dotnumqs + "%'";
      queryTask.execute(query,showResults);
    }


  // on(dom.byId("execute"), "click", execute);

  function execute () {
    //Create possible filters
    //query.where = "DOT_Num like '%" + dom.byId("searchInput").value + "%' OR RRXingNum like '%" + dom.byId("searchInput").value + "%' OR XingCond like '%" + dom.byId("searchInput").value + "%'";
    queryTask.execute(query, showResults);
  }

  function showResults (results) {
    var resultItems = [];
    var resultCount = results.features.length;
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

      html += "</h3> </div></div></div></div><div class='row img-row'> <div class='col-sm-6'> <img src='https://placeimg.com/640/480/tech' class='img-responsive'/> </div><div class='col-sm-6'> <img src='https://placeimg.com/640/480/arch' class='img-responsive'/> </div></div><div class='row img-row'> <div class='col-xs-12 col-sm-6'> <img src='https://placeimg.com/640/480/nature' class='img-responsive'/> </div><div class='col-xs-12 col-sm-6'> <img src='https://placeimg.com/640/480/arch/grayscale' class='img-responsive'/> </div></div></div><div class='row'><div class='col-sm-12'> <div class='page-header'> <h1><small>Location Information</small></h1> </div></div></div><div class='row'><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Line Name</div><div class='panel-body'> <strong>";

      html += featureAttributes.LineName;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Division</div><div class='panel-body'> <strong>";

      html += featureAttributes.Division;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Subdivision</div><div class='panel-body'> <strong>";

      html += featureAttributes.Subdivision;

      html += "</strong> </div></div></div></div><div class='row'><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Branch</div><div class='panel-body'> <strong>";

      html += featureAttributes.Branch;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>MP</div><div class='panel-body'> <strong>";

      html += featureAttributes.MP;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Road Name</div><div class='panel-body'> <strong>";

      html += featureAttributes.Feature_Crossed;

      html += "</strong> </div></div></div></div><div class='row'><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Town</div><div class='panel-body'> <strong>";

      html += featureAttributes.Town;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>County</div><div class='panel-body'> <strong>";

      html += featureAttributes.County;

      html += "</strong> </div></div></div><div class='col-sm-4'> <div class='panel panel-default'> <div class='panel-heading'>Land Use</div><div class='panel-body'> <strong>";

      html += featureAttributes.FRA_LandUse;

      html += "</strong> </div></div></div></div><div class='row'> <div class='col-xs-12'> <div class='page-header'> <h1><small>Crossing Information</small></h1> </div></div></div><div class='row'> <div class='col-sm-3'> <div class='panel panel-info'> <div class='panel-heading'>Paved</div><div class='panel-body'> <strong>";

      html += featureAttributes.Paved;

      html += "</strong> </div></div></div><div class='col-sm-3'> <div class='panel panel-info'> <div class='panel-heading'>Surface Type</div><div class='panel-body'> <strong>";

      html += featureAttributes.SurfaceType;

      html += "</strong> </div></div></div><div class='col-sm-3'> <div class='panel panel-info'> <div class='panel-heading'>Surface Type 2</div><div class='panel-body'> <strong>";

      html += featureAttributes.SurfaceType2;

      html += "</strong> </div></div></div><div class='col-sm-3'> <div class='panel panel-info'> <div class='panel-heading'>Flange Material</div><div class='panel-body'> <strong>";

      html += featureAttributes.FlangeMaterial;

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
