//------------------------------Required Packages------------------------------
require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//------------------------Database Connection Code and Schema for the collections----------------------------
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);

//-----------------------------All get routes--------------------------------
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
  res.render("secrets");
});

app.get("/submit", function(req, res){
  res.render("submit");
});

//----------------------------All post routes-----------------------------------
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username ,
    password: md5(req.body.password)
  });

  newUser.save(function(err){
    if(err){
      res.send(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      res.send(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        } else {
          res.send("Incorrect Login Details")
        }
      }
    }
  });
});


//------------------------------Code for connecting to Server----------------------------
app.listen(3000, function(req, res){
  console.log("Server has Started");
});
