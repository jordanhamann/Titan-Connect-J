var mongoose = require("mongoose");

//Schema Setup
var faultSchema = new mongoose.Schema({
    time: {type:Date, default: Date.now},
    type: String,
    title: String,
    message: String,
    strapperPos: Number
});

module.exports = mongoose.model("Fault", faultSchema);