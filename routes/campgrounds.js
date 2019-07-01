var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res) {
  Campground.find(function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, campground) {
      if (err || !campground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.create(
    {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    },
    // eslint-disable-next-line no-unused-vars
    function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    }
  );
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/edit", { campground: campground });
    }
  });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    // eslint-disable-next-line no-unused-vars
    campground
  ) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  //
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  // eslint-disable-next-line no-unused-vars
  Campground.findByIdAndDelete(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
