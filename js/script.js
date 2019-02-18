"use strict";
// Mustache.js - generating slides using template
(function() {
  var templateSlide = document.getElementById("template-slide").innerHTML;

  Mustache.parse(templateSlide);

  var generatedSlide = "";
  for (var i = 0; i < slideData.length; i++) {
    generatedSlide += Mustache.render(templateSlide, slideData[i]);
  }

  var results = document.getElementById("results");

  results.insertAdjacentHTML("beforeend", generatedSlide);
})();

var elem = document.querySelector(".main-carousel");
var flkty = new Flickity(elem, {
  // options
  cellAlign: "left",
  contain: true,
  pageDots: false, // remove page dots
  hash: true // change page url after slide change
});

// Restart button - return to first slide
document
  .querySelector(".js--restart-button")
  .addEventListener("click", function() {
    var selector = document.getElementsByClassName("carousel-cell")[0];
    flkty.selectCell(selector);
  });

// Progress bar below carousel
var progressBar = document.querySelector(".progress-bar");

flkty.on("scroll", function(progress) {
  progress = Math.max(0, Math.min(1, progress));
  progressBar.style.width = progress * 100 + "%";
});

// Google maps

window.initMap = function() {

  // The map, centered at firt slide
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: slideData[0].cords
  });

  var marker;
  for (var i = 0; i < slideData.length; i++) {
    marker = new google.maps.Marker({ position: slideData[i].cords, map: map });
  }
};
