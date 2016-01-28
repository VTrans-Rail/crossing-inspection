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

document.getElementById("info").innerHTML = "<img src='" + photoUrl + "' id='image' alt='site-image' width='100%' ondblclick='zoom(this)'>";



function zoom (x) {
  var previousWidth = document.getElementById("save-old-width").innerHTML;

  console.log(previousWidth);
  var width = x.width;
  document.getElementById("save-old-width").innerHTML = width;
  console.log(previousWidth);
  console.log(width);

  var widthRatio = ( width / previousWidth );
  console.log(widthRatio);

  if ( previousWidth === "" ) {
    x.style.width = "4320px";
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom In'});
  } else if ( widthRatio > 1 ) {
    x.style.width = "100%";
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom Out'});
  } else if ( widthRatio < 1 ) {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'DoubleClickZoom', eventLabel: 'Zoom In'});
    x.style.width = "4320px";
  }
}

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


var pictureDiv = document.getElementById("info");

var hammertime = new Hammer(pictureDiv);

hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
hammertime.get('pinch').set({ enable: true});

hammertime.on('pinch pinchstart pinchin pinchout pan panstart panleft panright panup pandown swipeup swipedown swipeleft swiperight tap', function(ev) {
  if (ev.type === "pinchin") {
    image.style.width = Math.max(width, Math.min(4320, image.width - 25)) + "px";
  } else if (ev.type === "pinchout") {
    image.style.width = Math.max(width, Math.min(4320, image.width + 10)) + "px";
  } else if (ev.type === "swipeleft") {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'Swipe', eventLabel: 'Swipe Left'});

    var scrollDistance = Math.abs(ev.target.x) + Math.abs(ev.target.width * 0.25 * ev.overallVelocity);
    $("#info").animate({
      scrollLeft: scrollDistance
    }, 500)
  } else if (ev.type === "swiperight") {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'Swipe', eventLabel: 'Swipe Right'});

    var scrollDistance = Math.abs(ev.target.x) - Math.abs(ev.target.width * 0.25 * ev.overallVelocity);
    $("#info").animate({
      scrollLeft: scrollDistance
    }, 500)
  } else if (ev.type === "swipeup") {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'Swipe', eventLabel: 'Swipe Up'});

    var scrollDistance = Math.abs(ev.target.y) + Math.abs(ev.target.height * 0.25 * ev.overallVelocity);
    $("#info").animate({
      scrollTop: scrollDistance
    }, 500)
  } else if (ev.type === "swipedown") {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'Swipe', eventLabel: 'Swipe Down'});

    var scrollDistance = Math.abs(ev.target.y) - Math.abs(ev.target.height * 0.25 * ev.overallVelocity);
    $("#info").animate({
      scrollTop: scrollDistance
    }, 500)
  } else if (ev.type === "panright") {
    pictureDiv.scrollLeft -= 2;
  } else if (ev.type === "panleft") {
    pictureDiv.scrollLeft += 2;
  } else if (ev.type === "panup") {
    pictureDiv.scrollTop += 2;
  } else if (ev.type === "pandown") {
    pictureDiv.scrollTop -= 2;
  }

  if (ev.type === "pinchend") {
    ga('send', 'event', { eventCategory: 'FullPictureZoom', eventAction: 'Pinch', eventLabel: 'Zoom Direction Unidentified'});
  }
});

var image = document.getElementById("image");

if (image.addEventListener) {
	// IE9, Chrome, Safari, Opera
	image.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
	image.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}

function MouseWheelHandler() {
  var e = window.event || e; // old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  image.style.width = Math.max(width, Math.min(4320, image.width + (100 * delta))) + "px";
  if (delta > 0) {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'WheelZoom', eventLabel: 'Zoom In'});
  } else if (delta < 0) {
    ga('send', 'event', { eventCategory: 'FullPictureEvents', eventAction: 'WheelZoom', eventLabel: 'Zoom Out'});
  }

  return false;
}
