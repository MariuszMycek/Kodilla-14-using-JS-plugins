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
    zoom: 7,
    center: slideData[0].cords
  });

  var mapCenterOnMarker = true; // If true map will center on marker. When false map will not center.

  for (let i = 0; i < slideData.length; i++) {
    // Creating of markers
    var marker = new google.maps.Marker({
      position: slideData[i].cords,
      map: map
    });

    // Slide change after marker click
    marker.addListener("click", function() {
      mapCenterOnMarker = false; // Center on marker disabled

      flkty.selectCell(document.getElementsByClassName("carousel-cell")[i]);
      mapCenterOnMarker = true;
    });
  }

  // Centering at proper marker after slide change
  flkty.on("change", function(index) {
    if (mapCenterOnMarker) {
      smoothPanAndZoom(map, 7, slideData[index].cords);
    }
    mapCenterOnMarker = true; // Center on marker enabled until marker clicked
  });

  // A tutaj jest kod skopiowany i dostosowany do potrzeb mojej karuzeli ---------------

  var smoothPanAndZoom = function(map, zoom, coords) {
    // Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
    var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
    jumpZoom = Math.min(jumpZoom, zoom - 1);
    jumpZoom = Math.max(jumpZoom, 3);

    // Zaczynamy od oddalenia mapy do wyliczonego powiększenia.
    smoothZoom(map, jumpZoom, function() {
      // Następnie przesuwamy mapę do żądanych współrzędnych.
      smoothPan(map, coords, function() {
        // Na końcu powiększamy mapę do żądanego powiększenia.
        smoothZoom(map, zoom);
      });
    });
  };

  var smoothZoom = function(map, zoom, callback) {
    var startingZoom = map.getZoom();
    var steps = Math.abs(startingZoom - zoom);

    // Jeśli steps == 0, czyli startingZoom == zoom
    if (!steps) {
      // Jeśli podano trzeci argument
      if (callback) {
        // Wywołaj funkcję podaną jako trzeci argument.
        callback();
      }
      // Zakończ działanie funkcji
      return;
    }

    // Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
    var stepChange = -(startingZoom - zoom) / steps;

    var i = 0;
    // Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument, w naszym przypadku 80)
    var timer = window.setInterval(function() {
      // Jeśli wykonano odpowiednią liczbę kroków
      if (++i >= steps) {
        // Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
        window.clearInterval(timer);
        // Jeśli podano trzeci argument
        if (callback) {
          // Wykonaj funkcję podaną jako trzeci argument
          callback();
        }
      }
      // Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
      map.setZoom(Math.round(startingZoom + stepChange * i));
    }, 80);
  };

  var smoothPan = function(map, coords, callback) {
    var mapCenter = map.getCenter();
    coords = new google.maps.LatLng(coords);

    var steps = 12;
    var panStep = {
      lat: (coords.lat() - mapCenter.lat()) / steps,
      lng: (coords.lng() - mapCenter.lng()) / steps
    };

    var i = 0;
    var timer = window.setInterval(function() {
      if (++i >= steps) {
        window.clearInterval(timer);
        if (callback) callback();
      }
      map.panTo({
        lat: mapCenter.lat() + panStep.lat * i,
        lng: mapCenter.lng() + panStep.lng * i
      });
    }, 1000 / 15);
  };
};
