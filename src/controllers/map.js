const { Event } = require("../models/event");


// POST '/map'
async function eventsMap(req, res) {
    try {
        const {
            start_lat,
            start_long;,
            end_lat,
            end_long,
        } = req.body;

        if (typeof start_lat === "undefined" ||
            typeof start_long === "undefined" || 
            typeof end_lat === "undefined" || 
            typeof end_long === "undefined") {

            return res.status(400).json({
                success: false,
                message: "Required fields missing in request body",
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

        for (event in events) {
            event.populate('ratings').exec();
            await event.save();
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
