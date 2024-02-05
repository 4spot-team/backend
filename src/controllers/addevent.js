const crypto = require("crypto");

const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");
const { EventType, SuperEventType } = require("../models/eventType");
const { events } = require("../models/recoveryToken");

const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

// Combines title and organiser (which together are the unique key attribute of
// an event) into a SHA-256 base64-encoded hash, which is used as a unique code 
// identifier
function generateEventCode(title, organiser) {
    const combinedString = title + organiser;

    const hash = crypto.createHash("sha256").update(combinedString).digest();
    const b64Hash = hash.toString("base64");

    return b64Hash;
}

// Check if input is an array and contains only strings
function isStringArray(array) {
    if (!Array.isArray(array)) {
        return false;
    }

    for (const s in array) {
        if (!(typeof s === 'string' || s instanceof String)) {
            return false;
        }
    }
    return true;
}




// POST '/addevent'
async function fillEvent(req, res, next) {
    try {
        // Provided by checkToken middleware function
        const { username } = req;

        const eventData = req.body;  // JSON with Event info

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
            // messagingGroup,
            hashtags,
            description,
            numOfSpots,
            price
        } = eventData;

        // Check if required fields have been submitted
        if ((typeof title === "undefined") ||
            (typeof types === "undefined") ||
            (typeof location === "undefined") ||
            (typeof date === "undefined") ||
            (typeof noUnderage === "undefined") ||
            (typeof hasQR === "undefined") ||
            (typeof image === "undefined")) {

            return res.status(400).json({
                success: false,
                message: "Required fields for event publishing missing in request body",
            });
        }

        // TODO External input is not sanitized
        // TODO b64-encoded images are not checked to be actual images, only 
        // b64-encoded strings
        // TODO location is not checked to be a real existing one
        // TODO price is not checked to have a real existing currency

        // Checking title
        if (!(typeof title === "string" || title instanceof String)) {
            return res.status(400).json({
                success:false,
                message:"Provided 'title' field is not a string",
            });
        }

        // TODO types is actually an array, fix code
        // Checking 'types'
        if (!(Array.isArray(types))) {
            return res.status(400).json({
                success: false,
                message: "Provided 'types' field is not an array",
            });
        } else {
            for (let i=0; i<events.length; i++) {
                const eventType = events[i];
                console.log('TYPES: ' + JSON.stringify(types));
                if (!(typeof eventType === "object")) {
                    console.log('TYPE: ' + typeof eventType);
                    console.log('TYPE: ' + JSON.stringify(eventType));
                    return res.status(400).json({
                        success: false,
                        message: "Provided 'types' field contains element(s) that are not an object",
                    });
                } else {
                    // Checking required fields
                    if ((typeof eventType.name === "undefined") /* ||
                        (typeof eventType.defaultImage === "undefined") */) {
                            return res.status(400).json({
                                success: false,
                                message: "Submitted 'types' field contains elements that lack required fields",
                        });
                    }
            
                    if (!(typeof eventType.name === "string" || 
                        eventType.name instanceof String)) {
                        return res.status(400).json({
                            success:false,
                            message:"Provided 'types' field contains elements whose 'name' field is not a string",
                        });
                    }

                    // NO! The images are saved in the DB and the same for everyone
                    /* if (!(typeof eventType.defaultImage === "string" ||
                        eventType.defaultImage instanceof String ||
                        base64Regex.test(eventType.defaultImage))) {
                        return res.status(400).json({
                            success:false,
                            message:"Submitted 'types' fields contains elements whose 'defaultImage' is not a base64-encoded image",
                        });
                    } */

                    // Checking optional fields, if provided
                    /* if (typeof eventType.superType !== "undefined") {
                        if (!((typeof eventType.superType.name === "undefined") ||
                            (typeof eventType.superType.icon === "undefined"))) {
                            return res.status(400).json({
                                success:false,
                                message:"Provided 'types' field contains elements whose 'superType' object lacks required fields",
                            });
                        }

                        if (!(typeof eventType.superType.name === "string" ||
                            eventType.superType.name instanceof String)) {
                            return res.status(400).json({
                                success:false,
                                message:"Provided 'types' field contains elements whose 'superType' object contains a 'name' field which is not a string",
                            });
                        }

                        if (!(typeof eventType.superType.icon === "string" ||
                            eventType.superType.icon instanceof String ||
                            base64Regex.test(eventType.superType.icon))) {
                            return res.status(400).json({
                                success: false,
                                message: "Provided 'types' field contains elements whose 'superType' object contains a 'icon' field which is not a base64-encoded image",
                            });
                        }
                    } */

                    // REDO superType
                    if (typeof eventType.superType === "undefined") {
                            return res.status(400).json({
                                success: false,
                                message: "Submitted 'types' field contains elements that lack required fields",
                        });
                    }
            
                    if (!(typeof eventType.superType === "string" || 
                        eventType.name instanceof String)) {
                        return res.status(400).json({
                            success:false,
                            message:"Provided 'types' field contains elements whose 'name' field is not a string",
                        });
                    }
                }
            }
        }

        // Checking 'location'
        if (!(typeof location === "object")) {
            return res.status(400).json({
                success:false,
                message: "Provided 'location' field is not an object",
            });
        } else {
            // Checking required fields
            if ((typeof location.postalCode === "undefined") ||
                (typeof location.state === "undefined") ||
                (typeof location.city === "undefined") ||
                (typeof location.address === "undefined") ||
                (typeof location.houseNumber === "undefined")) {

                return res.status(400).json({
                    success:false,
                    message: "Provided 'location' object lacks required fields",
                });
            } else {
                if (!(typeof location.postalCode === "string" ||
                    location.postalCode instanceof String)) {

                    return res.status(400).json({
                        success:false,
                        message:"Provided 'location.postalCode' field is not a string",
                    });
                }
                if (!(typeof location.state === "string" ||
                    location.state instanceof String)) {

                    return res.status(400).json({
                        success:false,
                        message:"Provided 'location.state' field is not a string",
                    });
                }
                if (!(typeof location.city === "string" ||
                    location.city instanceof String)) {

                    return res.status(400).json({
                        success:false,
                        message:"Provided 'location.city' field is not a string",
                    });
                }               
                if (!(typeof location.address === "string" ||
                    location.address instanceof String)) {

                    return res.status(400).json({
                        success:false,
                        message:"Provided 'location.address' field is not a string",
                    });
                }

                if (isNaN(location.houseNumber)) {
                    return res.status(400).json({
                        success: false,
                        message: "Provided 'location.houseNumber' field is not a number",
                    });
                }
            }
        }

        // Checking date
        let dateObj;
        if (!(typeof date === "string" || date instanceof String ||
            iso8601Regex.test(date))) {

            return res.status(400).json({
                success: false,
                message: "Provided 'date' field is not a ISO8601-encoded date",
            });

        } else {
            dateObj = new Date(date);

            // Check if date is valid (not before now)
            if (dateObj < Date.now()) {
                return res.status(400).json({
                    success:false,
                    message: "Submitted 'date' is smaller than current one",
                });
            }
        }
        
        // Checking noUnderAge
        if (!(typeof noUnderage === "boolean")) {
            return res.status(400).json({
                success:false,
                message: "Provided 'noUnderage' field is not a boolean",
            });
        }

        // Checking hasQR
        if (!(typeof hasQR === "boolean")) {
            return res.status(400).json({
                success:false,
                message: "Provided 'hasQR' field is not a boolean",
            });
        }

        // Checking image
        if (!(typeof image === "string" || image instanceof String ||
            base64Regex.test(image))) {

            return res.status(400).json({
                success:false,
                message:"Provided 'image' is not a base64-encoded image",
            });
        }
        
        // Checking optional fields, if submitted

        // Checking price
        if (typeof price !== "undefined") {
            if (typeof price.amount === "undefined" ||
                typeof price.currency === "undefined") {
                return res.status(400).json({
                    success: false,
                    message: "Provided price object lack required fields",
                });
            } else {
                if (isNaN(price.amount)) {
                    return res.status(400).json({
                        success: false,
                        message: "Provided price.amount field is not a number",
                    });
                } else if (price.amount < 0) {
                    return res.status(400).json({
                        success:false,
                        message: "Provided price.amount field is negative",
                    });
                }
                if (!(typeof price.currency === "string" ||
                    price.currency instanceof String)) {
                    return res.status(400).json({
                        success: false,
                        message: "Provided price.currency field is not a string",
                    });
                }
            }
        }

        // Checking hastags
        if (typeof hashtags !== "undefined") {
            if (!isStringArray(hashtags)) {
                return res.status(400).json({
                    success: false,
                    message: "Provided 'hastags' field is not an array of strings (only)",
                });
            }
        }

        // Checking description
        if (typeof description !== "undefined") {
            if (!(typeof description === "string" ||
                description instanceof String)) {
                return res.status(400).json({
                    success: false,
                    message: "Provided 'description' field is not a string",
                });
            }
        }

        // Checking numOfSpots
        if (typeof numOfSpots !== "undefined") {
            if (isNaN(numOfSpots)) {
                return res.status(400).json({
                    success: false,
                    message: "Provided 'numOfSpots' field is not a number",
                });
            } else if (numOfSpots < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Provided 'numOfSpots' field is negative",
                });
            } else if (!(Number.isInteger(numOfSpots))) {
                return res.status(400).json({
                    success: false,
                    message: "Provided 'numOfSpots' field is not an integer",
                });
            }
        }

        const user = await Stakeholder.findOne({ username });

        // Check if there is another Event with the same key fields
        const oldEvent = await Event.findOne({ title, organiser: user });
        if (oldEvent !== null) {
            return res.status(400).json({
                success: false,
                message: "User has already published an Event with the same title",
            });
        }

        const eventCode = generateEventCode(title, username);

        let typesDocs = [];
        for (let i=0; i<types.length; i++) {
            const eventType = types[i];
            let eventTypeDoc = await EventType.findOne({ 
                name: eventType.name 
            });

            /* if (typeof eventTypeDoc === "undefined") {
                // Create new EventType
                eventTypeDoc = new EventType({
                    name: eventType.name,
                    defaultImage: eventType.defaultImage,
                });

                if (!(typeof eventType.superType === "undefined")) {
                    let superEventTypeDoc = await SuperEventType
                        .findOne({ name: eventType.superType.name });

                    if (typeof superEventTypeDoc === "undefined") {
                        // Create new SuperEventType
                        superEventTypeDoc = new SuperEventType({
                            name: eventType.superType.name,
                            icon: eventType.superType.icon,
                        });
                        await superEventTypeDoc.save();
                    }
                    eventTypeDoc.superType = superTypeDoc._id;
                }
                await eventTypeDoc.save();
            } */
            if (eventTypeDoc !== null) {
                typesDocs.add(eventTypeDoc._id);
            }
        }

        // Creating Event with required fields
        const newEvent = new Event({
            title,
            organiser: user._id,
            code: eventCode,
            types: typesDocs,
            location: {
                postalCode: location.postalCode,
                state: location.state,
                city: location.city,
                address: location.address,
                houseNumber: location.houseNumber
            },
            date: dateObj,
            noUnderage,
            hasQR,
            image,
        });

        // Set optional fields, if defined
        
        // This is optional in the model but should be actually instantiated 
        // to empty everytime an Event is created, and then filled everytime a 
        // subscription happens
        newEvent.tickets = [];

        if (typeof price !== "undefined") {
            newEvent.price = {
                amount: price.amount,
                currency: price.currency,
            };
        }
        /* else {
            newEvent.price = {
                amount: 0,
                currency: "",
            };
        } */

        if (typeof hashtags !== "undefined") {
            newEvent.hashtags = hashtags;
        }

        if (typeof description !== "undefined") {
            newEvent.description = description;
        }

        if (typeof numOfSpots !== "undefined") {
            newEvent.numOfSpots = numOfSpots;
        }

        // This is optional in the model but should be actually instantiated
        // to zero every time an Event is created, and then increased by one
        // each time a subscription happens
        newEvent.occupiedSpots = 0;

        // This is optional in the model but should be actually instantiated
        // to an empty array every time an Event is created, and then filled
        // every time a Rating is given
        newEvent.ratings = [];

        // This is optional in the model but should be actually instantiated
        // to an empty array every time an Event is created, and then filled
        // every time a Comment is written
        newEvent.comments = [];

        /*
        if (messagingGroup) {
            newEvent.messagingGroup = messagingGroup;
        }
        */

        await newEvent.save();

        // Populating the document with references to other documents before 
        // sending response. In case a field to be populated has not been 
        // instantiated (because optional), it will remain undefined or null
        await Event
            .findOne({ code: newEvent.code })
            .populate("organiser")
            .populate("tickets")
            .populate({
                path: "types",
                populate: { path: "superType" },
            })
            // .populate("messagingGroup")
            .exec();

        res.status(200).json({
            success: true,
            message: 'Event published successfully',
            event: newEvent,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    fillEvent
};