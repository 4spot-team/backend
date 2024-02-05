require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const errorHandler = require('./middleware/errorHandler');

const homeRoute = require("./routes/home");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const termsAcceptanceRoute = require("./routes/terms");
const eventCreationRoute = require("./routes/addevent");
const settingsRoute = require("./routes/settings");
const recoveryRoute = require("./routes/recover");
const usersRoute = require("./routes/users");
const eventRoute = require("./routes/events");


// Initialize Express app
const app = express();

// Connect to MongoDB
const mongoAtlasUri = process.env.MONGODB_URI;
mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoose is connected"))
  .catch(err => console.error("Could not connect", err));

const dbConnection = mongoose.connection;
dbConnection.on("error", err => console.error(`Connection error ${err}`));
dbConnection.once("open", () => console.log("DB Connected"));

// Middleware
// Permit transfering of big files (images)
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));

// Route Registration
app.use('/', homeRoute);
app.use('/', loginRoute);
app.use('/', signupRoute);
app.use('/', termsAcceptanceRoute);
app.use('/', eventCreationRoute);
app.use('/', settingsRoute);
app.use('/', recoveryRoute);
app.use('/', usersRoute);
app.use('/', eventRoute);

console.log()

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webserver listening on port ${PORT}...`);
});

const origin = "http://" + process.env.FRONTEND_HOST + ':' + process.env.FRONTEND_PORT + '/';

console.log("App started");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);

