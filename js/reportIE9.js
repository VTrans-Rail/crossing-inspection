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


var dotnumqs = getParameterByName("dotnum");

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

if (dotnumqs) {
      var crossingUrl = "http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Rail/CrossingInspection2015/FeatureServer/1";


      var queryTask = new QueryTask(crossingUrl);

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
        'Angle','SnoopCompliant','Comments', 'IntRd500', 'IntRdDist',
        'Num_Tracks', 'PaveMarkCond', 'RDS_AOTCLASS', 'RDS_FUNCL'
      ];



    //-----------------------------------------------------
    //------------Working Section------------------------------
    //-----------------------------------------------------


      var crossingPoints = new FeatureLayer(crossingUrl, {
        id: "crossingPoints",
      });


      if (dotnumqs) {
        query.where = "DOT_Num like '%" + dotnumqs + "%'";
        queryTask.execute(query,getPhotos);
      }

      var imageString = "";


      function getPhotos (results) {
        var resultCount = results.features.length;
        for (var i = 0; i < resultCount; i++) {
          var featureAttributes = results.features[i].attributes;
          var objectId = featureAttributes.OBJECTID;

          // ----------Get Picture URls and Build Image Tags--------------
          var deferred = new dojo.Deferred;

          crossingPoints.queryAttachmentInfos(objectId).then(function(response){
            var imgSrc;
            if (response.length === 0) {
              deferred.resolve("no attachments");
            }
            else {
              for ( j = 0; j < response.length; j++ ) {
                imgSrc = response[j].url;
                imageString += "<div data-field-span='1' class='blur'><a onclick='imageGA()' href='photo.html?url=" + imgSrc + "' target='_blank'>" + "<img src='" + imgSrc + "' class='img-responsive' alt='site image' width='100%'>" + "<h3>View Full Image</h3></a></div>";
              }
            }
          });
          //-------------------------------------------------------------------
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


      // function to convert strings to Title Case (for Town field)
      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }


      function showResults (results) {
        var resultItems = [];
        var resultCount = results.features.length;

        for (var i = 0; i < resultCount; i++) {
          var featureAttributes = results.features[i].attributes;

          var html="\n      <form class='grid-form'>\n          <fieldset>\n              <legend>Crossing Details</legend>\n              <div data-row-span='4'>\n                  <div data-field-span='1' id='xing-num' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Crossing Number</label>\n                    <input type='text' readonly disabled value='";

          html += featureAttributes.DOT_Num + "'>\n                  </div>\n                  <div data-field-span='1' id='surf-cond' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Surface Condition</label>\n                    <input type='text' readonly disabled id='condition' value='";

          html += featureAttributes.XingCond + "'>\n                  </div>\n                  <div data-field-span='1' id='feature-crossed' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Road Name</label>\n                    <input type='text' readonly disabled value='";

          html += featureAttributes.Feature_Crossed + "'>\n                  </div>\n                  <div data-field-span='1' id='town' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Town</label>\n                    <input type='text' readonly disabled value='";

          html += toTitleCase(featureAttributes.Town) + "'>\n                  </div>\n              </div>\n              <div data-row-span='4'>\n                  <div data-field-span='2' id='rail-division' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Rail Division</label>\n                    <input type='text' readonly disabled value='";

          html += featureAttributes.Division + "'>\n                  </div>\n                  <div data-field-span='1' id='rail-subdivision' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>Subdivision</label>\n                    <input type='text' readonly disabled value='";

          html += featureAttributes.Subdivision + "'>\n                  </div>\n                  <div data-field-span='1' id='mile-post' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                    <label>MP</label>\n                    <input type='text' readonly disabled value='";

          html += featureAttributes.MP + "'>\n                  </div>\n              </div>\n          </fieldset>\n          <fieldset id='crossing-photos-fieldset'>\n            <legend>Crossing Photos</legend>\n            <div data-row-span='2'>";

          html += imageString + "</div>\n          </fieldset>\n          <fieldset>\n            <legend>Crossing Details</legend>\n            <div data-row-span='3'>\n              <div data-field-span='1' id='surf-type' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Main Surface Material</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.SurfaceType + "'>\n              </div>\n              <div data-field-span='1' id='surf-type-two' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Secondary Surface Material</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.SurfaceType2 + "'>\n              </div>\n              <div data-field-span='1' id='flange-material' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Flange Material</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.FlangeMaterial + "'>\n              </div>\n            </div>\n            <div data-row-span='9'>\n              <div data-field-span='3' id='number-tracks' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Number of Tracks</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Num_Tracks + "'>\n              </div>\n              <div data-field-span='1' id='crossing-angle' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Angle</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Angle + "'>\n              </div>\n              <div data-field-span='1' id='crossing-width' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Width</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.XingWidth + "'>\n              </div>\n              <div data-field-span='1' id='crossing-length' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Length</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.XingLength + "'>\n              </div>\n              <div data-field-span='3' id='snooper' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Snooper Compliant</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.SnoopCompliant + "'>\n              </div>\n            </div>\n          </fieldset>\n          <fieldset>\n            <legend>Safety Information</legend>\n            <div data-row-span='3'>\n              <div data-field-span='1' id='warning-device-code' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Warning Device</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.WDCode + "'>\n              </div>\n              <div data-field-span='1' id='channelization' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Channelization</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Channelization + "'>\n              </div>\n              <div data-field-span='1' id='illuminated' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Illuminated</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.XingIllum + "'>\n              </div>\n            </div>\n            <div data-row-span='6'>\n              <div data-field-span='1' id='paved' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Paved</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Paved + "'>\n              </div>\n              <div data-field-span='1' id='stop-line' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Stop Line</label>\n                <input type='text' readonly disabled value='"

          html += featureAttributes.StopLine + "'>\n              </div>\n              <div data-field-span='2' id='rr-pave-mark' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>RR Pavement Markings</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.RRXingPavMark + "'>\n              </div>\n              <div data-field-span='2' id='pave-mark-cond' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Pavement Markings Condition</label>\n                <input type='text' readonly disabled id='pmark-cond' value='";

          html += featureAttributes.PaveMarkCond + "'>\n              </div>\n            </div>\n            <div data-row-span='3'>\n              <div data-field-span=\"1\" id='gates-road' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Gate Arms (Vehicle)</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.GateArmsRoad + "'>\n              </div>\n              <div data-field-span='1' id='gates-ped' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Gate Arms (Pedestrian)</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.GateArmsPed + "'>\n              </div>\n              <div data-field-span='1' id='gate-config' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Gate Configuration</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.GateConfig1 + "'>\n              </div>\n            </div>\n            <div data-row-span='3'>\n              <div data-field-span=\"1\" id='cant-struc-over' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Catilevered Masts over Road</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Cant_Struc_Over + "'>\n              </div>\n              <div data-field-span='1' id='cant-struc-side' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Cantilevered Mast Beside Road</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Cant_Struc_Side + "'>\n              </div>\n              <div data-field-span='1' id='cant-bulb-type' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Cantilevered Bulbs</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Cant_FL_Type + "'>\n              </div>\n            </div>\n            <div data-row-span='2'>\n              <div data-field-span='1' id='basic-mast-count' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Mast Count (Not Cantilevered)</label>\n                <input type='text' readonly disabled value='"

          html += featureAttributes.FL_MastCount + "'>\n              </div>\n              <div data-field-span='1' id='mast-bulb-type' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Mast Bulbs</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.Mast_FL_Type + "'>\n              </div>\n            </div>\n            <div data-row-span='4'>\n              <div data-field-span='1' id='back-side-fl' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Back or Side Flashers</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.BackSideFL + "'>\n              </div>\n              <div data-field-span='1' id='flasher-count' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Total Flasher Pair Count</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.FlasherCount + "'>\n              </div>\n              <div data-field-span='1' id='flasher-size' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Flasher Bulb Size</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.FlasherSize + "'>\n              </div>\n              <div data-field-span='1' id='bell-count' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Bell Count</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.BellCount + "'>\n              </div>\n            </div>\n          </fieldset>\n          <fieldset>\n            <legend>Vehicular Traffic Information</legend>\n            <div data-row-span='2'>\n              <div data-field-span='1' id='traffic-lane-type' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Traffic Lane Type</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.TrafficLnType + "'>\n              </div>\n              <div data-field-span='1' id='traffic-lane-count' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Traffic Lane Count</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.TrafficLnCount + "'>\n              </div>\n            </div>\n            <div data-row-span='3'>\n              <div data-field-span=\"1\" id='hts-nearby-int' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Traffic Signal Nearby</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.HTS_for_Nearby_Intersection + "'>\n              </div>\n              <div data-field-span='1' id='int-road' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Intersection Nearby (less 500 ft)</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.IntRd500 + "'>\n              </div>\n              <div data-field-span='1' id='int-road-distance' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Distance to Intersection</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.IntRdDist + "'>\n              </div>\n            </div>\n            <div data-row-span='2'>\n              <div data-field-span='1' id='road-funcl' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>Functional Classification</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.RDS_FUNCL + "'>\n              </div>\n              <div data-field-span='1' id='road-aot' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <label>AOT Classification</label>\n                <input type='text' readonly disabled value='";

          html += featureAttributes.RDS_AOTCLASS + "'>\n              </div>\n            </div>\n          </fieldset>\n          <fieldset>\n            <legend>General Comments</legend>\n            <div data-row-span='1'>\n              <div data-field-span='1' id='comments' onmouseover='onMouseEventOpen(this)' onmouseout='onMouseEventClose(this)' onclick='displayMD(this)'>\n                <textarea readonly disabled>";

          html += featureAttributes.Comments + "</textarea>\n              </div>\n            </div>\n          </fieldset>\n     </form>";
        }
        dom.byId("info").innerHTML = html;

        //---------------------------------------------
        //-----------Replace Domain Name with Values------
        //---------------------------------------------
        // Updates Domain Codes to Coded Value, aka description or alias
        if (document.getElementById('surf-type-two')) {
          var surftwo = document.getElementById('surf-type-two').children[1].value;

          if (surftwo === "") {
            document.getElementById('surf-type-two').children[1].value = "None";
          }
          else if (surftwo === "null") {
            document.getElementById('surf-type-two').children[1].value = "None";
          }
        }

        if (document.getElementById('int-road-distance')) {
          var intRdDist = document.getElementById('int-road-distance').children[1].value;
          if (intRdDist === "") {
            document.getElementById('int-road-distance').children[1].value = "N/A";
          }
          else if (intRdDist === "null") {
            document.getElementById('int-road-distance').children[1].value = "N/A";
          }
        }


        if (document.getElementById('warning-device-code')) {
          var warn = document.getElementById('warning-device-code').children[1].value;

          if (warn === "StopYield") {
            document.getElementById('warning-device-code').children[1].value = "Stop or Yield";
          } else if (warn === "XB") {
            document.getElementById('warning-device-code').children[1].value = "Crossbucks";
          } else if (warn === "Flashers") {
            document.getElementById('warning-device-code').children[1].value = "Flashing Lights";
          } else if (warn === "Gates") {
            document.getElementById('warning-device-code').children[1].value = "1 to 3 Gates";
          } else if (warn === "FullQuad") {
            document.getElementById('warning-device-code').children[1].value = "Four Quad (full barrier) Gates";
          } else if (warn === "Other") {
            document.getElementById('warning-device-code').children[1].value = "Other signs or signals";
          } else if (warn === "Other AWD") {
            document.getElementById('warning-device-code').children[1].value = "Other Active Device (flagging)";
          } else if (warn === "None") {
            document.getElementById('warning-device-code').children[1].value = "No signs or signals";
          }
        }



        //--------Update color of condition cells----------
          // overall condition
          var cond = document.getElementById("condition");
          var condcell = document.getElementById("surf-cond");
          if (cond.value === "Excellent") {
            cond.style.color = "rgb(0, 136, 55)";
          }
          else if (cond.value === "Good") {
            cond.style.color = "rgb(166, 219, 160)";
          }
          else if (cond.value === "Fair") {
            cond.style.color = "rgb(255,187,0)";
          }
          else if (cond.value === "Poor") {
            cond.style.color = "rgb(123,50,148)";
          }

          // pavement condition
          var pcond = document.getElementById("pmark-cond");
          var pcondcell = document.getElementById("pave-mark-cond");
          if (pcond.value === "Not Applicable") {
            pcond.style.color = "black";
          }
          else if (pcond.value === "OK") {
            pcond.style.color = "green";
          }
          else if (pcond.value === "Worn") {
            pcond.style.color = "Red";
          }
      }
    }
});
