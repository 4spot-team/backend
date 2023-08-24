// GET '/'
const getHomePage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "GET home page"});
};

// POST '/'
const postHomePage = (req, res, next) => {
    // TODO this is a placeholder
    res.json({"message": "POST home page"});
};


module.exports = {
    getHomePage, 
    postHomePage
};
