const express = require('express');
const logger = require('morgan');

const app = express();
const db = require('./database');

app.use(logger('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//Auth methods routes
app.use("/auth/v1", require("./v1/routes/auth"));
app.use("/post/v1", require("./v1/routes/post"));



module.exports = app;