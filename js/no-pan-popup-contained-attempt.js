
$("#map_container").click(function (e) {
  var offset = $(this).offset();
  var relativeX = (e.pageX - offset.left);
  var relativeY = (e.pageY - offset.top);
  document.getElementById("relative-x").innerHTML = relativeX;
  document.getElementById("relative-y").innerHTML = relativeY;
  return;
});



var x = document.getElementById("relative-x").innerHTML;
var y = document.getElementById("relative-y").innerHTML;

if (x < 300 && y < 240) {
  map.infoWindow.anchor = "bottom-right";
} else if (Math.abs(map.width - x) < 300 && y < 240) {
  map.infoWindow.anchor = "bottom-left";
} else if (Math.abs(map.width - x) < 300 && Math.abs(map.height - y) < 240) {
  map.infoWindow.anchor = "top-left";
} else if (x < 300 && Math.abs(map.height - y) < 240) {
  map.infoWindow.anchor = "top-right";
} else if (x < 300) {
  map.infoWindow.anchor = "right";
} else if (Math.abs(map.width - x) < 300) {
  map.infoWindow.anchor = "left";
} else if (y < 440) {
  map.infoWindow.anchor = "bottom";
} else if (Math.abs(map.height - y) < 440) {
  map.infoWindow.anchor = "top";
}


// var x = document.getElementById("relative-x").innerHTML;
// var y = document.getElementById("relative-y").innerHTML;
//
//
// if (x < 300 && y < 240) {
//   map.infoWindow.anchor = "bottom-right";
//   console.log(x);
//   console.log(y);
//   console.log("bottom-right");
// } else if (Math.abs(map.width - x) < 300 && y < 240) {
//   map.infoWindow.anchor = "bottom-left";
//   console.log("bottom-left");
// } else if (Math.abs(map.width - x) < 300 && Math.abs(map.height - y) < 240) {
//   map.infoWindow.anchor = "top-left";
//   console.log("top-left");
// } else if (x < 300 && Math.abs(map.height - y) < 240) {
//   map.infoWindow.anchor = "top-right";
//   console.log("top-right");
// } else if (x < 300) {
//   map.infoWindow.anchor = "right";
//   console.log("right");
// } else if (Math.abs(map.width - x) < 300) {
//   map.infoWindow.anchor = "left";
//   console.log("left");
// } else if (y < 440) {
//   map.infoWindow.anchor = "bottom";
//   console.log("bottom");
// } else if (Math.abs(map.height - y) < 440) {
//   map.infoWindow.anchor = "top";
//   console.log("top");
// }
