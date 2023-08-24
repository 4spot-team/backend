// GET '/login'
const getLoginPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET login page"});
};

// POST '/login'
const authenticate = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST login authentication"});
};


module.exports = {
    getLoginPage,
    authenticate
};
