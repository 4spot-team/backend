// GET '/:username'
const getUserPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET User Page"});
};

// POST '/:username'
const postUserPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST User Page"});
};

module.exports = {
    getUserPage,
    postUserPage
};
