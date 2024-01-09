const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");


// GET '/api/${apiVersion}/home'
async function getHomeFeed(req, res) {
    try {
        // Provided by checkToken middleware function
        const { username } = req;

        const user = await Stakeholder.findOne({ username });
        const following = user.following;  // this is a list of ObjectIds

        // TODO evaluate a score for each event and sort them using this value
        // get list of events created by users in following list
        const events = await Event.find({ organiser: { $in: following } }
            .limit(10)  // limit number to 10 elements
        );  

        const response = {
            success: true,
            message: 'Home feed retrieved successfully',
            events: events,
        };

        return res.status(200).json(response);

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



// POST '/api/${apiVersion}/home'
async function filterEventsByQuery(req, res) {
    try {
        const { query } = req.body;
        // Provided by checkToken middleware function
        const { username } = req;

        const user = await Stakeholder.findOne(username);
        const following = user.following;

        // TODO evaluate event score value (as in the GET request controller)
        // get list of events created by users in following list
        //   and whose title matches the query provided in the POST request
        const events = await Event.find({
            organiser: { $in: following },
            // 'i' for case insensitive string matching
            title: { $regex: new RegExp(query, 'i') },
        }).limit(10);

        // TODO evaluate user score value
        // get list of users whose username matches the query provided in the POST request
        const users = await Stakeholder.find({
            // TODO find a way to filter out the username of the current user
            username: { $regex: new RegExp(query, 'i') },
        }).limit(10);

        // TODO evaluate event score value (as in the GET request controller)
        // get list of any event whose title matches the query (even if not organized by a followed user)
        const generalEvents = await Event.find({
            // TODO find a way to filter out events organized by the current user
            title: { $regex: new Regexp(query, 'i') },
        }).limit(10);

        const response = {
            success: true,
            message: 'Home filtered feed retrieved successfully',
            events: events,
            users: users,
            generalEvents: generalEvents,
        };

        return res.status(200).json(response);
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    getHomeFeed, 
    filterEventsByQuery,
};
