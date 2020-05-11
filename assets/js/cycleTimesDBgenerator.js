var mongoose = require("mongoose");
var moment = require("moment");

//Database setup
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb://localhost/TitanConnectV1",{ useNewUrlParser: true });

var CycleTime = require("C:/Users/jhama/Google Drive/Titan Connect/V1/models/cycleTimes");

var month = 0

// Randomize data and add a bunch of data to the database
// for(var day = 1; day < 30; day++){
    var day = 0;
    for(var hour = 1; hour < 2; hour ++){
        for(var strap = 0; strap < 200; strap ++){
            //Generate random date
            randomCycleTime = 3 + (1+Math.random()) + Math.random() + Math.abs(3*Math.sin(2*Math.PI/12 * month)) + Math.abs(3*Math.sin(2*Math.PI/31 * day)) + Math.abs(3*Math.sin(2*Math.PI/24 * hour));
            dateString = 'February ' + day.toString() + ' 2020 ' + hour.toString() + ':03:00';
            randomDate = moment().subtract(month, 'months').subtract(day, 'days').subtract(hour, 'hours').toDate();

            CycleTime.create({
                cycleTime: randomCycleTime,
                strapperPosition: 2,
                created: randomDate
            }, function(err, createdCycleTime){
                if(err){
                    console.log(err);
                } else {
                    console.log("success");
                }
            });
        }
    }
// }

// for(var month = 0; month <=12; month++){
//     for(var day = 0; day<=31 ; day++){
//         for(var hour = 0; hour <=24; hour++){
//             for(var i = 0; i<5 ; i++){
//                 for(var strapperPos = 1; strapperPos <=2; strapperPos ++){
//                     randcycletime = strapperPos*(1+Math.random()) + Math.random() + Math.abs(3*Math.sin(2*Math.PI/12 * month)) + Math.abs(3*Math.sin(2*Math.PI/31 * day)) + Math.abs(3*Math.sin(2*Math.PI/24 * hour));
//                     datecreated = moment().subtract(month, 'months').subtract(day, 'days').subtract(hour, 'hours').toDate();
//                     CycleTime.create({
//                         cycleTime: randcycletime,
//                         strapperPosition: strapperPos,
//                         created: datecreated
//                     }, function(err, createdCycleTime){
//                         if(err){
//                             console.log(err);
//                         } else {
//                             console.log("success!");
//                         }
//                     });
//                 }
//             }
//         }
//     }
// }





// CycleTime.create({
//     cycleTime: 3,
//     strapperPosition: 1,
//     created: moment()
// }, function(err, createdCycleTime){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("success!");
//     }
// });

console.log("END ================================================================");

 
