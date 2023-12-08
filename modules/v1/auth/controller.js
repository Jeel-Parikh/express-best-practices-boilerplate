import { CustomError, httpStatusCodes, responseStatus } from "../../../constants/constants.js";
import { genToken } from "../../../helpers/handleToken.js";
import { sendResponse } from "../../../helpers/response.js";
import { comparePassword } from "../../../helpers/encryptPassword.js";
import config from "../../../constants/config.js";
import fetchUser from "../../../databases/services/user/fetchUser.js";

const login = async (req, res, next) => {
    try {
        res.clearCookie("token");
        const data = { ...req.body, ...req.validatedData }
        const { userEmail, userPassword } = data;
        const user = await fetchUser({ userEmail }, { userEmail: 1, userPassword: 1, userRole: 1 })

        if (!user || !(await comparePassword(userPassword, user.userPassword))) {
            throw new CustomError(httpStatusCodes["Bad Request"], "Invalid Data")
        }
        delete user.userPassword

        const token = genToken(user)

        res.cookie("token", token, {
            expires: new Date(Date.now() + 60 * 1000 * config.COOKIE_EXPIRE_TIME),
            httpOnly: true
        })
        return sendResponse(res, httpStatusCodes.OK, responseStatus.SUCCESS, "login successfully", user)

    }
    catch (err) {
        console.log("=====login", err.message)
        return next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie("token")
        return sendResponse(res, httpStatusCodes.OK, responseStatus.SUCCESS, "logout in successfully")
    }
    catch (err) {
        console.log("=====logout", err.message)
        return next(err)
    }
}

export default {
    login,
    logout
}