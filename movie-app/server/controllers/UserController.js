import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUser, selectUserByEmail, deleteUserByEmail } from "../models/User1.js";
import { ApiError } from "../helpers/ApiError1.js";
const {sign} = jwt

const postRegistration = async(req,res,next) => {
    try {
        if (!req.body.email || req.body.email.length === 0) {
            return next(new ApiError('Invalid email for user', 400))
        }
        if (!req.body.password || req.body.password.length < 8) {
            return next(new ApiError('Invalid password for user', 400))
        }

        const createdAt = new Date()
        const hashed_password = await hash(req.body.password, 10)

        const userFromDb = await insertUser(
            req.body.email, 
            hashed_password, 
            req.body.firstname, 
            req.body.lastname, 
            createdAt
        )

        const user = userFromDb.rows[0]
        return res.status(201).json(createUserObject(
            user.id,user.email, 
            user.firstName, 
            user.lastName, 
            user.createdAt
        ))
    } catch (error) {
        return next(error)
    }
}
const createUserObject = (id, email, firstname, lastname, createdAt, token=undefined) => {
    return {
        "id": id,
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "createdAt": createdAt,
        ...(token !== undefined) && {"token": token}
    }
}

const postLogin = async(req,res,next) => {
    const invalid_credentials_message = 'Invalid credentials'
    try {
        const userFromDb = await selectUserByEmail(req.body.email)
        if (userFromDb.rowCount === 0) {
            return next(new ApiError(invalid_credentials_message))
        }
        
        const user = userFromDb.rows[0]

        const isPasswordValid = await compare(req.body.password, user.password_hash);
        if (!isPasswordValid) {
            return next(new ApiError(invalid_credentials_message, 401));
        }
        // const token = sign(req.body.email, process.env.JWT_SECRET_KEY)
        const token = sign(req.body.email, process.env.TMDB_ACCESS_TOKEN)
        return res.status(200).json(createUserObject(user.id,user.email, user.firstname, user.lastname, user.createdAt, token))
    } catch (error) {
        return next(error)
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            return next(new ApiError("Unauthorized access", 401));
        }

        const userFromDb = await selectUserByEmail(userEmail);
        if (userFromDb.rowCount === 0) {
            return next(new ApiError("User not found", 404));
        }

        const deletedUser = await deleteUserByEmail(userEmail);
        if (deletedUser.rowCount === 0) {
            return next(new ApiError("User not found", 404));
        }

        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return next(error);
    }
};


export {postRegistration, postLogin, deleteAccount}