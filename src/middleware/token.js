require('dotenv').config();
require('dotenv').config();


const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const expiresIn = '1h';


function generateToken(username) {
    const payload = {
        sub: username,
        iat: Date.now(),
    };

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
}

function checkToken(req, res, next) {
    const token = req.headers.authorization || req.query.token;

    if(!token) {
        return res.status(401)
                  .json({ message: "Authentication token missing" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.username = decoded.sub;

        next();
    });
}

module.exports = {
    generateToken,
    checkToken,
};
