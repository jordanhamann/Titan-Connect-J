var mongoose = require("mongoose");

var parameterChangeSchema = new mongoose.Schema({
    // //Strap Feed Parameters
    // strapFeedSpeedFast: Number,
    // strapFeedSpeedSlow: Number,
    // strapBackSpeedFast: Number,
    // strapBackSpeedSlow: Number,
    // distanceToSlowFeed: Number,
    // distanceToSlowRetract: Number,
    // timeToSlowRetract: Number,
    // timeToSlowFeed: Number,
    // //Refeed Parameters
    // minStrapLength: Number,
    // timeRefeedBackwards: Number,
    // maxStrapLength: Number,
    // timeRefeedForwards: Number,
    // numberOfRefeeds: Number,
    // //Tension and Sealing Parameters
    // tensionTime: Number,
    // tensionRockerDelay: Number,
    // tensionBreakTime: Number,
    // numberOfTensionCycles: Number,
    // tensionReliefTime: Number,
    // coolingTime: Number,
    // closeHeadDelay: Number,
    // //Runtime Monitoring Timers
    // totalCycleRuntime: Number,
    // strapFeedRuntime: Number,
    // strapBackRuntime: Number,
    // tensionRuntime: Number,
    // camRuntime: Number,
    // heaterRuntime: Number,
    // //Heater Parameters
    // basicTemperature: Number,
    // cleaningTemperature: Number,
    // strapsUntilCleaning: Number,
    // //Mode Parameters
    // backWithTensionMotorMode: Boolean,
    // refeedMode: Boolean,
    // cyclePrepareMode: Boolean,
    // cyclicTensioningMode: Boolean,
    // autoCleanMode: Boolean,
    // headRemainOpenMode: Boolean,
    // revStopMode: Boolean,

    
    //Time that the parameter change occurred
    timeChanged: {type:Date, default: Date.now}
});

module.exports = mongoose.model("Parameter", parameterChangeSchema);