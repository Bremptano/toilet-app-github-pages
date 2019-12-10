//Map --------------------------------------------------------------------------------
//Map options
var map = L.map('map', {
  center: [51.2175823644722, 4.411028355315996],
  zoom: 12,
  minZoom: 9,
  zoomControl: false
});

//Map style
var defaultLayer = L.tileLayer.provider('Stamen.TonerLite').addTo(map);

//Zooms to marker
function clickZoom(e) {
  var lng = e.latlng.lng;
  var lat = e.latlng.lat;
  map.setView([lat, lng], 16);
};

//User location
var userIcon = L.icon({
  iconUrl: 'img/User-Icon-Blue.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

let userLocation;

function onLocationFound(e) {
  L.marker(e.latlng, {
    icon: userIcon,
    zIndexOffset: 999
  }).addTo(map);
  userLocation = e.latlng;
}

map.locate({
  watch: true,
  maxZoom: 16
});

map.on('locationfound', onLocationFound);

//Distance between 2 markers
function getDistanceFromLatLonInKm(lat, lng, myLat, myLng) {
  var earthRadius = 6371; // Radius of the earth in km
  var dLat = deg2rad(myLat - lat); // deg2rad below
  var dLon = deg2rad(myLng - lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat)) * Math.cos(deg2rad(myLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distanceKM = earthRadius * c; // Distance in km
  return distanceKM;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180)
};

//Adds functions and data to info tab
new L.geoJson(openbaar_toilet, {
  onEachFeature: function(feature, layer) {

    //Opens info tab of marker
    layer.on('click', function(e) {
      $("#info").css("opacity", "1").css("transform", "translateY(-50px)").css("pointer-events", "all").css("visibility", "visible");

      //Adds info to tab from marker
      $("#omschrijving").text(feature.properties.OMSCHRIJVING.capitalize());
      $("#straatnaam").text(feature.properties.STRAAT);
      if (feature.properties.HUISNUMMER == "/" || feature.properties.HUISNUMMER == null) {} else(
        $("#huisnummer").text(feature.properties.HUISNUMMER)
      );
      $("#postcode").text(feature.properties.POSTCODE);
      $("#district").text(feature.properties.DISTRICT);

      $("#route").attr("href", "https://www.google.com/maps/search/?api=1&query=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0]);

      if (feature.properties.DOELGROEP === "man/vrouw") {
        $("#geslacht-data").css("background-image", "url('img/info icons/Man-Woman-Icon-White.svg'");
      } else {
        $("#geslacht-data").css("background-image", "url('img/info icons/Man-Icon-White.svg'");
      };

      if (feature.properties.LUIERTAFEL === "nee") {
        $("#luiertafel-data").text("Neen");
      }
      if (feature.properties.LUIERTAFEL === "ja") {
        $("#luiertafel-data").text("Ja");
      }
      if (feature.properties.LUIERTAFEL === "niet van toepassing") {
        $("#luiertafel-data").text("Neen");
      } else {
        $("#luiertafel-data").text("Te onderzoeken");
      };

      if (feature.properties.BETALEND === "nee") {
        $("#betalend-data").text("Neen");
      } else {
        $("#betalend-data").text("Ja");
      };

      distance = getDistanceFromLatLonInKm(feature.geometry.coordinates[1], feature.geometry.coordinates[0], userLocation.lat, userLocation.lng);

      if (distance <= 1) {
        $('#afstand-data').text("~ " + distance.toFixed(3) * 1000 + " m");
      } else {
        $('#afstand-data').text("~ " + distance.toFixed(1) + " km");
      }

      //Resizes map so marker stands in the middle of the screen
      $("#map").css("height", "calc(100% - 50px - 400px - 15px)");
      map.invalidateSize();
      $("#map").css("height", "calc(100% - 50px)");
    });
    layer.on('click', clickZoom);
  },
  //Custom marker
  pointToLayer: function(feature, latlng) {
    var toiletIcon = L.icon({
      iconUrl: 'img/marker icons/Marker-Icon-Blue.svg',
      iconSize: [30, 40],
      //iconAnchor = x --> /2, y --> 1
      iconAnchor: [15, 40]
    });
    return L.marker(latlng, {
      icon: toiletIcon
    });
  }
}).addTo(map);

//Capitalize first letter of object
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

//Add ---------------------------------------------------------------------------------------------------

function addSend() {
  $("#add-form").css("display", "none");
  $(".add-sent").css("display", "flex");
};

function resetForm() {
  $(".add-input").val('');
  $(".geslacht-dropdown").val('Mannen');
  $(".luiertafel-dropdown").val('Ja');
  $(".betalend-dropdown").val('Ja');
};

function backToForm() {
  $("#add-form").css("display", "flex");
  $(".add-sent").css("display", "none");
};

//Contact -----------------------------------------------------------------------------------------------

function contactProblem() {
  $("#contact-second-screen").css("display", "flex");
  $("#contact-first-screen").css("display", "none");
};

function sendProblem() {
  $("#contact-second-screen").css("display", "none");
  $("#contact-third-screen").css("display", "flex");
};

function backToContactForm() {
  $("#contact-third-screen").css("display", "none");
  $("#contact-second-screen").css("display", "none");
  $("#contact-first-screen").css("display", "block");
};

//Navigation --------------------------------------------------------------------------------------------
//Closes info tab of marker
function closeInfo() {
  $("#map").css("height", "calc(100% - 50px)");
  $("#info").css("opacity", "0").css("transform", "translateY(0px)").css("pointer-events", "none").css("visibility", "hidden");
  map.invalidateSize();
};

function closeAdd() {
  $("#add").css("opacity", "0").css("transform", "translateY(50px)").css("pointer-events", "none").css("visibility", "hidden");
};

function closeContact() {
  $("#contact").css("opacity", "0").css("transform", "translateY(50px)").css("pointer-events", "none").css("visibility", "hidden");
};

//Navigation
function openHome() {
  //Nav Style
  $("#nav-home").css("background-color", "#1E66FF").css("background-image", "url('img/nav icons/Home-Button-White.svg')");
  $("#nav-add").css("background-color", "white").css("background-image", "url('img/nav icons/Add-Button-Blue.svg')");
  $("#nav-contact").css("background-color", "white").css("background-image", "url('img/nav icons/Phone-Button-Blue.svg')");

  $(".leaflet-marker-icon").css("pointer-events", "all");

  $("#header-title").text("Map");

  closeAdd();
  closeContact();
};

function openAdd() {
  //Nav Style
  $("#nav-home").css("background-color", "white").css("background-image", "url('img/nav icons/Home-Button-Blue.svg')");
  $("#nav-add").css("background-color", "#1E66FF").css("background-image", "url('img/nav icons/Add-Button-White.svg')");
  $("#nav-contact").css("background-color", "white").css("background-image", "url('img/nav icons/Phone-Button-Blue.svg')");
  //Closes info on home page
  closeInfo();
  $(".leaflet-marker-icon").css("pointer-events", "none");

  $("#header-title").text("Toilet toevoegen");

  $("#add").css("opacity", "1").css("transform", "translateY(-50px)").css("pointer-events", "all").css("visibility", "visible");

  closeContact();
};

function openContact() {
  //Nav Style
  $("#nav-home").css("background-color", "white").css("background-image", "url('img/nav icons/Home-Button-Blue.svg')");
  $("#nav-add").css("background-color", "white").css("background-image", "url('img/nav icons/Add-Button-Blue.svg')");
  $("#nav-contact").css("background-color", "#1E66FF").css("background-image", "url('img/nav icons/Phone-Button-White.svg')");
  //Closes info on home page
  closeInfo();
  $(".leaflet-marker-icon").css("pointer-events", "none");

  $("#header-title").text("Contact");

  $("#contact").css("opacity", "1").css("transform", "translateY(-50px)").css("pointer-events", "all").css("visibility", "visible");

  closeAdd();
};
