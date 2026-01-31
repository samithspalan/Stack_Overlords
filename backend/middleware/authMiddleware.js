import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('[AUTH] Checking token:', token ? '✅ Found' : '❌ Not found')
        if (!token) {
            console.log('[AUTH] ❌ No token in cookies')
            return res.status(401).json({ message: "User not authenticated" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[AUTH] ✅ Token verified, userId:', decoded.id)
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        req.userID = decoded.id;
        next();
    } catch (err) {
        console.log('[AUTH] ❌ Error:', err.message);
        return res.status(401).json({ message: "Authentication failed" });
    }
}

export default isAuthenticated;
