// --------------- get querystring value ----------------------------
// this function gets the photo url of the crossing the user was viewing from
// the url so that it can be used for query tasks in the report page
// -----------------------------------------------------------------------
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// ----------------------------------------------------------------


var photoUrl = getParameterByName("url");

document.getElementById("image").innerHTML = "<img src='" + photoUrl + "' id='image' alt='site-image' width='100%' onclick='zoom(this)' style='cursor: zoom-in'>";



function zoom (x) {
  var previousWidth = document.getElementById("save-old-width").innerHTML;

  var width = x.width;
  document.getElementById("save-old-width").innerHTML = width;

  var widthRatio = ( width / previousWidth );

  if ( previousWidth === "" ) {
    x.style.width = "4320px";
    x.style.cursor = "zoom-out";
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom In'});
  } else if ( widthRatio > 1 ) {
    x.style.width = "100%";
    x.style.cursor = "zoom-in";
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom Out'});
  } else if ( widthRatio < 1 ) {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom In'});
    x.style.width = "4320px";
    x.style.cursor = "zoom-out";
  }
}
