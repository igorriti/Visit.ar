const req = require("express/lib/request");
const res = require("express/lib/response");
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas');
const Campground = require('./models/campground');
const Review = require("./models/review");
const user = require("./models/user");


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {

	const {error} = campgroundSchema.validate(req.body);
	if (error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg,400);
	} else {

		next()
	}
}

module.exports.isAuthor = async (req,res,next)=>{
	const {id} = req.params;
	const campground = await Campground.findById(id);
	if (campground.author.equals(req.user._id) ||req.user.isAdmin){
		next();

	} else {
		console.log(res.locals.currentUser.isAdmin)
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
}

module.exports.validateReview = (req,res,next) => {

	const {error} = reviewSchema.validate(req.body);
	if (error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg,400);
	} else {

		next()
	}

}

module.exports.isreviewAuthor = async (req,res,next)=>{
	const {id, reviewId} = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)){
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
    next();
}
