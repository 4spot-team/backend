const { Event } = require("../models/event");


// POST '/map'
async function eventsMap(req, res) {
    try {
        const {
            lat,
            lng
        } = req.body;

        if (typeof lat === "undefined" ||
            typeof lng === "undefined") {

            return res.status(400).json({
                success: false,
                message: "Required fields missing in request body",
            });
        }

        const start_lat = lat[0];
        const end_lat = lat[1];
        const start_long = lng[0];
        const end_long = lng[1];

        if (typeof start_lat === "undefined" ||
            typeof start_long === "undefined" || 
            typeof end_lat === "undefined" || 
            typeof end_long === "undefined") {

            return res.status(400).json({
                success: false,
                message: "Provided fields are not ranges",
            });
        }

        if (isNaN(start_lat) ||
            isNaN(start_long) ||
            isNaN(end_lat) ||
            isNaN(end_long)) {

            return res.status(400).json({
                success: false,
                message: "Required fields have wrong type",
            });
        }

        if (start_lat > end_lat || start_long > end_long) {
            return res.status(400).json({
                success: false,
                message: "Provided ranges are inconsistent",
            });
        }

        if (start_lat < -90. || start_long < -180. ||
            end_lat > 90. || end_long > 180.) {
            return res.status(400).json({
                success: false,
                message: "Provided ranges are out of bounds",
            });
        }

        const events = await Event.find({
            'location.coordinates.0': { 
                $gte: parseFloat(start_lat),
                $lte: parseFloat(end_lat),
            },
            'location.coordinates.1': {
                $gte: parseFloat(start_long),
                $lte: parseFloat(end_long),
            },
        // TODO Limit is fixed here but should be calculated in base of range
        }).limit(25);

        for (let i=0; i<events.length; i++) {
            Event.findOne({_id: events[i]._id})
            .populate('ratings').exec();
            await events[i].save();
        }

        return res.status(200).json({
            success: true,
            message: "Events filtered successfully",
            events,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    eventsMap
};
