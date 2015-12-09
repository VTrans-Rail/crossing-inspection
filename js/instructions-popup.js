"use strict";

function clicker() {
  var thediv = document.getElementById('instructions');
  if (thediv.style.display == "none") {
    thediv.style.display = "";
    thediv.innerHTML = "\n\t\t<div class=\"site-wrapper\">\n      <div class=\"site-wrapper-inner\">\n        <div class=\"cover-container\">\n          <div class=\"masthead clearfix\">\n            <div class=\"inner\">\n              <h2 class=\"masthead-brand\">Crossing Inspection</h2>\n              <h3 class=\"subtitle\"><em>Data Investigation App</em></h3>\n              <h3 class=\"subtitle\"><small>Here's how it works:</small></h3>\n            </div>\n          </div>\n\n          <div class=\"inner cover\">\n            <div class=\"step\">\n              <span class=\"searchIcon esri-icon-search\" id=\"searchico\"> </span>\n              <strong>\n                Search for:\n              </strong>\n            </div>\n            <p>\n              <ul class=\"list-inline\">\n                <li>DOT Number</li>\n                <li>Town Name</li>\n                <li>Road Name</li>\n              </ul>\n            </p>\n            <div class=\"horiz-line\">\n              <span class=\"divider-text\">\n                <em>or</em>\n              </span>\n            </div>\n            <div class=\"step\">\n              <span class=\"searchIcon esri-icon-zoom-out-fixed\"> </span>\n              <strong>\n                Use the map\n              </strong>\n            </div>\n            <p>\n              <em>\n                Navigate the map to your desired area.\n              </em>\n            </p>\n            <div class=\"horiz-line\">\n              <span class=\"divider-text\">\n                <em>then</em>\n              </span>\n            </div>\n\n            <p>\n            <img src=\"img\\crossing-good.png\" alt=\"\" id=\"xingImg\"/>\n            <em>\n              Click on a crossing to see details\n            </em>\n            </p>\n            <p>\n              <em>Use the</em><strong> \"Full Report\" </strong><em>link in the\n              popup for more details.</em>\n            </p>\n          </div>\n          <div class=\"inner cover gotit\">\n              <a href=\"#\" onclick=\"return clicker();\"class=\"btn btn-lg btn-success\">Got it!</a>\n          </div>\n\n\n        </div>\n\n      </div>\n\n    </div>\n\t\t";
  } else {
    thediv.style.display = "none";
    thediv.innerHTML = '';
  }
  return false;
}
