//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const weatherContent = "Check the weather for your favorite city! ";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

let weatherViewHistory = [];

app.get("/", function(req, res) {
  res.render("home", { startingContent: homeStartingContent });
});

app.get("/about", function(req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res) {
  res.render("compose", { posts: posts });
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);
  res.redirect("/compose");

});

app.get("/posts/:postName", function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});




app.get("/weather", function(req, res) {
  res.render("weather", {
    weatherContent,
    weatherViewHistory: weatherViewHistory
  });
});


app.post("/weather", function(req, res) {
 
 //this allows for current search to be displayed only
 weatherViewHistory = [];

  var city = String(req.body.cityInput);

  //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
  const units = "imperial";
  const apiKey = "8863bbe14bd7f26d94be2e6658a29c4d";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKey;

  // this gets the data from Open WeatherPI
  https.get(url, function(response) {
    console.log(response.statusCode);

    // gets individual items from Open Weather API
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;
      const country = weatherData.sys.country;
      const zip = weatherData.zip;
      const windSpeed = weatherData.wind.speed;
      const humidity = weatherData.main.humidity;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      //information needed for weatherViewHistory array

      const weatherInfo = {
        name: weatherData.name,
        temp: Math.round(temp),
        country: country,
        image: imageURL,
        weatherDescription: weatherDescription,
        humidity: humidity
      };

      //checking if API info is retrieved correctly
      console.log(temp);

      weatherViewHistory.push(weatherInfo);

      res.redirect("/weather");

    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


//INSTRUCTIONS  need to write out an app.get function that open a route /weather 
//Need an EJS view called weather.ejs that displays one text field to input city name
//This EJS view will input a city name from user
// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity
// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display
// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - temperature in F, description and humidity
