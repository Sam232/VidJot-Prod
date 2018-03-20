const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {Ideas} = require("../models/Ideas");
const {User} = require("../models/Users"); 

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have successfully logged out.");
  res.redirect("/users/login");
});

router.post("/register", (req, res) => {
  var errors = [];

  if(req.body.password.length < 8){
    errors.push({text: "Password Field Should Be Greater Than 7"});
  }

  if(req.body.password2.length < 8){
    errors.push({text: "Confirm Password Field Should Be Greater Than 7"});
  }

  if((req.body.password) !== (req.body.password2)){
    errors.push({text: "Passwords Do Not Match"});
  }

  if(errors.length > 0){
    res.render("users/register", {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }

  else{
    var newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    User.findOne({email: newUser.email}).then((user) => {
      if(!user){
        return bcrypt.genSalt(10, (err, salt) => {
          if(err){
            errors.push({text: "Unable To Create New User, Try Again."});
            return res.render("users/register");
          }
    
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err){
              errors.push({text: "Unable To Create New User, Try Again."});
              return res.render("users/register");
            }
    
            newUser.password = hash;
    
            var user = new User(newUser);
            user.save().then((user) => {
              req.flash("success_msg", "You Are Now Registered And Can Login");
              res.redirect("/users/login");
            })
            .catch((err) => {
              errors.push({text: "Unable To Create New User, Try Again."});
              res.render("users/register");
            });
    
          });
        });
      }

      errors.push({text: "Email Address Already Exist."});
      res.render("users/register", {
        errors
      });      
    })
    .catch((err) => {

    });
  }

});

router.post("/login", (req, res, next) => {
  if(!req.body.email && !req.body.password){
    req.flash("error_msg", "Email And Password Are Required");
    return res.redirect("/users/login");
  }

  if(!(req.body.email)){
    req.flash("error_msg", "Email Is Required");
    return res.redirect("/users/login");
  }

  if(!(req.body.password)){
    req.flash("error_msg", "Password Is Required");
    return res.redirect("/users/login");
  }

  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

module.exports = router;