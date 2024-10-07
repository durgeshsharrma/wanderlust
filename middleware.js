const Listing = require("./models/listing.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req , res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Login Required to add Listing");
        return res.redirect("/login");
            }
            next();
}

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req , res , next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
           req.flash("error" , "You are not the owner of that Listing");
           
           return res.redirect("/listing");
    }
    next();
}


module.exports.isReviewAuthor = async (req , res , next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    

    if(!review.author.equals(res.locals.currUser._id)){
        
           req.flash("error" , "You are not the author of this Review");
           
           return res.redirect(`/listing/${id}`);
    }
    next();
}
