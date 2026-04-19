const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
const { generateDescription } = require("../utils/ai");

module.exports.index = async (req, res) => {
    const allListings =await Listing.find({});
     res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    console.log("Current User:", req.user);
    res.render("listings/new.ejs");
}; 

module.exports.showListing = async (req, res) => {
    const {id} = req.params;
        const listings = await Listing.findById(id)
            .populate("owner")
            .populate({"path": "reviews", "populate": {"path": "author"}});

        if(!listings){
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
        }
        console.log(listings);
        console.log("Owner is:", listings.owner);
        console.log("Connected DB:", mongoose.connection.name);
        res.render("listings/show.ejs", {listings});
};      

module.exports.createListing = async (req, res) => {  

    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (
    (!req.body.listing.description || req.body.listing.description.trim() === "") &&
         req.body.useAI
) {
    try {
        const aiDesc = await generateDescription(
            req.body.listing.title,
            req.body.listing.location
        );
        newListing.description = aiDesc;
    } catch (err) {
        console.log("AI error:", err);
        newListing.description = "No description available.";
    }
}

    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    }

    if (response.body.features.length > 0) {
        newListing.geometry = response.body.features[0].geometry;
    }

    let savedListing = await newListing.save();
    console.log("Saved Listing:", savedListing);
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings`);
}; 

module.exports.renderEditForm = async (req, res) => {
    const id= req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let originalImageUrl = "";
    if(listing.image && listing.image.url){
        originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    }
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
        const { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing}, {new:true, runValidators:true});
        
        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

        if(response.body.features.length > 0){
        listing.geometry = response.body.features[0].geometry;
        }

        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            
        }
        await listing.save();
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log("Deleted Listing:", deletedListing);
        req.flash("success", "Successfully deleted the listing!");
        res.redirect("/listings");  
};
