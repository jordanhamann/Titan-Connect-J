var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    moment = require("moment"),
    User = require("./models/user"),
    request = require('request'),
    mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./'));

//Database setup
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb://localhost/TitanConnectV1",{ useNewUrlParser: true });

//Passport Authentication Configuration
app.use(require("express-session")({
    secret: "Gretsch Orange",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose Models
// var Fault = require("./models/faults");
var ParameterChange = require("./models/parameterChange");
var CycleTime = require("./models/cycleTimes");

//middleware providing the currentUser variable to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.cycleTimeChartData = [];
    next();
});

//ROUTES
app.get("/", function(req, res){
    res.render("home");
});

//Auth Routes
var authRoutes = require("./routes/auth");
app.use(authRoutes);

//Parameter Routes
var parameterRoutes = require("./routes/parameters");
app.use(parameterRoutes);

//Fault ROUTES

//Cycle Time Routes
var cycletimeRoutes = require("./routes/cycletimes");
app.use(cycletimeRoutes);

app.listen(3000, function(){
    console.log("Titan Connect server is listening on port 3000");
});