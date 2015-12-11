"use strict";

function HelpButton() {
	ga('send', 'event', { eventCategory: 'Help', eventAction: 'Click', eventLabel: 'Help button click'});
	var thediv = document.getElementById('instructions');
	if (thediv.style.display == "none") {
		thediv.style.display = "";
		thediv.innerHTML = "\n\t\t<div class=\"site-wrapper\">\n\t\t\t<div class=\"site-wrapper-inner\">\n\t\t\t\t<div class=\"cover-container\">\n\t\t\t\t\t<div class=\"masthead clearfix\">\n\t\t\t\t\t\t<div class=\"inner\">\n\t\t\t\t\t\t\t<h2 class=\"masthead-brand\">Crossing Inspection</h2>\n\t\t\t\t\t\t\t<h3 class=\"subtitle\"><em>Data Investigation App</em></h3>\n\t\t\t\t\t\t\t<h3 class=\"subtitle\"><small>Here's how it works:</small></h3>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"inner cover\">\n\t\t\t\t\t\t<div class=\"step\">\n\t\t\t\t\t\t\t<span class=\"searchIcon esri-icon-search\" id=\"searchico\"> </span>\n\t\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t\tSearch for:\n\t\t\t\t\t\t\t</strong>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t<ul class=\"list-inline\">\n\t\t\t\t\t\t\t\t<li>DOT Number</li>\n\t\t\t\t\t\t\t\t<li>Town Name</li>\n\t\t\t\t\t\t\t\t<li>Road Name</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<div class=\"horiz-line\">\n\t\t\t\t\t\t\t<span class=\"divider-text\">\n\t\t\t\t\t\t\t\t<em>or</em>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"step\">\n\t\t\t\t\t\t\t<span class=\"searchIcon esri-icon-zoom-out-fixed\"> </span>\n\t\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t\tUse the map\n\t\t\t\t\t\t\t</strong>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t<em>\n\t\t\t\t\t\t\t\tNavigate the map to your desired area.\n\t\t\t\t\t\t\t</em>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<div class=\"horiz-line\">\n\t\t\t\t\t\t\t<span class=\"divider-text\">\n\t\t\t\t\t\t\t\t<em>then</em>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t<img src=\"img\\crossing-good.png\" alt=\"\" id=\"xingImg\"/>\n\t\t\t\t\t\t<em>\n\t\t\t\t\t\t\tClick on a crossing to see details\n\t\t\t\t\t\t</em>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t<em>This button opens the crossing report page:</em>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-default btn-report\" id=\"helpRptBtn\">Full Report</button>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"mastfoot\">\n\n\t\t\t\t\t<div class=\"inner cover gotit\">\n\t\t\t\t\t\t\t<a href=\"#\" onclick=\"return HelpButton();\"class=\"btn btn-lg btn-success\">Got it!</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\n\t\t\t\t</div>\n\n\t\t\t</div>\n\n\t\t</div>\n\t\t";
	} else {
		thediv.style.display = "none";
		thediv.innerHTML = '';
	}
	return false;
}
