const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const mapboxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geoCoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find();
    const mapToken = process.env.MAPBOX_TOKEN;

    res.render('campgrounds/index', { campgrounds, mapToken });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const { title, location, price, description } = req.body.campground;
    // const geometryData = geoData.body.features[0].geometry;
    // Create a new campground document using the Campground model
    const newCampground = new Campground({
        _id: new mongoose.Types.ObjectId(),
        title,
        location,
        price,
        description
    });
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    newCampground.author = req.user._id;
    // Wait for the newCampground.save() promise to resolve or reject
    await newCampground.save();
    req.flash('success', "successfully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampgrounds = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', "Campground not found");
        return res.redirect('/campgrounds');
    }

    // await campground.review.populate('author');
    await campground.populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    await campground.populate('author');


    // console.log(campground.images.map(img => {
    //     return { url: img.url, filename: img.filename }
    // }));
    // const imageurl = await getImage();
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    let campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Campground not found");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    campground.geometry = geoData.body.features[0].geometry

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    campground.images.forEach(async (img) => {
        await cloudinary.uploader.destroy(img.filename);
    })
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the campground");
    res.redirect('/campgrounds');
}

