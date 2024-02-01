const { Event } = require("../models/event");
const { Stakeholder } = require("../models/stakeholder");
const { Comment } = require("../models/comment");
const { Rating } = require("../models/rating");
const { Ticket } = require("../models/ticket");

var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;


// GET '/api/${apiVersion}/events/:eventCode'
async function getEventPage(req, res) {
    try {
        const { eventCode } = req.params;

        if !(base64regex.test(eventCode)) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not recognized",
            });
        }

        const event = await Event.findOne({ code: eventCode });

        if (event) {
            return res.status(200).json({
                success: true,
                message: 'Event retrieved successfully",
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

        if !(base64regex.test(eventCode)) {
            return res.status(400).json({
                success: false,
                message: "'eventCode' in request params is not recognized",
            });
        }

        const event = await Event.findOne({ code: eventCode });

        if (event) {
            // Provided by checkToken middleware
            const { username } = req;
            const user = await Stakeholder.findOne({ username });

            if (user == event.organiser) {
                
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
                    if !(typeof comment === "string" || comment instanceof String) {
                        return res.status(400).json({
                            success:false,
                            message: "Provided comment is not a string",
                        });
                    }
                    
                    // TODO external input not sanitized

                    const newComment = new Comment({
                        user,
                        date: Date.now(),
                        text: comment,
                    });
                    
                    await newComment.save();

                    event.comments.add(newComment);
                }


            } else {
                
                const { comment, rating, subscribe } = req.body;

                if (typeof comment !== "undefined") {
                    if !(typeof comment === "string" || comment instanceof String) {
                        return res.status(400).json({
                            success:false,
                            message: "Provided comment is not a string",
                        });
                    }

                    // TODO external input not sanitized

                    const newComment = new Comment({
                        user,
                        date: Date.now(),
                        text: comment,
                    });
                    
                    await newComment.save();

                    event.comments.add(newComment);

                } else if (typeof rating !== "undefined") {

                    if (isNaN(rating) {
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
                    const newRating = new Rating({
                        user,
                        rating,
                    });

                    await newRating.save();

                    event.ratings.add(newRating);
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
                                if (oldTicket) {
                                    return res.status(400).json({
                                        success: false,
                                        message: "User is already subscribed for this event",
                                    });
                                } else {
                                    const newTicket = new Ticket({
                                        user,
                                        event,
                                        checked: false,
                                        visibility: user.settings.ticketVisibility,
                                    });

                                    await newTicket.save();

                                    event.occupiedSpots += 1;
                                    event.tickets.add(newTicket);
                                    user.tickets.add(newTicket);
                                }
                                
                            } else {
                                return res.status(200).json({
                                    success: false,
                                    message: "No available spots left for this event",
                                });
                            }

                        } else {
                            const oldTicket = await Ticket.findOne({ user, event });
                            if (oldTicket) {
                                await Ticket.deleteOne({ user, event });

                                event.occupiedSpots -= 1;
                                event.tickets.remove(oldTicket);
                                user.tickets.remove(oldTicket);
                            } else {
                                return res.status(400).json({
                                    success: false,
                                    message: "User is not subscribed to this event",
                                });
                            }
                        }
                    }
            }

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
