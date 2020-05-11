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
    var endDate;

    //Set default number of bars if nothing is selected
    if(req.query.numberOfBars){
        bars = parseInt(req.query.numberOfBars);
    } else {
        bars = 7; //Number of bars to display on bar chart
    }

    // Create an object to use to subtract from now to get the start date
    switch(req.query.timeInc){
        case "hours":
            totalTime = {hours: bars};
            intervalTime = {hours: 1};
            endDate = DateTime.local().endOf('hour');
            break;
        case "days":
            totalTime = {days: bars};
            intervalTime = {days: 1};
            endDate = DateTime.local().endOf('day');
            break;
        case "weeks":
            totalTime = {weeks: bars};
            intervalTime = {weeks: 1};
            endDate = DateTime.local().endOf('week');
            break;
        case "months":
            totalTime = {months: bars};
            intervalTime = {months: 1};
            endDate = DateTime.local().endOf('month');
            break;
        default:
            totalTime = {days: bars};
            intervalTime = {days: 1};
            endDate = DateTime.local().endOf('day');
    }

    //subtract total time from endDate to get a start date
    var startDate = endDate.minus(totalTime);

    //create a Duration object representing 1 bar of the bar graph
    var intervalDuration = Duration.fromObject(intervalTime);

    //create interval object covering the entire time period from start to end
    var totalInterval = Interval.fromDateTimes(startDate, endDate);

    //create array of intervals by splitting the total interval by the interval duration
    var intervals = totalInterval.splitBy(intervalDuration);

    var labels = [];
    var currentLabel;
    var startString;
    var endString;

    var promises = [];

    // Generate a promise for getting cycletimes from the database in each time interval. Also generate a label
    for(var i=0; i<intervals.length; i++){
        promises.push(CycleTime.find({"created": {"$gte": intervals[i].start.toJSDate(), "$lte": intervals[i].end.toJSDate()}}));

        switch(req.query.timeInc){
            case "hours":
                currentLabel = intervals[i].start.plus(intervalTime).toFormat("HH") + ":00 to " + intervals[i].start.plus(intervalTime).plus(intervalTime).toFormat("HH") + ":00";
                break;
            case "days":
                currentLabel = intervals[i].start.plus(intervalTime).toFormat("ccc");
                break;
            case "weeks":
                startString = intervals[i].start.plus(intervalTime).toFormat("DD");
                endString = intervals[i].start.plus(intervalTime).plus(intervalTime).toFormat("DD");
                currentLabel = startString.substring(0, startString.indexOf(",")) + "   to   " + endString.substring(0, endString.indexOf(","));
                break;
            case "months":
                currentLabel = intervals[i].start.plus(intervalTime).toFormat("MMM");
                break;
            default:
                currentLabel = intervals[i].start.plus(intervalTime).toFormat("ccc");
        }
        labels.push(currentLabel);
    }

    var avgSets = [[],[]];
    var countArr = [[],[]]; 

    // When all database fetches are complete, average all of the cycletime and place into new array
    Promise.all(promises).then((cycleTimeSets) => {
        // For each time interval
        cycleTimeSets.forEach((cycleTimeSet) => {
            // For each strapper position
            for(var i=1; i<=2 ; i++){
                var sum = 0;
                var count = 0;

                // Loop through each of the cycletimes and find average
                cycleTimeSet.forEach((ct) => {
                    if(ct.strapperPosition == i){
                        sum += ct.cycleTime;
                        count++;
                    }
                });
                if(count != 0){
                    avgSets[i-1].push(sum/count);
                    countArr[i-1].push(count);
                } else {
                    avgSets[i-1].push(0);
                    countArr[i-1].push(count);
                }
            }
        });

        // Wrap into an object for sending
        chartDataToSend = {
            averages: avgSets,
            counts: countArr,
            labels: labels
        };

        res.send(chartDataToSend);

    });
});  


module.exports = router;
