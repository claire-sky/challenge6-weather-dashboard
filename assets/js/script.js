var cityName = document.querySelector("#city");
var fetchButton = document.getElementById("search-btn");
var city = [];
var lat = 0;
var lon = 0;
var cityHistory = [];

var cityInput = function(event) {
    event.preventDefault();

    // retrieve city name and alert when empty
    city = cityName.value.trim();
    if(!city) {
        alert("Please enter a city");
    };
    fetchCity();

}


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
                    saveCity(city);
                    fetchWeather(city);
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
var fetchWeather = function(city) {
    console.log(lat, lon);

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=2e12e8363bb5cb74188b7d051abc37da";

    fetch(weatherUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
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
        console.log(btn.value);
        btn.setAttribute("id", "cityBtn" + [i]);
        console.log(btn.id);

        // add each to aside
        document.getElementById("search-history").appendChild(btn);
        // load weather when button is clicked
        btn.addEventListener("click", autoFill);
    };
};

function autoFill() {
    console.log(this);
    city = this.value;
    console.log(city);
    fetchCity();
}

fetchButton.addEventListener("click", cityInput);
displayCities();