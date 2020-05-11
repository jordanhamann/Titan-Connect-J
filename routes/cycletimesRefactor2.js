var express = require("express");
var router = express.Router();
var moment = require("moment");
var CycleTime = require("../models/cycleTimes");
const { DateTime, Interval, Duration } = require("luxon");

//route for a JSON request that queries the database and returns the requested data
router.get("/cycletimes", function(req, res){
    res.render("cycletimes/index");
});

router.get("/barGraphData", function(req, res){
    
    var bars;
    var totalTime;
    var intervalTime;
    var endDate = DateTime.local();
    var labels = [];
    var sortedCycleTimes = [];

    //Set default number of bars if nothing is selected
    if(req.query.numberOfBars){
        bars = parseInt(req.query.numberOfBars);
    } else {
        bars = 7; //Number of bars to display on bar chart
    }

    // Create an object to use to subtract from now to get the start date
    switch(req.query.timePeriod){
        case "Hours":
            totalTime = {hours: bars};
            intervalTime = {hours: 1}
            break;
        case "Days":
            totalTime = {days: bars};
            intervalTime = {days: 1}
            break;
        case "Weeks":
            totalTime = {weeks: bars};
            intervalTime = {weeks: 1}
            break;
        case "Months":
            totalTime = {months: bars};
            intervalTime = {months: 1}
            break;
        default:
            totalTime = {days: bars};
            intervalTime = {days: 1}
    }

    //subtract total time from endDate to get a start date
    var startDate = endDate.minus(totalTime);

    //create a Duration object representing 1 bar of the bar graph
    var intervalDuration = Duration.fromObject(intervalTime);

    //create interval object covering the entire time period from start to end
    var totalInterval = Interval.fromDateTimes(startDate, endDate);

    //create array of intervals by splitting the total interval by the interval duration
    var intervals = totalInterval.splitBy(intervalDuration);

    CycleTime.find({"created": {"$gte": startDate.toJSDate(), "$lte": endDate.toJSDate()}}).then((foundCycleTimes) => {
        //loop through each cycletime
        foundCycleTimes.forEach((ct) => {
            //for each cycle time loop through the intervals
            for(var i = 0; i < intervals.length; i++){
                sortedCycleTimes[i] = [];
                //if the cycletime is in that interval add it to the array
                if(intervals[i].contains(DateTime.fromJSDate(ct.created))){
                    sortedCycleTimes[i].push(ct);
                }
            }
        });
        sortedCycleTimes.forEach((arr)=>{
            console.log(arr.length);
        });
    })
});  


module.exports = router;
