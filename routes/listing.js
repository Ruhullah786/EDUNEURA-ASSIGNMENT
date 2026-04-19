const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(
    isLoggedIn("you must be logged in to post a new listing!"), 
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New route
router.get("/new", isLoggedIn("You must be logged in to create a new listing!"), listingController.renderNewForm);

router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(
    isLoggedIn("you must be logged in to update a listing!"), 
    isOwner, 
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.updateListing)
 )
 .delete(
    isLoggedIn("you must be logged in to delete a listing!"), 
    isOwner, 
    wrapAsync(listingController.destroyListing)
);

//edit route
router.get("/:id/edit",
    isLoggedIn("you must be logged in to edit a listing!"),
    isOwner, 
    listingController.renderEditForm
);

module.exports = router;
