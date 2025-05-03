const jwt = require('jsonwebtoken');
const secret_key = process.env.jwt_secret;

function verifyToken(req, res, next) {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, secret_key);

        // Optional: Check if token is expired
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        }

        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}

module.exports = verifyToken;
