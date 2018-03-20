const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const {User} = require("../models/Users");

module.exports = (passport) => {
  passport.use(new LocalStrategy({usernameField: "email"}, (email, password, done) => {
    User.findOne({email}).then((user) => {
      if(user){
        return bcrypt.compare(password, user.password).then(res => {
          if(res){
            return done(null, user);
          }
          done(null, false, {message: "Incorrect User Password Provided"});
        })
        .catch((err) => {
          done(null, false, {message: "An Error Occured While Logging In, Try Again."});
        })
      }
      done(null, false, {message: "No User Found"});
    })
    .catch((err) => {
      done(null, false, {message: "An Error Occured While Logging In, Try Again."});
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

}