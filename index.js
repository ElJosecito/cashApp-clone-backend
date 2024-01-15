const express = require('express');
//get the database connection
const connectDB = require('./src/config/database');

const app = express();

//env variables
require("dotenv").config();

//connect to database
connectDB();

//midelewares
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token");
    next();
});

//body parser
app.use(express.json());

//routes

//User routes
app.use('/api', require('./src/routes/UserRoutes'));

//Card routes
app.use('/api', require('./src/routes/CardRoutes'));

//Account routes
app.use('/api', require('./src/routes/AccountRoutes'));



//port to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
