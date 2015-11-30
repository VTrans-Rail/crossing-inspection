require([
  "dojo/dom", "dojo/on",
  "esri/tasks/query", "esri/tasks/QueryTask", "dojo/domReady!"
], function (dom, on, Query, QueryTask) {

  var queryTask = new QueryTask("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/CrossingInspections2015/FeatureServer/1");

  var query = new Query();

  query.returnGeometry = false;
  query.outFields = ["*"];

  on(dom.byId("execute"), "click", execute);

  function execute () {
    //Create possible filters
    query.where = "DOT_Num like '%" + dom.byId("searchInput").value + "%' OR RRXingNum like '%" + dom.byId("searchInput").value + "%' OR XingCond like '%" + dom.byId("searchInput").value + "%'";
    queryTask.execute(query, showResults);
  }

  function showResults (results) {
    var resultItems = [];
    var resultCount = results.features.length;
    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;
      for (var attr in featureAttributes) {
        resultItems.push("<b>" + attr + ":</b>  " + featureAttributes[attr] + "<br>");
      }
      resultItems.push("<br>");
    }
    dom.byId("info").innerHTML = resultItems.join("");
  }
});
