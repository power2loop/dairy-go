
const jwt = require('jsonwebtoken');

// Middleware to verify token and extract user details
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Access Denied: No Token Provided" });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { ...decoded, staff_id: decoded.staff_id }; // Attach user details to the request

        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;