require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
//const bcrypt = require("bcryptjs");
//const saltRounds = 10;
const session = require('express-session')
const passport = require("passport")
const passportLocalMongoose= require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

userSchema.plugin(passportLocalMongoose);

//declare a var secret as long
// THis is our encryption key
//put this in .env
//const secret = "Thisisoursecret.";

//use plugin to extend the functionality of our schema
//will encrypt the whole database, use encryptedFields 
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secrets", function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    //using passport
    // req.logout();
    // res.redirect("/");
});

app.post("/register", function(req, res){

    //using passport
    // User.register({username: req.body.username}, req.body.password, function(err, user){
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/register");
    //     } else {
    //         //user passport to authenicate, call back is trigger if authen is good
    //         passport.authenticate("local")(req, res, function(){
    //             res.redirect("/secrets");
    //         })
    //     }
    // })



    //bcrypt hasing
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const newUser = new User({
    //         email: req.body.username,
    //         //password: req.body.password
    //         //password: md5(req.body.password)
    //         password: hash
    
    //     });
    //     newUser.save(function(err){
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.render("secrets")
    //         }
    //     });
    // });
});

app.post("/login", function(req, res){

    //using passport
    // const user = new User({
    //     username: req.body.username,
    //     password: req.body.password
    // })

    // req.login(user, function(err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         passport.authenticate("local")(req, res, function() {
    //             res.render("secrets");
    //         });
    //     }
    // });


    //bcrypt hasing
    // const userName = req.body.username;
    // const passWord = req.body.password;

    // //if there is a username and that matches with the password then render to secrets page
    // User.findOne({email: userName}, function(err, loginFound){
    //     if (loginFound) {
    //         bcrypt.compare(passWord, loginFound.password, function(err, result) {
    //             if (result) {
    //                 res.render("secrets");
    //             }
    //         });
    //     } else if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("wrong email or password");
    //         res.render("login");
    //     }
    // })
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});