import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/ApiError1.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new ApiError("Authorization header is missing", 401));
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.TMDB_ACCESS_TOKEN); 
        req.user = { email: decoded }; 
        next();
    } catch (error) {
        return next(new ApiError("Invalid token", 403));
    }
};
