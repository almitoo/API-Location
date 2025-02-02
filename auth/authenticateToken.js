const jwt = require("jsonwebtoken");
const JWT_SECRET = "my-secret-key";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

const getJwtSecret = () => {
    return JWT_SECRET;
}

module.exports = {
    authenticateToken,
    getJwtSecret
};
