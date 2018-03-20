const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const ideas = require("./routes/ideas");
const users = require("./routes/users");

const {MONGODB_URI, output} = require("./config/database"); 
require("./config/passport")(passport);


var app = express();

mongoose.connect(MONGODB_URI)
  .then((res) => {
    console.log(output);
  })
  .catch((err) => {
    console.log(output, err);
  });


//Handlebars Middleware
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//MethodOverride Middleware
app.use(methodOverride("_method"));

//Static folder
app.use(express.static(path.join(__dirname, "/public")))

//ExpressSession Middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
app.use(flash());

//Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  
  next();
});

app.get("/", (req, res) => {
  var title = "Welcome";
  res.render("index", {
    title  
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/ideas", ideas);
app.use("/users", users);

var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});