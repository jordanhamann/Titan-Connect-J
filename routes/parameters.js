var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Parameter = require("../models/parameterChange");
var moment = require("moment");
const paramNames = require('../assets/json/parameterNames.json');
const paramCategories = require('../assets/json/parameterCategories.json');

//Index Route
router.get("/parameters", function(req, res){
    
    var currentValueQueries = [];
    var pastValueQueries = [];

    //create array of all of the promises to retrieve the most recent parameter entries for each parameter name
    paramNames.names.forEach((name) => {
        currentValueQueries.push(Parameter.findOne({"name": name}, {}, {sort: {"dateCreated" : -1 } })); //find most recent entry with the corresponding name
    });

    Promise.all(currentValueQueries).then((currentValueQueryResults) => {
        currentValueQueryResults.forEach((param) => {
            pastValueQueries.push(Parameter.findOne({"name": param.name, "value": { "$ne": param.value }}, {}, {sort: {"dateCreated" : -1 } })); //find the most recent entry with that name that is not equal to the current value
        });
        Promise.all(pastValueQueries).then((pastValueQueryResults) => {
            roundArray(pastValueQueryResults);
            roundArray(currentValueQueryResults);
            res.render("parameters/index", {currentParams: currentValueQueryResults, pastParams: pastValueQueryResults, categories: paramCategories.categories, moment: moment});
        });
    });
    
});

router.get("/parameters/:name", function(req, res){
    res.render("parameters/show", {name: req.params.name, moment: moment});
});

router.get("/parameters/:name/data", function(req, res){
    var data = [];
    Parameter.find({"name": req.params.name}, [], { $orderby : { 'dateCreated' : -1 } }, function(err, foundParameters){
        if(err){
            console.log(err);
        } else {
            formatValueData(foundParameters);
            foundParameters.forEach((fp) => {
                // console.log("y: " + fp.value);
                data.push({x: moment(fp.dateCreated).format("ll HH:mm"), y: Number(fp.value)});
            })
            res.send(data);
        }
    });
});

function roundArray(paramArr){
    paramArr.forEach((param) => {
        if(param){
            if(param.dataType == "Real"){
                param.value = Number(param.value).toFixed(2);
            }
        }
    })
}

function formatValueData(paramArr){
    paramArr.forEach((param) => {
        if(param){
            switch(param.dataType){
                case "Time":
                    var start = param.value.indexOf("#");
                    var end = param.value.lastIndexOf("m");
                    if(end == -1){
                        end = param.value.lastIndexOf("s");
                    }
                    param.value = Number(param.value.substring(start+1, end));
                    break;
                default:
                    break;
            }
        }
    })
}

module.exports = router;