if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");

const helmet = require('helmet');

const MongoStore = require('connect-mongo');

const userAuthRoutes = require("./routes/users.js");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/camp-scape';
// process.env.DB_URL || 
mongoose.connect(dbUrl);

const db = mongoose.connection; // Connection object represents the connection to the MongoDB database.
db.on("error", console.error.bind(console, "connection error:"));
// bind() method allows you to create a new function with a specific co ntext (the value of this)
//   and optionally pre-set arguments. 

db.once("open", () => {
    console.log("Database Connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//For parsing the data like we did in the app.post for '/campground' =>(req.body.campground)
app.use(express.urlencoded({ extended: true }));

// To send a put request through a form.
app.use(methodOverride('_method'));

app.use(mongoSanitize()); 
// For every request, this method will run, which whould let anybody to write queries in the input form or write any special
// characters like $,%,# any many more. It is used to avoid any security vulnerabilities.

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e) {
    console.log("Session Store Error", e);
})

const sessionConfig = {
    store,
    name: 'session', // "session" will be written instead of "session.id" in cookies
    secret: 'needabettercret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true, // cookies only works in https. session wont work in localhost as localhost is http only
        httpOnly: true, // makes cookies only accessible through http, no javascript can access
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}


app.use(helmet()); 
// Each and every reader request will be included with some header which will help secure the app

// Below all this is a part of content-security-policy, that comes with 'helmet', it helps in securing the app by only 
// allowing to have access to external websites, like bootstrap, mapbox, google fonts(if used), cloudflare, etc.
// For the next 42 lines, its all about CSP, you can read docs 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djs1tvguk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // Whatever here will be accessible around everywhere
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    res.locals.currentUser = req.user;

    next();
})

app.get('/', async (req, res) => {
    res.render('home');
})

app.use('/', userAuthRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes);


// If no route matches, then this default error would be thrown saying 'page not found'
app.all('*', async (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

//if any of the above routes matches and caused any error, they will call this app.use and for all
// this routes we can define a generic template to show  this errors.
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // res.status(statusCode).send(message);
    if (!err.message) err.message = 'Something went wrong!';
    res.render('error', { err });
})


app.listen(3000, () => {
    console.log("serving on port 3000");
})


