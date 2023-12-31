if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log(process.env.SECRET);
console.log(process.env.API_KEY);


const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');

const catchAsync = require("../utils/catchAsync");

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('It worked');  
// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));




module.exports = router;  