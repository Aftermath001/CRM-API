const express = require("express");
const { verifyRefreshJWT, crateAccessJWT } = require("../helper/jwt.helper");
const router = express.Router();
const { getUserByEmail } = require("../model/user/User.model");

// Get Refresh Tokens
router.get("/", async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Verify the refresh token
        const decoded = await verifyRefreshJWT(authorization);
        
        if (!decoded || !decoded.email) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Retrieve the user profile by email
        const userProf = await getUserByEmail(decoded.email);
        
        if (!userProf || !userProf._id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        let tokenExp = new Date(userProf.refreshJWT.addedAt);
        const dBrefreshToken = userProf.refreshJWT.token;

        tokenExp.setDate(
            tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
        );

        // Check if the token is expired or invalid
        const today = new Date();
        
        if (dBrefreshToken !== authorization || tokenExp < today) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Create a new access JWT
        const accessJWT = await crateAccessJWT(
            decoded.email,
            userProf._id.toString()
        );

        return res.json({ status: "success", accessJWT });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
