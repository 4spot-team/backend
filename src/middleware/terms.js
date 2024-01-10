const { Stakeholder } = require("../models/stakeholder");

async function checkTermsAcceptance(req, res, next) {
    try {
        const { username } = req;

        console.log('USERNAME:', username);

        const user = await Stakeholder.findOne({ username });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (!user.hasAcceptedTerms) {
            return res.status(403).json({ 
                success: false,
                message: "You must accept terms and conditions" 
            });
        }

        next();
    } catch(error) {
        console.error("Error checking acceptance:", error);
        res.status(500)
           .json({ message: "Internal server error" });
    }
}

module.exports = {
    checkTermsAcceptance,
};

