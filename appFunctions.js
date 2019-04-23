require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var inquirer = require('inquirer');
inquirer

// start functions area
// start search again function
function searchAg (){
  inquirer.prompt([{
    name: "search",
    type: "confirm",
    message: "Do you want to do another search?"
  }]).then(function(searchAgResponse){
    if (searchAgResponse.search){
      masterPrompt();
    }
    else {
      process.exit(0);
    }
  })
}
// end search again function
  // if "concert-this" is chosen from the master prompt list
    function findBand (){
      inquirer.prompt([
      {
        name: "bandName",
        type: "input",
        message: "What band do you want to find?"
      }
    ])
    .then(bandAnswers => {
      let artist = bandAnswers.bandName;

      axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(axiosResponse){
          
          for (var i =0; i < axiosResponse.data.length; i++){
            let date = moment(axiosResponse.data[i].datetime).format("MM-DD-YYYY");
            console.log(`Venue Name: ${axiosResponse.data[i].venue.name}
            Location: ${axiosResponse.data[i].venue.city}, ${axiosResponse.data[i].venue.country}
            Date: ${date}`);
        }
        searchAg();
        }).catch(function(error){
          console.log(error)
        })
    });
    
    }
  // end "concert-this" function

  // start song search area
    function findSong (){
      inquirer.prompt([{
        name: "songName",
        type: "input",
        message: "What song are you looking for?",
        default: "All About That Base"
      }]).then(function(findSongResponse){
        let song = findSongResponse.songName;
        spotify.search({ type: 'track', query: song, limit: '10'}, function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
         
          for (i = 0; i < data.tracks.items.length; i++){
            // printing the album name
            console.log(`Album Name: ${data.tracks.items[i].name}`) 
            // for loop for printing the artists
            for (j=0; j < data.tracks.items[i].artists.length ; j++){
              console.log(`Artists: ${data.tracks.items[i].artists[j].name}`)
            }
            // printing the links
            console.log(`link: ${data.tracks.items[i].href}`)
  
            console.log(`
  
  ==========================
  
  `)
            
          }
          searchAg();
          
        });
  
      }
      )
      
    };
    
  // end song search area

  // start find movie function
function findMovie (){
  inquirer.prompt([{
    name: "movieTitle",
    type: "input",
    message: "What movie are you looking for?",
    default: "Aladdin"
  }]).then(function(movieResponse){
    axios.get("http://www.omdbapi.com/?t="+ movieResponse.movieTitle +"&y=&plot=short&apikey=trilogy").then(
      function(response) {
        console.log(response.data);
        console.log(`Title: ${response.data.Title}`);
        console.log(`Actors: ${response.data.Actors}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDB Rating: ${response.data.imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country Produced: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        searchAg();
      }
      
    );
    
  })
  
}
  // end find movie function

  // start "do-what-it-says"
function readTxt (){
  var fs = require("fs");
  // start read file
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error){
      return console.log(error);
    }
    var randomArr = data.split(",")
    var ranSongNam = randomArr[1];
    // start concert thing
    spotify.search({ type: 'track', query: ranSongNam, limit: '10'}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     
      for (i = 0; i < data.tracks.items.length; i++){
        // printing the album name
        console.log(`Album Name: ${data.tracks.items[i].name}`) 
        // for loop for printing the artists
        for (j=0; j < data.tracks.items[i].artists.length ; j++){
          console.log(`Artists: ${data.tracks.items[i].artists[j].name}`)
        }
        // printing the links
        console.log(`link: ${data.tracks.items[i].href}`)

        console.log(`

==========================

`)
        
      }
      
      searchAg();
    });
    // end concert thing

  })
  // end read file
}
  // end "do-what-it-says"

  
// end functions area

// start master prompt area that will direct to the different fuctions
function masterPrompt(){
inquirer.prompt([{
  name: "action",
  type: "list",
  message: "What do you want to do?",
  choices: [
    "concert-this",
    "spotify-this-song",
    "movie-this",
    "do-what-it-says"
  ]
}]).then(function(whatDo){
  if (whatDo.action === "concert-this"){
    // concert function
    findBand();
  }
  else if (whatDo.action === "spotify-this-song"){
    // song function
    findSong();
    
  }
  else if (whatDo.action === "movie-this"){
    // movie function
    findMovie();
    
  }
  else if (whatDo.action === "do-what-it-says"){
    // readTxt function
    readTxt();
    
  }
})
};
masterPrompt();
// end master prompt area