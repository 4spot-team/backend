// GET '/addevent'
const getAddEventPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"mesage": "GET event creation page"});
};

// POST '/addevent'
const fillEvent = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST fill Event Info"});
};

module.exports = {
    getAddEventPage,
    fillEvent
};
