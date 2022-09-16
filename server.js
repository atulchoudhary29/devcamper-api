const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colours = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize'); 
const helmet = require("helmet");
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require("body-parser")


// Custom Middleware :-
                        //const logger = require('./middleware/logger');


// Connect to database
connectDB();

// Load env vars
dotenv.config({ path: './config/config.env' });



// Route Files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();

// Body-Parser
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// Custom Middleware :-
                        //app.use(logger);


// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet({ contentSecurityPolicy: false }));  // without contentSecurityPolicy, in index.html file no response function worked

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 100 // Max request of api 
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS 
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV;


const server = app.listen(
    PORT,
    console.log(`Server running in ${dev} mode on port ${PORT}`.yellow.italic)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
});




