/**
 * Created by Yuan Shen on 6/7/2020.
 */
let options = document.getElementById("options");
const time = document.getElementById("time");
//popoutoptions
options.addEventListener("click",
    function (event) {
        browser.runtime.openOptionsPage();

        return browser.storage.local.get([GEOLOCATION_LATITUDE_KEY, GEOLOCATION_LONGITUDE_KEY, GEOLOCATION_RETRIEVE_TIME])
            .then((position) => {
            time.innerHTML = "Location last updated time:" + position[GEOLOCATION_RETRIEVE_TIME].time;

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
                console.log(JSON.parse(request.response));
                console.log(data.main.temp);
                alert(data.main.temp);
            } else {
                console.log(`error ${request.status} ${request.statusText}`)
            }
        }
        //
    });
    }
);
//
