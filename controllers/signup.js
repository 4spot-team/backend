// GET '/signup'
const getRegistrationPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET registration page"});
};

// POST '/signup'
const register = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST register"});
};

module.exports = {
    getRegistrationPage,
    register
};
