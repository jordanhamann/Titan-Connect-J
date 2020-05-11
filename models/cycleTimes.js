var mongoose = require("mongoose");
var moment = require("moment");

var cycleTimeSchema = new mongoose.Schema({
    cycleTime: Number,
    strapperPosition: Number,
    created: Date
});

module.exports = mongoose.model("CycleTime", cycleTimeSchema);