const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//reviews
const reviewController = require("../controllers/reviews.js");
//post review
router.post("/",isLoggedIn("You must be logged in to post a new review!"), validateReview, wrapAsync(reviewController.postReview));
//delete review
router.delete("/:reviewId",isLoggedIn("You must be logged in to delete a review!"), isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;