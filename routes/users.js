const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js')
const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users.js');

router.route('/register')
    .get(users.renderRegisterPage)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginPage)
    .post(storeReturnTo,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login'
        }),
        users.loginUser)

router.get('/logout', users.logoutUser);

module.exports = router;