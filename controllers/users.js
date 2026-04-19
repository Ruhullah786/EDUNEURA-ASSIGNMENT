const express = require("express");
const user = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new user({username, email});
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        // Automatically log in the user after successful registration
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
        });        
        }
        catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
        }           
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back! ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
    })
};
    
    
