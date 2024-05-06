require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require("path");
const passport = require("passport");
const flash = require('express-flash');
// const findUserByEmail = require('./utils/findUserByEmail');
// const initializePassport = require("./middleware/passport_config");


const app = express();


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.JWT_SECRET,
    saveUninitialized: true,
    resave: false
  })
)
// using passport.authenticate
app.use(passport.initialize())
app.use(passport.session())

// Import and initialize your authentication strategies
require('./config/google-oauth2')(passport);

// Setup flash middleware
app.use(flash());

// Setup static route
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(require('express-ejs-layouts'))


// set Template engine
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// routes...
app.use('', require('./routes/routes'))
app.use('/auth/', require('./routes/auth'))


// Import Connect DB
const connectDB = require('./db/connect')


// port
const port = process.env.PORT || 3000;

// start server.........
// app.listen(port, () =>
//   console.log(`Server is listening on port ${port}...`)
// );

const start = async () => {
    try {
      connectDB(process.env.MONGODB_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
};

start();