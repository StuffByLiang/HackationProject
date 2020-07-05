const m = require('moment');
const PlaceFinder = require("./PlaceFinder");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

/** 
 * Takes results of api calls to format an itinerary: splits the restaurants and activities throughout the duration of 
 * the trip. 
 * Receives a list of restaurants in json form. 
 * Receives a list of activities in json form. 
 * Receives host data 
 * 
 * 
 * 
 * 
 * */ 
class ItineraryGenerator {

    constructor(aggregator) {
        this.aggregator;
        this.currentPlaceID;
        this.trip = [];  
        this.count = 0; 
        this.aggregator = aggregator; 
        this.startDate = m(aggregator.hostData.startDate); 
        this.endDate = m(aggregator.hostData.endDate); 
        this.placeFinder = new PlaceFinder(aggregator);
        this.init();
    }
    
    async init() {
        this.restaurants = await this.placeFinder.processQueryRestaurant(this.aggregator.parseAllRestaurants());
        this.restaurantNamesAndIDs = this.placeFinder.getPlaceNamesAndID(this.restaurants); //list of restaurant location names
        this.activities = await this.placeFinder.processQueryActivity(this.aggregator.parseAllActivities());
        this.activityNamesAndIDs = this.placeFinder.getPlaceNamesAndID(this.activities);             //list of activity locations names
        this.planTrip();
        // completed for sure
        const msg = {
            to: `${this.aggregator.hostData.email}`,
            from: 'owlplanrinfo@gmail.com',
            subject: 'PlanR Itinerary Link!',
            text: `Click on the link to find your fully customized travel itinerary! ${this.aggregator.hostData.url}`,
            html: `<p> Click on the link to find your fully customized travel itinerary! ${this.aggregator.url} </p>`
        }
        sgMail.send(msg).then(() => {
            // If successfully sent an email, do nothing
        }).catch((error) => {
            // If 
            console.log(error.response.body)
            // console.log(error.response.body.errors[0].message)
        })


        // aggregator.url
    
    }
    /* 
    /How can we make an itenerary given all of the restaurants names and activities names we are going to go to in our vacation? 
    /
    / 1. Simplest Solution
    /    - Put restaurants in order of the list lmao  // will get a single person's preferences first then the next person's 
    /    - Put activities in order of the list lmfao what // 
    /
    / 2. Randomize
    /    - Randomize restaurant order    // draw it from the array 
    /    - Random activity order         //

    // if we have more time: 
    // maybe make a dict that matches an activity with an amount of time so that you dont go surfing for 2 hours and 
    // looking at a landscape for 2 hours 
    OUR DAY:
    8:00 find breakfast 
    09:00 do activity
    11:00 find lunch 
    12:00 do activity
    2:00 do activity
    4:00 find dinner
    5:00 chill time // explore saskatchewan :(
    */ 
    
    /*
    / 
    */
    planDay() {
        const startTime = 8;            // 8AM
        const endTime   = 17;           // 5PM
        const day = {
            "day": this.incDay().format('LL'),  // June 9 2014
            "events": [{
                name: this.selectRestaurant(),  //selects a restaurant name and placeID object
                placeID: this.currentPlaceID, 
                start_time: "8:00",
                end_time: "9:00",
                location: this.location                 
            }, 
            {
                name: this.selectActivity(),
                placeID: this.currentPlaceID,
                start_time: "9:00",
                end_time: "11:00" ,
                location: this.location   
            },
            {
                name: this.selectRestaurant(),
                placeID: this.currentPlaceID,
                start_time: "11:00",
                end_time: "12:00" ,
                location: this.location   
            },
            {
                name: this.selectActivity(),
                placeID: this.currentPlaceID,
                start_time: "12:00",
                end_time: "14:00" ,
                location: this.location   
            },
            {
                name: this.selectActivity(),
                placeID: this.currentPlaceID,
                start_time: "14:00",
                end_time: "16:00" ,
                location: this.location   
            },
            {
                name: this.selectRestaurant(),
                placeID: this.currentPlaceID,
                start_time: "16:00",
                end_time: "17:00" ,
                location: this.location   
            },
            {
                name: "Relax and enjoy the rest of your evening! We recommend exploring the city, experiencing the local cultures, and spending time with friends and family!",
                placeID: this.currentPlaceID, 
                start_time: '17:00',
                end_time:   '22:00',
                location: this.location   
            }]
        }
        return this.trip.push(day);
    }

    /**
     * 
     * Creates a plan for each day in the vacation
     * 
     */
    planTrip() {
        for(let i = 0; i < this.aggregator.hostData.stayLength; i++) {
            this.planDay(); 
        }
    }

    //randomly selects an element from an array, 
    selectRestaurant() {
        //random select on an elt on the array
        const randomRestaurant = this.restaurantNamesAndIDs[Math.floor(Math.random() * this.restaurantNamesAndIDs.length)];
        // console.log(this.restaurantNamesAndIDs);
        this.currentPlaceID = randomRestaurant.placeID;  
        this.location = randomRestaurant.location;
        const index = this.restaurantNamesAndIDs.indexOf(randomRestaurant); 
        if (index > -1) {
            this.restaurantNamesAndIDs.splice(index, 1); 
        }
        
        return randomRestaurant.name; 
        //randomly choose a restaurant
        //update the placeID to the restaurant's id
        //TODO
    }

    selectActivity() {

        if (this.activityNamesAndIDs.length == 0) {
            return "Free Time";
        }

        const randomActivity = this.activityNamesAndIDs[Math.floor(Math.random() * this.activityNamesAndIDs.length)];
        this.currentPlaceID = randomActivity.placeID; 
        this.location = randomActivity.location;
        const index = this.activityNamesAndIDs.indexOf(randomActivity); 
        if(index > -1) {
            this.activityNamesAndIDs.splice(index, 1); 
        }
        return randomActivity.name; 
        //TODO 
    }

    incDay() {
        if (this.count == 0 ) {
            this.count++;  
            return this.startDate;    
        }
        return this.startDate  = this.startDate.add(1, 'day'); 
    }
}

module.exports = ItineraryGenerator;