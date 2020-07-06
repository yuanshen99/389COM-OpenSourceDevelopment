/**
 * Created by Yuan Shen on 6/7/2020.
 */
let options = document.getElementById("options");
const time = document.getElementById("time");
//popoutoptions
options.addEventListener("click",
    function(event) {
        browser.runtime.openOptionsPage();

        return browser.storage.local.get([GEOLOCATION_LATITUDE_KEY, GEOLOCATION_LONGITUDE_KEY, GEOLOCATION_RETRIEVE_TIME])
                .then((position) => {
                time.innerHTML = "Location last updated time:"+ position[GEOLOCATION_RETRIEVE_TIME].time;
                alert(position[GEOLOCATION_LATITUDE_KEY].latitude)});
    }
);
//
