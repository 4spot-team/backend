require('dotenv').config();

// Sets some headers for handling CORS problems
function setGlobalHeaders(req, res, next) {

    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Couldn\'t set headers' });
    }
}

module.exports = {
    setGlobalHeaders
}