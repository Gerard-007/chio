require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require("path");
const passport = require("passport");
const flash = require('express-flash');
// Import HTTP module for socketIO to work...
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');
// const findUserByEmail = require('./utils/findUserByEmail');
// const initializePassport = require("./middleware/passport_config");


const app = express();

// To use socketIO we create an HTTP server and pass the Express app to it
const server = http.createServer(app);
// Attach Socket.IO to the HTTP server, not directly to the Express app
const io = socketIO(server);


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

// Setup Morgan debug tool
// app.use(morgan('dev'));

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
app.use('/tribute/', require('./routes/tribute')(io))
app.use('/gallery/', require('./routes/gallery')(io))


// Import Connect DB
const connectDB = require('./db/connect')


// port
const port = process.env.PORT || 9696;

// start server.........
// app.listen(port, () =>
//   console.log(`Server is listening on port ${port}...`)
// );


// Listen for socket connections
io.on('connection', socket => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const start = async () => {
  try {
      // Connect to MongoDB
      await connectDB(process.env.MONGODB_URI);

      // Start the HTTP server instead of the Express app directly
      server.listen(port, () => {
          console.log(`Server is listening on port ${port}...`);
      });
  } catch (error) {
      console.log(error);
  }
};

start();
