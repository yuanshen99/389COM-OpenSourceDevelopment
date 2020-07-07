/**
 * Created by Yuan Shen on 6/7/2020.
 */
let options = document.getElementById("options");
let weathericon = document.getElementById("weathericon");
let cityname = document.getElementById("location");
let description = document.getElementById("description");
let temp = document.getElementById("temp");
let time = document.getElementById("time");


window.addEventListener('load', (event) => {
    browser.management.get("firefox-compact-dark@mozilla.org")
    .then((extInfo) => {
    if (extInfo.enabled) {
    document.getElementsByTagName("body")[0].className = "night";
    document.getElementById("options").className ="button optionsnight";
}
else {
    document.getElementsByTagName("body")[0].className = "day";
}
});

// If the current theme changes to Firefox's default dark theme,
// darken the Options page.
browser.management.onEnabled.addListener((ext) => {
    if (ext.id === "firefox-compact-dark@mozilla.org") {
    document.getElementsByTagName("body")[0].className = "night";
    document.getElementById("options").className ="button optionsnight";
}
else if (ext.type === "theme") {
    document.getElementsByTagName("body")[0].className = "day";
}
})

    return browser.storage.local.get([GEOLOCATION_LATITUDE_KEY, GEOLOCATION_LONGITUDE_KEY, GEOLOCATION_RETRIEVE_TIME])
        .then((position) => {
        time.innerHTML = "Location last updated: " + position[GEOLOCATION_RETRIEVE_TIME].time;

//call weather api
var lat = position[GEOLOCATION_LATITUDE_KEY].latitude;
var lan = position[GEOLOCATION_LONGITUDE_KEY].longitude;
let request = new XMLHttpRequest();
request.open("GET", 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lan + '&appid=e55f37ddf75aa5c1f80c356fad572961&units=metric');
request.send();
request.onload = () =>
{
    console.log(request);
    if (request.status == 200) {
        var data = JSON.parse(request.response);
        //console.log(JSON.parse(request.response));
        //console.log(data.main.temp);
        weathericon.src = "http://openweathermap.org/img/wn/"+data.weather[0].icon +"@2x.png";
        cityname.innerHTML = capitalizeFirstLetter(data.name);
        description.innerHTML = capitalizeFirstLetter(data.weather[0].description);
        temp.innerHTML = data.main.temp + "&#8451;";
        //alert(data.main.temp);
    } else {
        console.log(`error ${request.status} ${request.statusText}`)
    }
}
//
});
});




//popoutoptions
options.addEventListener("click",
    function (event) {
        browser.runtime.openOptionsPage();


    }
);
//
