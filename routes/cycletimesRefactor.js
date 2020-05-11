var express = require("express");
var router = express.Router();
var moment = require("moment");
var CycleTime = require("../models/cycleTimes");

//route for a JSON request that queries the database and returns the requested data
router.get("/cycletimes", function(req, res){
    res.render("cycletimes/index");
});

router.get("/barGraphData", function(req, res){
    
    var bars;   //number of bars to be displayed in the bar graph per dataset
    var timeIncrement; // a string describing the timeperiod that each bar will represent eg. "days", "months", "hours"
 
    //Set default value of 7 days if nothing is selected
    if(req.query.numberOfBars){
        bars = parseInt(req.query.numberOfBars);
    } else {
        bars = 7; //Number of bars to display on bar chart
    }
    if(req.query.timeInc){
        timeIncrement = req.query.timeInc;
    } else {
        timeIncrement = 'days'; // the time increment for the 
    }

    var endDate = moment(); //the current time as a moment object
    var startDate = moment(endDate).subtract(bars, timeIncrement); //the time at the start of the range we are looking at. For example 7 days ago, 5 hours ago, 3 months ago
    var barChartInfo = {}; 
    var avg = [];
    var numberOfCycles = [];
    var dateFormat = "";
    var dateTransform;
    var newLabel;
    var newAvg;
    var cycleTimeArrays = [];
    var labels = [];


    // Read data from DB
    CycleTime.find({"created": {"$gte": startDate.toDate(), "$lte": endDate.toDate()}}, function(err, foundCycleTimes){
        
        console.log(foundCycleTimes.length);

        //calculate the dates at the boundary of each bar on the bar graph
        boundaryDates = calculateIntervalBoundaryDates(moment(), timeIncrement, bars);
        console.log(boundaryDates);
        labels = generateLabels(moment(), timeIncrement, bars);

        //loop through all cycletimes returned from the DB and assign them to a time period
        foundCycleTimes.forEach(function(ct){
            for(var i = 0; i < boundaryDates.length; i++){
                cycleTimeArrays[i] = [];
                if(moment(ct.created).isBetween(boundaryDates[i+1], boundaryDates[i])){
                    cycleTimeArrays[i].push(ct);
                }
            }
        });

        console.log(cycleTimeArrays);
        console.log(labels);

        //loop through each time period and find the average and the count
        cycleTimeArrays.forEach(function(cycleTimeArray){
            avg.push(averageCycleTime(cycleTimeArray));
            numberOfCycles.push(cycleTimeArray.length);
        });

        barChartInfo = {
            labels: labels,
            data: [avg, []]
        }
        res.send(barChartInfo);
});

});


function averageCycleTime(cycleTimes){
    var sum = 0;
    var count = 0;
    var avg = 0;

    cycleTimes.forEach(function(ct){
       sum += ct.cycleTime; 
       count++;
    });
        
    if(count != 0){
        avg = sum/count;
    } else {
        console.log("There are no records to average");
        avg = 0;
    }
    return avg;
}

function calculateIntervalBoundaryDates(currentDate, intervalPeriod, numberOfIntervals){
    boundaryDates = [];
    interval = intervalPeriod.substr(0, intervalPeriod.length - 1);
    console.log("Interval is: " + interval);
    endDate = currentDate.endOf(interval);
    for(var i = 0; i < numberOfIntervals + 1; i++){
        boundaryDates[numberOfIntervals - i] = moment(endDate).subtract(numberOfIntervals - i, intervalPeriod);
    }
    return boundaryDates;
}

function generateLabels(currentDate, intervalPeriod, numberOfIntervals){
    var labels = [];
    var dateFormat;
    var interval = intervalPeriod.substr(0, intervalPeriod.length - 1);
    switch(intervalPeriod){    //depending on time increment select display format
        case "hours":
            dateFormat = "LT";
            break;
        case "days":
            dateFormat = "ddd";
            break;
        case "weeks":
            dateFormat = "W";
            break;
        case "months":
            dateFormat = "MMM";
            break;
        default:
            dateFormat = "ddd";
    }
    labels[0] = currentDate.startOf(interval).format(dateFormat);
    for(var i = 0; i <= numberOfIntervals + 1; i++){
        labels[numberOfIntervals - i] = moment(currentDate).subtract(i, interval).format(dateFormat);
    }
    return labels;
}

module.exports = router;
