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
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fbef1c16355178751609wmp6b195b`)
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
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`)
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

    getUserLocationName(position.coords.latitude, position.coords.longitude)
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
    viewData.push(data.current);

    //Data about current values
    buildPollenView(viewData);
  }
  //#endregion controller code

  //#region view code
 function buildLocationName(address) {

    let cityName = `<header><h2>${address}</h2></header>`;

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
}

  function clearApp() {
    app.innerHTML = "";
  }
  //#endregion view code