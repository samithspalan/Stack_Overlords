import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        req.userID = decoded.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Authentication failed" });
    }
}

export default isAuthenticated;
