import jwt from "jsonwebtoken";

import { CustomError, httpStatusCodes } from "../constants/constants.js";
import config from "../constants/config.js";
import createToken from "../databases/services/token/createToken.js";
import fetchToken from "../databases/services/token/fetchToken.js";
import removeToken from "../databases/services/token/removeToken.js";

const genJWT = (data, tokenSecret, tokenExpire) => {
    try {
        const token = jwt.sign({ data }, tokenSecret, { expiresIn: tokenExpire });
        return token;
    }
    catch (err) {
        console.log("=====Gen JWT", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}

const verifyJWT = (token, tokenSecret) => {
    try {
        const decodedData = jwt.verify(token, tokenSecret);
        return decodedData
    } catch (err) {
        console.log("=====Verify JWT", err.message)
        throw new CustomError(err.status || httpStatusCodes.Unauthorized, err.message)
    }
}

export const genAccessToken = (user) => {
    try {
        const token = genJWT(user, config.ACCESS_TOKEN_SECRET, config.ACCESS_TOKEN_EXPIRES);
        return token;
    }
    catch (err) {
        console.log("=====Gen AccessToken", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}


export const genRefreshToken = async (user) => {
    try {
        const token = genJWT(user, config.REFRESH_TOKEN_SECRET, config.REFRESH_TOKEN_EXPIRES);
        await createToken({ userId: user._id, token })
        return token;
    }
    catch (err) {
        console.log("=====Gen RefreshToken", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}

export const verifyAccessToken = (token) => {
    try {
        const decodedData = verifyJWT(token, config.ACCESS_TOKEN_SECRET);
        return decodedData
    } catch (err) {
        console.log("=====Verify AccessToken", err.message)
        throw new CustomError(err.status || httpStatusCodes.Unauthorized, err.message)
    }
}

export const verifyRefreshToken = async (token, optional = {}) => {
    try {
        const { user = {}, isAuth = true } = optional
        const decodedData = verifyJWT(token, config.REFRESH_TOKEN_SECRET);
        if (isAuth && decodedData.data._id != user._id) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid Tokens")
        }
        const { refreshToken } = await fetchToken({ userId: decodedData.data._id }, { refreshToken: 1 })
        if (refreshToken != token) {
            await removeToken({ userId: user._id })
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid Tokens")
        }
        return decodedData
    } catch (err) {
        console.log("=====Verify RefreshToken", err.message)
        throw new CustomError(err.status || httpStatusCodes.Unauthorized, err.message)
    }
}

