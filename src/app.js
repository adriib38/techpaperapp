const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');

const app = express();
const db = require('./database');

app.use(logger('tiny'));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Auth methods routes
app.use("/auth/v1", require("./v1/routes/auth"));
app.use("/post/v1", require("./v1/routes/post"));
app.use("/user/v1", require("./v1/routes/user"));
app.use("/profile/v1", require("./v1/routes/profile"));

// Error handler
app.use((req, res, next) => {
    res.status(404).json({ 
        error: 'Endpoint not Found',
        endpoint: req.originalUrl
    });
});

module.exports = app;