const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const db = require('./database');

app.use(logger('tiny'));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//Auth methods routes
app.use("/auth/v1", require("./v1/routes/auth"));
app.use("/post/v1", require("./v1/routes/post"));
app.use("/user/v1", require("./v1/routes/user"));
app.use("/profile/v1", require("./v1/routes/profile"));

// Error handler
app.use((req, res, next) => {
    /*
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    */
   
    res.status(404).json({ 
        error: 'Endpoint not Found',
        endpoint: req.originalUrl
    });
    next();
});

module.exports = app;