const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");


// GET '/:username'
async function getUserPage(req, res) {
    try {
        const { username } = req.params;

        const user = await Stakeholder.findOne({ username });
        const following = user.following;
        const followers = user.followers;

        const events = await Event.find({ organiser: user });

        const response = {
            success: true,
            message: 'User page retrieved successfully',
            user: user,
            following: following,
            followers: followers,
            events: events,
        };

        return res.status(200).json(response);

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST '/:username'
async function postUserPage(req, res) {
    try {
        const { currentUsername } = req.body;
        const { paramUsername } = req.params;

        const currentUser = await Stakeholder.findOne(currentUsername);
        const paramUser = await Stakeholder.findOne(paramUsername);

        if currentUser != paramUser {
            // POST to other user page, othrewise no operation available

            const { follow } = req.body;  // boolean
            if (follow) {
                currentUser.following.push(paramUser);
                paramUser.followers.push(currentUser);

            } else {
                const firstIndex = currentUser.following.indexOf(paramUser);
                const secondIndex = paramUser.followers.indexOf(currentUser);

                if (firstIndex > -1 && secondIndex > -1) {

                    currentUser.following.splice(firstIndex, 1);
                    paramUser.followers.splice(secondIndex, 1);

                } else {

                    const response = {
                        success: false,
                        message: 'Target user is not in following list, target user has not current user in followers list, or both',
                    }
                    // TODO check if status code is adequate
                    return res.status(400).json(response);
                }
            }
        } else {
            const response = {
                success = false,
                message: 'No POST for self user page',
            }
            // TODO check if status code is adequate
            return res.status(400).json(response);
        }
        
        const response = {
            success: true,
            message: 'Operation(s) completed successfully',
        };
        return res.status(200).json(response);

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getUserPage,
    postUserPage
};

