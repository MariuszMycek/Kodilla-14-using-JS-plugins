"use strict";

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
