var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds/");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
          res.redirect("/campgrounds/" + req.params.id + "/comments/new");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          campground.comments.push(comment);
          // eslint-disable-next-line no-unused-vars
          campground.save(function(err, campground) {
            if (err) {
              console.log(err);
              res.redirect("/campgrounds/" + req.params.id + "/comments/new");
            } else {
              req.flash("success", "Successfully added comment");
              res.redirect("/campgrounds/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/edit", {
        comment: comment,
        campground_id: req.params.id
      });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    // eslint-disable-next-line no-unused-vars
    comment
  ) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  // eslint-disable-next-line no-unused-vars
  Comment.findByIdAndDelete(req.params.comment_id, function(err, comment) {
    if (err || !comment) {
      req.flash("error", "Comment not found");
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      req.flash("success", "Successfully deleted comment");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
