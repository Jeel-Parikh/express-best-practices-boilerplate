import { CustomError, httpStatusCodes } from "../constants/constants.js";
import fetchUser from "../databases/services/user/fetchUser.js";
import { verifyAccessToken, verifyRefreshToken } from "../helpers/handleToken.js";


const authMiddleware = async (req, res, next) => {
    try {
        // Only One User At time can login using current configuration

        // TODO CREATE SEPARATE MIDDLEWARE FOR AUTHORIZATION
        const { access_token: accessToken, refresh_token: refreshToken } = req.cookies
        if (!accessToken || !refreshToken) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid access")
        }
        const decodedData = verifyAccessToken(accessToken)
        const user = await fetchUser({ userEmail: decodedData.data.userEmail }, { userName: 1, userEmail: 1, userRole: 1, })
        if (!user) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid access")
        }
        await verifyRefreshToken(refreshToken, { user })
        req.user = user;
        return next()
    }
    catch (err) {
        console.log("======= Error AuthMiddleware", err.message)
        return next(err)
    }
}

export default authMiddleware;