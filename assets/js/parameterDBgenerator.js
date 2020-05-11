var mongoose = require("mongoose");
var moment = require("moment");
const fs = require("fs");
const parameters = require('../json/parameterDefaults.json');
var Parameter = require("C:/Users/jhama/Google Drive/Titan Connect/V1/models/parameterChange");

//Database setup
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb://localhost/TitanConnectV1",{ useNewUrlParser: true });



var addToDB = [];

// parameters.parameterDefaults.forEach((param) => {
//         if(param.name == "Time to Slow Retract"){
//             console.log("Time: " + param.value);
//             console.log("Time: " + param.value*Math.random());

//         }
// });

parameters.parameterDefaults.forEach((param) => {
    for(var i=0; i<30; i++){
        var newParam = {...param}
        newParam.dateCreated = moment().add(i, 'days').toDate();
        newParam.value = randomiseData(param);
        addToDB.push(newParam);
    }
})


Parameter.insertMany(addToDB, function(err, createdCycleTime){
    if(err){
        console.log(err);
    } else {
        console.log("success");
        console.log("Number of parameters actually added: " + createdCycleTime.length);
        // createdCycleTime.forEach((ct) => {
        //     console.log(ct);
        // })
    }
});

function randomiseData(param){
    if(param){
        switch(param.dataType){
            case "Time":
                var suffix = "ms";
                var prefix = "T#";
                var start = param.value.indexOf("#");
                var end = param.value.lastIndexOf("m");
                if(end == -1){
                    end = param.value.lastIndexOf("s");
                    suffix = "s";
                }
                var newValue = prefix + (Number(param.value.substring(start+1, end))+Math.random()*Number(param.value.substring(start+1, end))).toFixed(2) + suffix;
                console.log(newValue);
                return newValue;
            case "Integer":
                return Number(param.value) + Math.round(param.value*0.8*Math.random());
            case "Real":
                return Number(param.value) + Number((param.value*0.8*Math.random()));
            case "Boolean":
                var random = Math.random();
                if(random>0.5){
                    return "true";
                } else {
                    return "false";
                }
            default:
                break;
        }
    }
}