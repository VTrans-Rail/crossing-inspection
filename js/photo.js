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

document.getElementById("info").innerHTML = "<img src='" + photoUrl + "' id='image' alt='site-image' width='100%'>";

var pictureDiv = document.getElementById("info");

var hammertime = new Hammer(pictureDiv);

hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

hammertime.get('pinch').set({ enable: true});

hammertime.on('pinch panleft panright panup pandown tap press', function(ev) {
  console.log(ev.type + "whatever");
  if (ev.type === "pinch") {
    MouseWheelHandler();
    alert("wow");
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

  image.style.width = Math.max(200, Math.min(4320, image.width + (100 * delta))) + "px";

  return false;
}


  (function($){

    $(document).ready(function(){
      //call imagePanning fn when DOM is ready
      $(".content img").imagePanning();
    });

    //imagePanning fn
    $.fn.imagePanning=function(){
        var init="center";
        return this.each(function(){
          var $this=$(this);
          if($this.data("imagePanning")) return;
          $this.data("imagePanning",1)
            //create markup
            .wrap("<div class='img-pan-container' />")
            .after("<div class='resize' style='position:absolute; width:auto; height:auto; top:0; right:0; bottom:0; left:0; margin:0; padding:0; overflow:hidden; visibility:hidden; z-index:-1'><iframe style='width:100%; height:0; border:0; visibility:visible; margin:0' /><iframe style='width:0; height:100%; border:0; visibility:visible; margin:0' /></div>")
            //image loaded fn
            .one("load",function(){
              setTimeout(function(){ $this.addClass("loaded").trigger("mousemove",1); },1);
            }).each(function(){ //run load fn even if cached
              if(this.complete) $(this).load();
            })
            //panning fn
            .parent().on("mousemove touchmove MSPointerMove pointermove",function(e,p){
              var cont=$(this);
              e.preventDefault();
              var contH=cont.height(),contW=cont.width(),
                isTouch=e.type.indexOf("touch")!==-1,isPointer=e.type.indexOf("pointer")!==-1,
                evt=isPointer ? e.originalEvent : isTouch ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e,
                coords=[
                  !p ? evt.pageY-cont.offset().top : init==="center" ? contH/2 : 0,
                  !p ? evt.pageX-cont.offset().left : init==="center" ? contW/2 : 0
                ],
                dest=[Math.round(($this.outerHeight(true)-contH)*(coords[0]/contH)),Math.round(($this.outerWidth(true)-contW)*(coords[1]/contW))];
              $this.css({"top":-dest[0],"left":-dest[1]});
            })
            //resize fn
            .find(".resize iframe").each(function(){
              $(this.contentWindow || this).on("resize",function(){
                $this.trigger("mousemove",1);
              });
            });
        });
      }
  })(jQuery);
