var cityName = document.querySelector("#city");
var fetchButton = document.getElementById("search-btn");
var city = [];
var lat = 0;
var lon = 0;
var cityHistory = [];

// update city value when city is typed and submitted
var cityInput = function(event) {
    event.preventDefault();

    // retrieve city name and alert when empty
    city = cityName.value.trim();
    if(!city) {
        alert("Please enter a city");
    };
    fetchCity();

};

// retrieve lat and lon
var fetchCity = function() {
    
    // api call for location
    var locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=2e12e8363bb5cb74188b7d051abc37da";

    // fetching api and checking response
    fetch(locationUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    alert("Please enter a valid city");
                } else {
                    console.log(city);
                    console.log(data);
                    lat = data[0].lat;
                    lon = data[0].lon;
                    console.log(lat, lon);
                    saveCity();
                    fetchWeather();
                }
            })
        } else {
            alert("Please enter a valid city");
        }
    })
    .catch(function(error) {
        alert("Unable to retrieve weather currently.");
    });
};

// retrieve current and 5 day weather
var fetchWeather = function() {
    console.log(lat, lon);

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=2e12e8363bb5cb74188b7d051abc37da";

    fetch(weatherUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        // convert UTC date to PST date
        var dt = new Date(data.current.dt * 1000);
        var returnDate = dt.toLocaleString().split(",");
        returnDate = returnDate[0];

        // update main with current city and date
        var currentWeather = document.createElement("h2");
        currentWeather.innerHTML = city + " (" + returnDate + ")";
        document.getElementById("current-weather").appendChild(currentWeather);

        // update main with current temp
        var currentTemp = document.createElement("p");
        currentTemp.innerHTML = "Temp: " + data.current.temp + " °F";
        document.getElementById("current-weather").appendChild(currentTemp);

        // update main with current wind
        var currentWind = document.createElement("p");
        currentWind.innerHTML = "Wind: " + data.current.wind_speed + " MPH";
        document.getElementById("current-weather").appendChild(currentWind);
        
        // update main with current humidity
        var currentHumidity = document.createElement("p");
        currentHumidity.innerHTML = "Humidity: " + data.current.humidity + " %";
        document.getElementById("current-weather").appendChild(currentHumidity);
        
        // update main with current UV index
        var currentUVIndex = document.createElement("p");
        currentUVIndex.innerHTML = "UV Index: " + data.current.uvi;
        document.getElementById("current-weather").appendChild(currentUVIndex);

        for (var i = 0; i < 5; i++) {

            // update main with 5-day dividers for each day
            var fiveDayDiv = document.createElement("div");
            fiveDayDiv.setAttribute("id", "five-day-div" + [i])
            fiveDayDiv.classList.add("col-2", "bg-primary", "text-light")
            document.getElementById("five-day-weather").appendChild(fiveDayDiv);

            // update 5-day dividers with temp
            var fiveDayTemp = document.createElement("p");
            fiveDayTemp.innerHTML = "Temp: " + data.daily[i].temp.day + " °F";
            document.getElementById("five-day-div" + [i]).appendChild(fiveDayTemp);

            // update 5-day dividers with wind
            var fiveDayWind = document.createElement("p");
            fiveDayWind.innerHTML = "Temp Max: " + data.daily[i].wind_speed + " MPH";
            document.getElementById("five-day-div" + [i]).appendChild(fiveDayWind);

            // update 5-day dividers with humidity
            var fiveDayHumidity = document.createElement("p");
            fiveDayHumidity.innerHTML = "Temp Max: " + data.daily[i].humidity + " %";
            document.getElementById("five-day-div" + [i]).appendChild(fiveDayHumidity);
        };
    });
};

// save city search to local storage
var saveCity = function(city) {
    loadCities();
    for (var i = 0; i < cityHistory.length; i++) {
        if (cityHistory[i].city === city) {
            cityHistory.splice([i], 1);
            break;
        };
    };
    if (cityHistory.length > 6) {
        cityHistory.shift();
    };
    cityHistory.push({"city": city});
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
};

// retrieve city from local storage
var loadCities = function() {
    cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (!cityHistory) {
        cityHistory = [];
    };
};

// display cities on aside
var displayCities = function() {
    loadCities();

    // loop through cities and add to aside
    for (var i = 0; i < cityHistory.length; i++) {
        var btn = document.createElement("button");
        btn.type = "submit";
        btn.name = "formBtn";
        btn.classList.add("btn", "btn-primary", "mx-auto", "m-2", "cityBtn");
        btn.innerHTML = cityHistory[i].city;
        btn.value = cityHistory[i].city;

        // add each to aside
        document.getElementById("search-history").appendChild(btn);
        // load weather when button is clicked
        btn.addEventListener("click", cityClick);
    };
};

// update city value when city button is clicked
function cityClick() {
    city = this.value;
    fetchCity();
};

fetchButton.addEventListener("click", cityInput);
displayCities();