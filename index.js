// Environment configuration (for client id, client secret)
require('dotenv').config();

const express = require('express');
const morgan = require('morgan')('combined');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const mysql = require('mysql');
const flash = require('connect-flash');

const routes = require('./routes/routes');

// Create a new Express application.
const app = express();

// Initialize db
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_DATABASE
});


db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("DB connection established.");
});
global.db = db;


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.use(flash()); // flash messages

app.use(function (req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });


app.listen(process.env['PORT'] || 8080);
