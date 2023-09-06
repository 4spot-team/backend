const { Event } = require("../models/events");
const { Stakeholder } = require("../models/stakeholder");


// GET '/api/${apiVersion}/home'
async function getHomeFeed(req, res) {
    try {
        // Provided by checkToken middleware function
        const { username } = req;

        const user = await Stakeholder.findOne(username);
        const following = user.following;  // this is a list of ObjectIds

        // TODO evaluate a score for each event and sort them using this value
        // get list of events created by users in following list
        const events = await Event.find({ organiser: { $in: following } }
            .limit(10);  // limit number to 10 elements

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
};



// POST '/api/${apiVersion}/home'
const postHomePage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST home page"});
};


module.exports = {
    getHomeFeed, 
    postHomePage
};
