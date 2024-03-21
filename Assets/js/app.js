getLocation();

/*Checks is the browser supports geolocation
  if the browser supports geolocation & the user allows location tracking it runs the showPosition function
  else it runs the showError function
*/
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
     alert("Geolocation is not supported by this browser.");
    }
  }
  
  /*Gets the position parementer from getLocation
  console logs the users longtitude & latitude */
  function showPosition(position) {
    console.log("longitude:" + position.coords.longitude)
    console.log("latitude:" + position.coords.latitude)
  }

  /*Handles geolocation errors
    Gets the error parementer from the getLocation function  
    console logs error after which error occurs
  */
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
         console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
         console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }