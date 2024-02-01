const crypto = require("crypto");

const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");

// Combines title and organiser (which together are the unique key attribute of
// an event) into a SHA-256 base64-encoded hash, which is used as a unique code 
// identifier
function generateEventCode(title, organiser) {
    const combinedString = title + organiser;

    const hash = crypto.createHash("sha-256").update(combinedString).digest();
    const b64Hash = hash.toString("base64");

    return b64Hash;
}


// POST '/addevent'
async function fillEvent(req, res, next) {
    try {
        // Provided by checkToken middleware function
        const { username } = req;

        const { 
            // Required fields
            title,
            types,
            location,
            date,
            noUnderage,
            hasQR,
            image,
            // Optional fields
            tickets,
            price,
            messagingGroup,
            hashtags,
            description,
            numOfSpots,
            occupiedSpots,
            ratings,
            comments,
        } = req.body;

        // Check if required fields have been submitted
        if ( !title || !types || !location || !date || !noUnderage || 
             !hasQR || !image ) {
            return res.status(400).json({
                success: false,
                message: "Required fields for event publishing missing in request body",
            });
        }

        // Check if date is valid (not before now)
        if (date < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Submitted `date` is smaller than current one",
            });
        }

        const user = await Stakeholder.findOne({ username });

        // Check if there is another Event with the same key fields
        const oldEvent = await Event.findOne({ title, organiser: user });
        if (oldEvent) {
            return res.status(400).json({
                success: false,
                message: "User has already published an Event with the same title",
            });
        }

        const eventCode = generateEventCode(title, username);

        const newEvent = new Event({
            title,
            organiser: user,
            code: eventCode,
            types,
            location,
            date,
            noUnderage,
            hasQR,
            image,
        });

        // Set optional fields, if defined
        if (tickets) {
            newEvent.tickets = tickets;
        }
        if (price) {
            newEvent.price = price;
        }
        if (messagingGroup) {
            newEvent.messagingGroup = messagingGroup;
        }
        if (hashtags) {
            newEvent.hashtags = hashtags;
        }
        if (description) {
            newEvent.description = description;
        }
        if (numOfSpots) {
            newEvent.numOfSpots = numOfSpots;
        }
        if (occupiedSpots) {
            newEvent.occupiedSpots = occupiedSpots;
        }
        if (ratings) {
            newEvent.ratings = ratings;
        }
        if (comments) {
            newEvent.comments = comments;
        }

        await newEvent.save();

        res.status(200).json({
            success: true,
            message: 'Event published successfully',
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    fillEvent
};

