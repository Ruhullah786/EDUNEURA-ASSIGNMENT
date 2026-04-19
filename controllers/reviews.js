const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
        let newReview = new review(req.body.review);
    
        newReview.author = req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);
    
        await newReview.save();
        await listing.save();
    
        req.flash("success", "Successfully created a new review!");
        res.redirect(`/listings/${listing._id}`)
};

module.exports.destroyReview = async (req, res) => {
     const {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await review.findByIdAndDelete(reviewId);
    
        req.flash("success", "Successfully deleted the review!");
        res.redirect(`/listings/${id}`);
};