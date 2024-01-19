const { Stakeholder } = require("../models/stakeholder");


// POST /accept-terms
async function acceptTerms(req, res) {
    const { username } = req;

    try {
        const user = await Stakeholder.findOne({ username });

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found" 
            });
        }

        if (user.hasAcceptedTerms) {
            return res.status(400).json({ 
                success: false,
                message: "Acceptance already given" 
            });
        }

        user.hasAcceptedTerms = true;

        await user.save();

        res.status(200).json({ 
            success: true,
            message: "Acceptance given successfully" 
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Acceptance failed" 
        });
    }

}

module.exports = {
    acceptTerms,
};
