//GLOBALS
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
  }

  /*Handles geolocation errors
    Gets the error parementer from the getLocation function  
    console logs error after which error occurs
  */
  function showError(error) {
    console.log(error.message);
  }
  //#endregion controller code