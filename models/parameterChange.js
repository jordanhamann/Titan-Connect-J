var mongoose = require("mongoose");

var parameterChangeSchema = new mongoose.Schema({    
    name: String,                                   //Parameter Name
    dataType: String,                               //What datatype the parameter is eg. Real, Time, Boolean, Integer 
    value: String,                                  //Parameter Value
    units: String,
    category: String,                               //Parameter Category eg. Heater Parameter, Tension Parameter, etc.
    changed: Boolean,                               //Was the parameter changed
    valueRequest: Boolean,                          //Was the current value requested by Titan Connect
    dateCreated: Date     //Time that the parameter change occurred
});

module.exports = mongoose.model("Parameter", parameterChangeSchema);