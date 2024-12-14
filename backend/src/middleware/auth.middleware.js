import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

 const protectRoute = async (req, res, next) => {
    try {

        // to grab the TOKEN from the cookies we are gonnna need the package "cookie-parser"

        const token = req.cookies.jwt;

        // first we will check if there's a token or not

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" })
        };

        // now we will extract userId from the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // now check if user exist in database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // now if user is authenticated:

        req.user = user;

        next(); // now we can call next() function which is : updateProfile

    } catch (error) {
        console.log('Error in protectRoute Middleware', error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export default protectRoute;