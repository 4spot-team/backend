// GET '/events/:eventname'
const getEventPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET event page"});
};

// POST '/events/:eventname'
const postEventPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST event page"});
};

module.exports = {
    getEventPage,
    postEventPage
};
