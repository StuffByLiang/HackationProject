/**
 * 
 * Determines all of the places that satisfy the user specifications
 * 
 */
const {Client, Status} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
require('dotenv').config()
const fetch = require('node-fetch');
// TODO: is it ok to use the global aggregator like this? if we create a new instance of the Aggregator its fields might be null
// so idk 
// - monsiuer fandrew
// wait sike the Global Aggregator doesn't even work in app.js rip
class PlaceFinder {
 //  [yourquerystring]&key=[yourkeyhere]"
 //  "https://maps.googleapis.com/maps/api/place/textsearch/json?query=victoria+restaurants&key=AIzaSyDMm7mFoUiBLqbrf4Oo2NTAj7Q3S4yXNF8"
    constructor(aggregator) {
        this.API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";
        this.queryCity = aggregator.hostData.location; 
        this.lat = aggregator.hostData.latitude;
        this.lng = aggregator.hostData.longitude;
        // this.aggregator = new Aggregator();
        // this.queryCity = "Calgary"; 
    }

// @Adrian let's make the processQuery Methods return Lists of JSON Objects for the restaurants/activities and then in the 
// Itinerary Generator we can alternate through both lists when adding events to the schedule. How does that sound?
// - monsieur Fandrew
/**
 * sounds good sir! 
 * -sir. adrian
 * 
 * :D
 * - monsieur Fandrew
 * 
 * makes a call to the api to get a result from Google
 * returns a list of json objects (list of restaurants) 
 * @param  {} restaurantsList - List of all restaurants for the vacation
 */
async processQueryRestaurant(restaurantsList) {
    //TODO  
    let dataList = []; 
    for(let i = 0; i < restaurantsList.length; i++) { 
        let type = restaurantsList[i];
        let response = await client
        .textSearch({
          params: {
              location: `${this.lat},${this.lng}`,
              radius: 50000,
              query: type, 
              key: process.env.KEY,
          },
        });
        let data = response.data;
        dataList.push({
            type,
            places: data.results
        }); 
    }

    
    return dataList; 
    //sushi restaurants
    //burger restaurants
    // in json
}

/**
 * 
 * Makes a [idk] request to the Places API to get a list of details for all of the activities in the vacation
 * returns a list of json objects
 * 
 * @param  {} activitiesList - List of all activities for the vacation
 */
async processQueryActivity(activitiesList) {
    let dataList = []; 

    for(let i = 0; i < activitiesList.length; i++) { 
        let type = activitiesList[i];
        let response = await client
          .textSearch({
            params: {
                location: `${this.lat},${this.lng}`,
                radius: 50000,
                query: type, 
                key: process.env.KEY,
            },
          });
        //   console.log(response)
        let data = response.data;
        dataList.push({
            type,
            places: data.results,
        });
    return dataList; 
    }
}
/**
 * 
 * Returns an Array of the name and place_id for each place
 * 
 * @param  {} dataList   - the dataList returned by the process Methods
 */ 
getPlaceNamesAndID(dataList) {
    let placesAndID = []; 
    // places:  [sushi restaurants]
    // places:  [burger restaurants]
    // let types = 0;  // number of different types of restaurants 
    // for (const property in dataList) {
    //     if (property === "type") {
    //         types++;
    //     }
    // }
 
    // dataList.places.forEach((value) => {
    //     places.push(value.name);
    // });
    for (let i = 0; i < dataList.length; i++) {
        for (let j = 0; j < dataList[i].places.length; j++) {
            placesAndID.push({
                placeID: dataList[i].places[j].place_id, 
                location: dataList[i].places[j].geometry.location,
                name: dataList[i].places[j].name,
            });
        }
    }
    return placesAndID;
}






// client
//   .textSearch({
//     params: {
//       locations: [{ lat: 45, lng: -110 }],
//       key: "asdf",
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log(r.data.results[0].elevation);
//   })
//   .catch((e) => {
//     console.log(e.response.data.error_message);
//   });

formRequest(input) {
    return this.API_URL + this.queryCity + "+" + input + "&key=" + process.env.KEY;
}

}

module.exports = PlaceFinder;