const ItineraryGenerator = require('../ItineraryGenerator');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');







// /** 
//  * Aggregates results of surveys to js. Takes data from users.js 
//  * 
//  * */ 
// var Dict = require("collections/dict");
class Aggregator {
    
    // hostData :
    // {
        //     location: "calgary"
        //     startDate: "20/20/20"
        //     endDate: "11/11/11"
        //     groupBudget: 1500123
        //     groupSize: 10 
        //     age: [7, 19, 54, 69]
        //     dietaryRestrictions: ["vegan", "carnivorous"] 
        //     restaurants: ["sushi", "steakhouse", "other: eating kangaroo"]
        //     activities: ["landmark", "swim"]
        // }
    constructor() {
        this.created = false;
        this.itinerary = null;
        this.hostData = {}; 
        this.location = this.hostData.location; 
        this.surveyData = [];  

        //this.hostData.email
        //this.hostData.

        // this.tripLength = hostData.tripLength;  
        // this.startDate = hostData.startDate;   
        // this.endDate = hostData.endDate;
        // this.groupBudget = hostData.groupBudget;        // USD 
        // this.groupSize = hostData.groupSize;            
        // this.groupAges = surveyData.groupAges; 
        // this.restaurants = surveyData.restaurants;
        // this.activites = surveyData.activities; 
    }

// //  hostData:    {"length of stay": "", "group budget": 500}


//     /**
//      * Given surveyData on activities that the group likes to do, choose one activity 
//      * that is the best for the group. 
//      */
        
    //     //location 
    //     {
    //         
    //     }
       
       

  
    //     //survey data 
    //     {

          
    //     }

        // {
        //   "landmark": 5,
        //   "murder": 2,
        //   "swim": 1,
        //   "total": 8,
        // }

        
/**
 * 
 * Returns a list of activities based on the users' preferences and the number of days they will be spending at the  location
 * 
 */
// hostData :
    // {
        //     location: "calgary" 
        //     startDate: "20/20/20" 
        //     endDate: "11/11/11" 
        //     groupBudget: 1500123 
        //     groupSize: 3
     //   surveyData: 
        //     age: 10  
        //     dietaryRestrictions: ["vegan", "carnivorous"] //from everyone in the group  
        //     restaurants: ["sushi", "steakhouse", "other: eating kangaroo"] //from everyone in the group  
        //     activities: ["landmark", "swim"] //from everyone in the group  
     
        // }
parseAllActivities() {
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=hiking+Calgary&key=AIzaSyDMm7mFoUiBLqbrf4Oo2NTAj7Q3S4yXNF8
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=[Activity + Category + Location]&key=[API KEY]
    const numActivities =  this.hostData.stayLength * 3; 
    let activitiesList = []; 
    while (activitiesList.length < numActivities) {
        for(let i = 0; i < this.hostData.groupSize; i++) { //surveydata.length = groupsize 
            this.surveyData[i].activities.forEach((value) => {
                activitiesList.push(value);
            });
        } 
   }
//    console.log(activitiesList); 
   return activitiesList;
}
    /**
     * Given surveyData on restaurants that the group likes then return the restaurants  
     * that are the best for the group.
     * returns list of string 
     * ["sushi", "burger"]
     */
    parseAllRestaurants() {
        const numRestaurants = this.hostData.stayLength * 3; 
        let restaurantsList = [];    //  should be size numRestaurants
        while(restaurantsList.length < numRestaurants) {
        for(let i = 0; i < this.surveyData.length; i++) {   //loop over each person's results
            for(let  j = 0; j < this.surveyData[i].restaurants.length; j++){
                restaurantsList.push(this.surveyData[i].restaurants[j]);
            }
        }
    }

    // console.log("aggregator line 141")
    // console.log(this.surveyData);

    return restaurantsList; 
}

// :) lets go adrian lets go (:
/**
 * 
 * Records individual survey data until all individuals in the group have filled out the survey then create the Itinerary
 * 
 * @param  {} surveyData
 */
addSurveyData(surveyData) {
    const groupSize = this.hostData.groupSize;
    if(this.surveyData.length < groupSize) {
        this.surveyData.push(surveyData);
        console.log("adding survey data from survey");
    }
    if(this.surveyData.length == groupSize && !this.created) {
        this.created = true;
        this.createItinerary(); 
        console.log("creating itinerary");
    }
}
//this should only happen if everyone fills out their surveys 
createItinerary() {
    this.itinerary = new ItineraryGenerator(this); 
}

itineraryReady() {
    if(this.itinerary) {
        // Execute this code at the place where we check if the Itinerary is ready
        // const msg = {
        //     to: `${this.this.hostData.email}`,
        //     from: 'owlplanrinfo@gmail.com',
        //     subject: 'Itinerary Link. Do not respond to this email or there will be consequences!',
        //     text: 'OwlPlanr Itinerary Link!',
        //     html: '<h2> OwlPlanr <p> Please click on the link provided to find your fully customized travel itinerary! </p></h2>'
        // }
        // sgMail.send(msg);
        return this.itinerary.trip.length == this.hostData.stayLength; 
    } else {
        return false;
    }
}
/**
 * Returns schedule if it is ready or null otherwise
 * 
 * @Return {Object} itinerary
 */
getItinerary() {
    // console.log("host data");
    // console.log(this.hostData.latitude);
    // console.log(this.hostData.longitude);  
    if (this.itinerary != null && this.itinerary.trip != null) {
        return this.itinerary.trip; 
    } else {
        return null; 
    }
}

}

module.exports = Aggregator;
