// GET '/settings'
const getSettingsPage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET settings page"});
};

// POST '/settings'
const modifySettings = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST modify settings"});
};

module.exports = {
    getSettingsPage,
    modifySettings
};
