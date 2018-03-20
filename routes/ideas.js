const express = require("express");
const router = express.Router();

const {ensureAuthenticated} = require("../helper/auth"); 

const {Ideas} = require("../models/Ideas");

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("Ideas/add");
});

router.get("/", ensureAuthenticated, (req, res) => {
  Ideas.find({userId: req.user._id})
  .sort({date: "desc"})
  .then((ideas) => {
    if(ideas.length > 0){
      res.render("Ideas/index", {
        ideas
      });
    }
    else{
      res.render("Ideas/index", {
        message: true
      });
    }
  })
  .catch((err) => {
    req.flash("error_msg", "Unable To Fetch Video Ideas");
    res.render("Ideas/index");
  });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Ideas.findById(req.params.id).then((idea) => {
    if(idea.userId != req.user._id){
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/ideas");
    }

    res.render("Ideas/edit", {
      videoIdea: idea
    });
  })
  .catch((err) => {
    req.flash("error_msg", "Unable To Fetch Video Ideas");
    res.render("Ideas/edit");
  });
});

router.post("/", ensureAuthenticated, (req, res) => {
  var errors = [];

  if(!req.body.title){
    errors.push({text: "Please add a title"});
  }
  if(!req.body.details){
    errors.push({text: "Please add some details"});
  }

  if(errors.length > 0){
    res.render("Ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else{
    var newUser = {
      title: req.body.title,
      details: req.body.details,
      userId: req.user._id
    }
    console.log(req.user)
    new Ideas(newUser).save()
      .then((idea) => {
        req.flash("success_msg", "New Video Idea Added");
        res.redirect("/ideas");
      })
      .catch((err) => {
        req.flash("error_msg", "Unable To Add Video Idea, Try Again."); 
        res.redirect("/ideas");
      });
  }

});

router.put("/:id", ensureAuthenticated, (req, res) => {
  var errors = [];

  if(!req.body.title){
    errors.push({text: "The Title For Your Video Idea Is Required"});
  }
  if(!req.body.details){
    errors.push({text: "The Details For Your Video Idea Is Required"});
  }

  if(errors.length > 0){
    req.flash("error", error)
    res.redirect("ideas/edit");
  }
  else{
    Ideas.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        details: req.body.details
      }
    }, {new: true})
    .then((updatedIdea) => {
      Ideas.find({}).then((ideas) => {
        req.flash("success_msg", "Update Successful");
        res.redirect("/ideas")
      })
      .catch((err) => {
        req.flash("error_msg", "Update Successful But Unable To Fetch Video Ideas");
        res.redirect("/ideas");
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Unable To Update Video Idea");
      res.redirect("/ideas");
    });
  }
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  var videoId = req.params.id;

  Ideas.findByIdAndRemove(videoId).then((videoIdea) => {
    Ideas.find({}).then((ideas) => {
      if(ideas.length > 0){
        req.flash("success_msg", "Video Idea Deleted Successfully")
        res.redirect("/ideas");
      }
      else{
        req.flash("success_msg", "Video Idea Deleted Successfully")
        res.redirect("/ideas");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Unable To Fetch Video Ideas")
      res.redirect("/ideas");
    });    
  })
  .catch((err) => {
    req.flash("error_msg", "Unable To Delete Video Idea")
    res.redirect("ideas");
  });
});

module.exports = router;