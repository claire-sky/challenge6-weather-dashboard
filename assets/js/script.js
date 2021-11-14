var cityName = document.querySelector("#city");
var fetchButton = document.getElementById("search-btn");
var city = [];
var lat = 0;
var lon = 0;
var cityHistory = [];
var currentWeather = document.getElementById("current-weather");
var fiveDayWeather = document.getElementById("five-day-weather");
var searchHistory = document.getElementById("search-history");

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
                    lat = data[0].lat;
                    lon = data[0].lon;
                    saveCity(city);
                    fetchWeather(city);
                }
            });
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
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=2e12e8363bb5cb74188b7d051abc37da";

    fetch(weatherUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        while (currentWeather.hasChildNodes()) {  
            currentWeather.removeChild(currentWeather.firstChild);
        };
        while (fiveDayWeather.hasChildNodes()) {  
            fiveDayWeather.removeChild(fiveDayWeather.firstChild);
        }

        // convert UTC date to PST date
        var dt = new Date(data.current.dt * 1000);
        var returnDate = dt.toLocaleString().split(",");
        returnDate = returnDate[0];

        // update main with current city and date
        var currentWeatherDate = document.createElement("h2");
        currentWeatherDate.innerHTML = city + " (" + returnDate + ")";

        // update main with current temp
        var currentTemp = document.createElement("p");
        currentTemp.innerHTML = "Temp: " + data.current.temp + " °F";

        // update main with current wind
        var currentWind = document.createElement("p");
        currentWind.innerHTML = "Wind: " + data.current.wind_speed + " MPH";
        
        // update main with current humidity
        var currentHumidity = document.createElement("p");
        currentHumidity.innerHTML = "Humidity: " + data.current.humidity + " %";
        
        // update main with current UV index
        var currentUVIndex = document.createElement("p");
        currentUVIndex.innerHTML = "UV Index: " + data.current.uvi;
        currentWeather.append(currentWeatherDate, currentTemp, currentWind, currentHumidity, currentUVIndex);

        for (var i = 1; i < 6; i++) {
            // update main with 5-day dividers for each day
            var fiveDayDiv = document.createElement("div");
            fiveDayDiv.setAttribute("id", "five-day-div" + [i])
            fiveDayDiv.classList.add("col-2", "bg-primary", "text-light", "m-2", "rounded")
            fiveDayWeather.appendChild(fiveDayDiv);

            // convert UTC date to PST date
            var dtDaily = new Date(data.daily[i].dt * 1000);
            var returnDateDaily = dtDaily.toLocaleString().split(",");
            returnDateDaily = returnDateDaily[0];

            // update 5-day dividers with date
            var fiveDayDay = document.createElement("p");
            fiveDayDay.innerHTML = returnDateDaily;

            // update 5-day dividers with temp
            var fiveDayTemp = document.createElement("p");
            fiveDayTemp.innerHTML = "Temp: " + data.daily[i].temp.day + " °F";

            // update 5-day dividers with wind
            var fiveDayWind = document.createElement("p");
            fiveDayWind.innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH";

            // update 5-day dividers with humidity
            var fiveDayHumidity = document.createElement("p");
            fiveDayHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + " %";
            document.getElementById("five-day-div" + [i]).append(fiveDayDay, fiveDayTemp, fiveDayWind, fiveDayHumidity);
        };
    });
};

// save city search to local storage
var saveCity = function(city) {
    loadCities();

    // check city history for entered city and remove from history if match
    for (var i = 0; i < cityHistory.length; i++) {
        if (cityHistory[i].city === city) {
            cityHistory.splice([i], 1);
            break;
        };
    };

    // limit saved cities to 6
    if (cityHistory.length > 6) {
        cityHistory.shift();
    };

    // add new city to history
    cityHistory.push({"city": city});
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    displayCities();
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
    while (searchHistory.hasChildNodes()) {  
        searchHistory.removeChild(searchHistory.firstChild);
    };

    // loop through cities and add to aside
    for (var i = 0; i < cityHistory.length; i++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.name = "formBtn";
        btn.classList.add("btn", "btn-primary", "mx-auto", "m-2", "cityBtn", "d-grid","gap-2", "col");
        btn.innerHTML = cityHistory[i].city;
        btn.value = cityHistory[i].city;

        // add each to aside
        searchHistory.appendChild(btn);
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