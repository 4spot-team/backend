const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");

async function populateEventFields(item, index, arr) {
    await arr[index]
        .populate('organiser')
        .populate('tickets')
        .populate({
            path: 'types',
            populate: { path: 'superType' },
        })
        // .populate('messagingGroup')
        .exec();
}


// GET '/:username'
async function getUserPage(req, res) {
    try {
        const { username } = req.params;

        const user = await Stakeholder.findOne({ username });

        if (typeof user === "undefined") {
            return res.status(400).json({
                success:false,
                message: "Could not find required user",
            });
        }

        const events = await Event.find({ organiser: user });

        await user
            .populate('followers', 'username')
            .populate('following', 'username')
            .exec();

        // TODO probably is not necessary to populate all the Event fields
        await events.forEach(populateEventFields);

        const response = {
            success: true,
            message: 'User page retrieved successfully',
            user: user,
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

        // Provided by checkToken middleware function
        const { username } = req;
        const paramUsername = req.params.username;

        const user = await Stakeholder.findOne(username);
        const paramUser = await Stakeholder.findOne(paramUsername);

        if (typeof paramUser === "undefined") {
            return res.status(400).json({
                success:false,
                message:"Could not find username specified in request params",
            });
        }

        if user._id != paramUser._id {
            // POST to other user page, othrewise no operation available

            const { follow } = req.body;  // boolean
            if (typeof follow !== "undefined") {
                if (typeof follow === "boolean") {
                    if (follow) {
                        user.following.push(paramUser._id);
                        paramUser.followers.push(user._id);
                    } else {
                        const firstIndex = user.following.indexOf(paramUser);
                        const secondIndex = paramUser.followers.indexOf(currentUser);

                        if (firstIndex > -1 && secondIndex > -1) {

                            currentUser.following.splice(firstIndex, 1);
                            paramUser.followers.splice(secondIndex, 1);

                        } else {

                            return res.status(400).json({
                                success: false,
                                message: 'Target user is not in following list, target user has not current user in followers list, or both',
                            });
                        }
                    }
                } else {
                    return res.status(400).json({
                        success:false,
                        message:"Provided 'follow' field is not a boolean",
                    });
                }
            } else {
                return res.status(400).json({
                    success:false,
                    message:"Required 'follow' field missing in request body",
                });
            }
        } else {
            const response = {
                success = false,
                message: 'No POST for self user page',
            }
            return res.status(400).json(response);
        }

        await user.save();
        await paramUser.save();
        
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

