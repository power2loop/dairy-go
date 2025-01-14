const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './.env' });


// Define the app and port
const app = express();

// const mongoURL = process.env.MONGODB_URL_LOCAL // local db connect
const mongoURL = process.env.MONGODB_URL // global db connect
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json()); // to parse JSON data
app.use(cors()); // to allow cross-origin requests
app.use(bodyParser.json());

const allRoutes = require('./routes/AllRoutes');
app.use('/api', allRoutes);



// MongoDB connection
mongoose.connect(mongoURL)

    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
