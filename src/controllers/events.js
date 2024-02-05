const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");
const { Comment } = require("../models/comment");
const { Rating } = require("../models/rating");
const { Ticket } = require("../models/ticket");

var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

// Generate a new ticket for an event, save it to db and return objectId
async function generateTicket(userId, eventId, checked, visibility) {
    const newTicket = new Ticket({
        user: userId,
        event: eventId,
        checked, 
        visibility,
    });

    await newTicket.save();

    return newTicket._id;
}

// GET '/api/${apiVersion}/events/:eventCode'
async function getEventPage(req, res) {
    try {
        const { eventCode } = req.params;

        if (!(typeof eventCode === "string" ||
            eventCode instanceof String)) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not a string",
            });
        }

        if (!(base64regex.test(eventCode))) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not recognized",
            });
        }

        const event = await Event.findOne({ code: eventCode });

        if (typeof event !== "undefined") {
            await Event
                .findOne({_id: event._id})
                .populate('organiser')
                .populate('tickets')
                .populate({
                    path: 'types',
                    populate: { path: 'superType' }
                })
                // .populate('messagingGroup')
                .exec();

            return res.status(200).json({
                success: true,
                message: 'Event retrieved successfully',

                event: event,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Event does not exist',
            });
        }

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST '/api/${apiVersion}/events/:eventCode'
async function postEventPage(req, res) {
    try {
        const { eventCode } = req.params;

        if (!(typeof eventCode === "string" ||
            eventCode instanceof String)) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not a string",
            });
        }

        if (!(base64regex.test(eventCode))) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not recognized",
            });
        }

        const event = await Event.findOne({ code: eventCode });

        if (typeof event !== "undefined") {
            // Provided by checkToken middleware
            const { username } = req;
            const user = await Stakeholder.findOne({ username });

            if (user._id == event.organiser) {
                
                const { numOfSpots, comment } = req.body;

                if (typeof numOfSpots !== "undefined") {
                    if (isNaN(numOfSpots)) {
                        return res.status(400).json({
                            success: false,
                            message: "Provided numOfSpots is not a number",
                        });
                    }

                    if (numOfSpots < 0) {

                        return res.status(400).json({
                            success:false,
                            message: "Provided numOfSpots is negative",
                        });

                    } else if (numOfSpots < event.occupiedSpots) {

                        return res.status(400).json({
                            success: false,
                            message: "Provided numOfSpots is lower than currently occupied Spots",
                        });

                    } else {
                        event.numOfSpots = numOfSpots;
                    }

                } else if (typeof comment !== "undefined") {
                    if (!(typeof comment === "string" || comment instanceof String)) {
                        return res.status(400).json({
                            success:false,
                            message: "Provided comment is not a string",
                        });
                    }
                    
                    // TODO external input not sanitized

                    event.comments.add({
                        user,
                        date: Date.now(),
                        text: comment,
                    });
                }


            } else {
                
                const { comment, rating, subscribe } = req.body;

                if (typeof comment !== "undefined") {
                    if (!(typeof comment === "string" || comment instanceof String)) {
                        return res.status(400).json({
                            success:false,
                            message: "Provided comment is not a string",
                        });
                    }

                    // TODO external input not sanitized

                    event.comments.add({
                        user,
                        date: Date.now(),
                        text: comment,
                    });

                } else if (typeof rating !== "undefined") {

                    if (isNaN(rating)) {
                        return res.status(400).json({
                            success: false,
                            message: "Provided rating is not a number",
                        });
                    }
                    if (rating < 0 || rating > 5) {
                        return res.status(400).json({
                            success:false,
                            message: "Rating is out of bounds",
                        });
                    }

                    event.ratings.add({
                        user,
                        rating,
                    });

                } else if (typeof subscribe !== "undefined") {
                    if (typeof subscribe !== "boolean") {
                        return res.status(400).json({
                            success: false,
                            message: "Provided 'subscribe' field is not a boolean",
                        });
                    } else {
                        if (subscribe) {
                            if (event.occupiedSpots < event.numOfSpots) {
                                const oldTicket = await Ticket.findOne({ user, event });
                                if (typeof oldTicket !== "undefined") {
                                    return res.status(400).json({
                                        success: false,
                                        message: "User is already subscribed for this event",
                                    });
                                } else {
                                    const ticketId = generateTicket(
                                        user._id,
                                        event._id,
                                        false,
                                        user.settings.ticketVisibility,
                                    );

                                    event.occupiedSpots += 1;

                                    event.tickets.add(ticketId);
                                    user.tickets.add(ticketId);
                                }
                                
                            } else {
                                return res.status(200).json({
                                    success: false,
                                    message: "No available spots left for this event",
                                });
                            }

                        } else {
                            const oldTicket = await Ticket.findOne({ user, event });
                            if (typeof oldTicket !== "undefined") {
                                const eventTicketIndex = event.tickets.indexOf(
                                    oldTicket._id
                                );
                                const userTicketIndex = user.tickets.indexOf(
                                    oldTicket._id
                                );

                                if (eventTicketIndex > -1 &&
                                    userTicketIndex > -1) {

                                    await Ticket.deleteOne({ user, event });
                                    event.occupiedSpots -= 1;
                                    event.tickets.splice(
                                        eventTicketIndex, 1
                                    );
                                    user.tickets.splice(
                                        userTicketIndex, 1
                                    );
                                } else {
                                    return res.status(500).json({
                                        // DB user and event info do not match tickets
                                        message: "Internal Server Error"
                                    });
                                }

                            } else {
                                return res.status(400).json({
                                    success: false,
                                    message: "User is not subscribed to this event",
                                });
                            }
                        }
                    }
                }
            }

            await event.save();
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Operation(s) completed successfully',
            });

        } else {
            return res.status(400).json({
                success: false,
                message: 'Event does not exist',
            });
        }

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getEventPage,
    postEventPage
};