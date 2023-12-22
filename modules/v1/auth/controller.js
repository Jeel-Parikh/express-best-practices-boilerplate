import { CustomError, httpStatusCodes, responseStatus } from "../../../constants/constants.js";
import { genAccessToken, genRefreshToken, verifyRefreshToken } from "../../../helpers/handleToken.js";
import { sendResponse } from "../../../helpers/response.js";
import { comparePassword } from "../../../helpers/encryptPassword.js";
import config from "../../../constants/config.js";
import fetchUser from "../../../databases/services/user/fetchUser.js";
import removeToken from "../../../databases/services/token/removeToken.js";

const login = async (req, res, next) => {
    try {
        res.clearCookie("refresh_token")
        res.clearCookie("access_token")
        const data = { ...req.body, ...req.validatedData }
        const { userEmail, userPassword } = data;
        const user = await fetchUser({ userEmail }, { userEmail: 1, userPassword: 1, userRole: 1 })

        if (!user || !(await comparePassword(userPassword, user.userPassword))) {
            throw new CustomError(httpStatusCodes["Bad Request"], "Invalid Data")
        }
        delete user.userPassword

        const accessToken = genAccessToken(user)
        const refreshToken = await genRefreshToken(user)
        res.cookie("access_token", accessToken, {
            expires: new Date(Date.now() + 60 * 1000 * config.ACCESS_TOKEN_COOKIE_EXPIRE_TIME),
            httpOnly: true
        })
        res.cookie("refresh_token", refreshToken, {
            expires: new Date(Date.now() + 60 * 1000 * config.REFRESH_TOKEN_COOKIE_EXPIRE_TIME),
            httpOnly: true
        })

        return sendResponse(res, httpStatusCodes.OK, responseStatus.SUCCESS, "login successfully", user)

    }
    catch (err) {
        console.log("=====login", err.message)
        return next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        let { refresh_token: refreshToken } = req.cookies
        if (!refreshToken) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid access")
        }

        res.clearCookie("refresh_token")
        res.clearCookie("access_token")

        let decodedData = await verifyRefreshToken(refreshToken, { isAuth: false })
        const user = await fetchUser({ _id: decodedData.data._id }, { userEmail: 1, userPassword: 1, userRole: 1 })
        if (!user) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid access")
        }

        const accessToken = genAccessToken(user)
        refreshToken = await genRefreshToken(user)
        res.cookie("access_token", accessToken, {
            expires: new Date(Date.now() + 60 * 1000 * config.ACCESS_TOKEN_COOKIE_EXPIRE_TIME),
            httpOnly: true
        })
        res.cookie("refresh_token", refreshToken, {
            expires: new Date(Date.now() + 60 * 1000 * config.REFRESH_TOKEN_COOKIE_EXPIRE_TIME),
            httpOnly: true
        })

        return sendResponse(res, httpStatusCodes.OK, responseStatus.SUCCESS, "Set refresh_token and access_token successfully")
    }
    catch (err) {
        console.log("=====refreshToken", err.message)
        return next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const { refresh_token: refreshToken } = req.cookies
        res.clearCookie("refresh_token")
        res.clearCookie("access_token")
        await removeToken({ refreshToken })
        return sendResponse(res, httpStatusCodes.OK, responseStatus.SUCCESS, "logout in successfully")
    }
    catch (err) {
        console.log("=====logout", err.message)
        return next(err)
    }
}

export default {
    login,
    refreshToken,
    logout
}