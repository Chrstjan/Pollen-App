//GLOBALS
const locationName = document.getElementById("locationName");
const app = document.getElementById("app");
getLocation();

//#region model code

/*Checks is the browser supports geolocation
  if the browser supports geolocation & the user allows location tracking it runs the showPosition function
  else it runs the showError function
*/
function getLocation() {
  if (navigator.geolocation) {
    //geolocation.getCurrentPosition requires a sucess function and a error function to call to function
    navigator.geolocation.getCurrentPosition(recivedPostion, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function getUserLocationName(lat, long) {
  fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fbef1c16355178751609wmp6b195b`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((json) => {
      console.log(json);
      buildLocationName(json.address.city);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      return null;
    });
}

function getPollenData(lat, long) {
  fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((json) => {
      pollenDataStructure(json);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      return null;
    });
}

//#endregion model code

//#region controller code

/*Gets the position parementer from getLocation
  console logs the users longtitude & latitude data objects*/
function recivedPostion(position) {
  // console.log(position);
  console.log("latitude:" + position.coords.latitude);
  console.log("longitude:" + position.coords.longitude);

  getUserLocationName(position.coords.latitude, position.coords.longitude);
  getPollenData(position.coords.latitude, position.coords.longitude);
}

/*Handles geolocation errors
    Gets the error parementer from the getLocation function  
    console logs error after which error occurs
  */
function showError(error) {
  console.log(error.message);
}

function pollenDataStructure(data) {
  let viewData = [];
  console.log(data);
  viewData.push(data.current);

  let timestamps = data.hourly.time;

  let hourData = [];

  let hasPollen = false;

  timestamps.map((timestamp, index) => {
    let hourDataObjects = {};
    hourDataObjects.time = timestamp;
    hourDataObjects.alder_pollen = data.hourly.alder_pollen[index];
    hourDataObjects.birch_pollen = data.hourly.birch_pollen[index];
    hourDataObjects.grass_pollen = data.hourly.grass_pollen[index];
    hourDataObjects.mugwort_pollen = data.hourly.mugwort_pollen[index];
    hourDataObjects.olive_pollen = data.hourly.olive_pollen[index];
    hourDataObjects.ragweed_pollen = data.hourly.ragweed_pollen[index];


    if (
      hourDataObjects.alder_pollen !== 0 ||
      hourDataObjects.birch_pollen !== 0 ||
      hourDataObjects.grass_pollen !== 0 ||
      hourDataObjects.mugwort_pollen !== 0 ||
      hourDataObjects.olive_pollen !== 0 ||
      hourDataObjects.ragweed_pollen !== 0
      ) 
      {
        hasPollen = true;
        hourData.push(hourDataObjects);
      }
  });

  viewData.push(hourData);
  viewData.push(hasPollen);

  if (!hasPollen) {
    buildNoPollen();
  }
  else {
    buildPollenView(viewData);
  }
}
//#endregion controller code

//#region view code
function buildLocationName(address) {
  let cityName = `<header><h2>Lokation: ${address}</h2></header>`;

  locationName.innerHTML += cityName;
}

function buildPollenView(viewData) {
  clearApp();
  console.log(viewData);

  let currentPollen = `
        <div class="current-pollen">
            <header>
                <h2>Pollental</h2>
            </header>
            <ul>
                <li>El ${viewData[0].alder_pollen}</li>
                <li>Birk ${viewData[0].birch_pollen}</li>
                <li>Græs ${viewData[0].grass_pollen}</li>
                <li>Bynke ${viewData[0].mugwort_pollen}</li>
                <li>Oliven ${viewData[0].olive_pollen}</li>
                <li>Ambrosia ${viewData[0].ragweed_pollen}</li>
            </ul>
        </div>`;

  app.innerHTML += currentPollen;

  
  viewData[1].forEach((hour) => {
    console.log(hour);
    let hourlyPollen = `
        <div class="hourly-pollen">
            <header>
                <h4>Time: ${hour.time}</h4>
            </header>
            <ul>
              <header class="hourly-header"><h4>Pollen:</h4></header>
              <li>El: ${hour.alder_pollen}</li>
              <li>Birk: ${hour.birch_pollen}</li>
              <li>Græs: ${hour.grass_pollen}</li>
              <li>Bynke: ${hour.mugwort_pollen}</li>
              <li>Oliven: ${hour.olive_pollen}</li>
              <li>Ambrosia: ${hour.ragweed_pollen}</li>
            </ul>
        </div>`;

    app.innerHTML += hourlyPollen;
  });
}

function buildNoPollen() {
  // clearApp();
  let noPollen = `<div><header><h3>No Pollen Right now</h3></header></div>`;
  app.innerHTML += noPollen;
}

function clearApp() {
  app.innerHTML = "";
}
//#endregion view code

//test
// document.querySelector('iframe').addEventListener('load', function() {
//   let map = this.contentDocument || this.contentWindow.document;
//   map.querySelector('html').addEventListener('click', function(event) {
//       // Hent latituden og longituden for det klikkede stedet
//       let lat = event.latLng.lat();
//       let long = event.latLng.long();

//       // Kall funksjonen for å hente polleninformasjonen med de hentede koordinatene
//       getPollenData(lat, long);
//   });
// });
window.addEventListener('DOMContentLoaded', function() {
  const iframe = document.querySelector('iframe');
 
  // Add event listener for when the iframe content has loaded
  iframe.addEventListener('load', function() {
    // Get the contentDocument or contentWindow of the iframe
    const mapDocument = iframe.contentDocument || iframe.contentWindow.document;

    // Add click event listener to the map within the iframe
    mapDocument.querySelector('html').addEventListener('click', function(event) {
      // Retrieve latitude and longitude of the clicked location
      const lat = event.latLng.lat(); // Assuming you're using Google Maps API
      const long = event.latLng.long(); // Assuming you're using Google Maps API

      // Call the function to retrieve pollen data with the obtained coordinates
      getPollenData(lat, long);
    });
  });
});