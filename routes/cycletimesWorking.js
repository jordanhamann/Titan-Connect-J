var express = require("express");
var router = express.Router();
var moment = require("moment");
var CycleTime = require("../models/cycleTimes");

//route for a JSON request that queries the database and returns the requested data
router.get("/cycletimes", function(req, res){
    res.render("cycletimes/index");
});

router.get("/cycleTimeData", function(req, res){
    
    var bars;
    var timeIncrement;
 
    //Set defaults if nothing is selected
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

    var endDate = moment(); //the end of today
    var startDate = moment(endDate).subtract(bars, timeIncrement);
    var sum = 0;
    var count = 0;
    var currentAvg = 0;
    var cycleTimeChartData = [[], []];
    var labels = [];
    var chartInfo = {};
    var avg;

    // Read data from DB
    CycleTime.find({"created": {"$gte": startDate.toDate(), "$lte": endDate.toDate()}}, function(err, foundCycleTimes){

        for(index = 1; index <= bars; index++){ //For each time increment

            //MAKE THE BELOW CODE MORE READABLE
            switch(req.query.timeInc){    //depending on time increment add correct label and find average
                case "hours":
                    labels.push(moment(startDate).add(index, timeIncrement).startOf("hour").format("LT") + " - " + moment(startDate).add(index+1, timeIncrement).startOf("hour").format("LT"));
                    avg = averageCycleTime(foundCycleTimes, startDate.endOf('hour'), timeIncrement, index);
                    cycleTimeChartData[0].push(avg[0]);
                    cycleTimeChartData[1].push(avg[1]);
                    break;
                case "days":
                    labels.push(moment(startDate).add(index, timeIncrement).startOf('day').format("ddd"));
                    avg = averageCycleTime(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    cycleTimeChartData[0].push(avg[0]);
                    cycleTimeChartData[1].push(avg[1]);
                    break;
                case "weeks":
                    labels.push("Week " + moment(startDate).add(index, timeIncrement).format("W"));
                    avg = averageCycleTime(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    cycleTimeChartData[0].push(avg[0]);
                    cycleTimeChartData[1].push(avg[1]);
                    break;
                case "months":
                    labels.push(moment(startDate).add(index, timeIncrement).format("MMM"));
                    avg = averageCycleTime(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    cycleTimeChartData[0].push(avg[0]);
                    cycleTimeChartData[1].push(avg[1]);
                    break;
                default:
                    labels.push(moment(startDate).add(index, timeIncrement).startOf('day').format("ddd"));
                    avg = averageCycleTime(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    cycleTimeChartData[0].push(avg[0]);
                    cycleTimeChartData[1].push(avg[1]);
            }

        }
        chartInfo = {
            labels: labels,
            data: cycleTimeChartData
        }
        res.send(chartInfo);
    });

});

router.get("/numberOfCycles", function(req, res){
        
    var bars;
    var timeIncrement;
 
    //Set defaults if nothing is selected
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

    var endDate = moment(); //the end of today
    var startDate = moment(endDate).subtract(bars, timeIncrement);
    var numberOfCycles = [[], []];
    var labels = [];
    var count = [];
    var chartInfo = {};
    
    // Read data from DB
    CycleTime.find({"created": {"$gte": startDate.toDate(), "$lte": endDate.toDate()}}, function(err, foundCycleTimes){
        
        for(index = 1; index <= bars; index++){ //For each time increment

            switch(req.query.timeInc){    //depending on time increment add correct label and find average
                case "hours":
                    labels.push(moment(startDate).add(index, timeIncrement).startOf("hour").format("LT") + " - " + moment(startDate).add(index+1, timeIncrement).startOf("hour").format("LT"));
                    count = countNumberOfCycles(foundCycleTimes, startDate.endOf('hour'), timeIncrement, index);
                    numberOfCycles[0].push(count[0]);
                    numberOfCycles[1].push(count[1]);
                    break;
                case "days":
                    labels.push(moment(startDate).add(index, timeIncrement).startOf('day').format("ddd"));
                    count = countNumberOfCycles(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    numberOfCycles[0].push(count[0]);
                    numberOfCycles[1].push(count[1]);
                    break;
                case "weeks":
                    labels.push("Week " + moment(startDate).add(index, timeIncrement).format("W"));
                    count = countNumberOfCycles(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    numberOfCycles[0].push(count[0]);
                    numberOfCycles[1].push(count[1]);
                    break;
                case "months":
                    labels.push(moment(startDate).add(index, timeIncrement).format("MMM"));
                    count = countNumberOfCycles(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    numberOfCycles[0].push(count[0]);
                    numberOfCycles[1].push(count[1]);
                    break;
                default:
                    labels.push(moment(startDate).add(index, timeIncrement).startOf('day').format("ddd"));
                    count = countNumberOfCycles(foundCycleTimes, startDate.endOf('day'), timeIncrement, index);
                    numberOfCycles[0].push(count[0]);
                    numberOfCycles[1].push(count[1]);
            }
        }
        chartInfo = {
            labels: labels,
            data: numberOfCycles
        }
        res.send(chartInfo);
    
    });
});


function averageCycleTime(cycleTimes, startDate, timeIncrement, incIndex){
    var sum = [0, 0];
    var count = [0, 0]
    var avg = [0, 0];
    cycleTimes.forEach(function(ct){
        if( // if the created date within one of the time increments
            ct.created > moment(startDate).add(incIndex-1, timeIncrement).toDate()  
            &&
            ct.created < moment(startDate).add(incIndex, timeIncrement).toDate()
            )
        {
            sum[ct.strapperPosition-1] += ct.cycleTime; //add to correct spot in the sum array
            count[ct.strapperPosition-1] ++;
        }
    });
    for(var i = 0; i<=1; i++){
        if(count[i] != 0){
            avg[i] = sum[i]/count[i];
        } else {
            avg[i] = 0;
        }
    }
    return avg;
}

function countNumberOfCycles(cycleTimes, startDate, timeIncrement, incIndex){
    var count = [0, 0];
    cycleTimes.forEach(function(ct){
        if( // if the created date within one of the time increments
            ct.created > moment(startDate).add(incIndex-1, timeIncrement).toDate()  
            &&
            ct.created < moment(startDate).add(incIndex, timeIncrement).toDate()
            )
        {
            if(ct.strapperPosition == 1){
                count[0]++;
            } else {
                count[1]++;
            }
        }
    });
    return count;
}

module.exports = router;