import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    // Retrieve token from cookies
    let token = req.cookies.token;

    // If token not found in cookies, optionally check the 'Authorization' header.
    if (!token && req.headers.authorization) {
        token = req.headers.authorization;
    }
    
    if (!token) {
        return res.status(401).json({
            message: "User not authenticated",
            success: false,
        });
    }

    // If token is prefixed with 'Bearer ', remove the prefix.
    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({
                message: "Server configuration error: SECRET_KEY is not set",
                success: false,
            });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, secretKey);
        req.id = decoded.id; // Debug logging
        // console.log(req.id);
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({
            message: "Invalid token",
            success: false,
            error: error.message,
        });
    }
};

export default isAuthenticated;
