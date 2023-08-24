require("dotenv").config();

const express = require('express');
const app = express();

const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const privacyRoute = require("./routes/privacy");
const eventCreationRoute = require("./routes/addevent");
const settingsRoute = require("./routes/settings");
const recoveryRoute = require("./routes/recover");
const usersRoute = require("./routes/users");
const eventRoute = require("./routes/events");

app.use('/', loginRoute);
app.use('/', signupRoute);
app.use('/', privacyRoute);
app.use('/', eventCreationRoute);
app.use('/', settingsRoute);
app.use('/', recoveryRoute);
app.use('/', usersRoute);
app.use('/', eventRoute);


const homeController = require("./controllers/home");
app.get('/', homeController.getHomePage);
app.post('/', homeController.postHomePage);

app.listen(3000, () => {
    console.log("Webserver listening on port 3000...");
});

console.log("App started");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
