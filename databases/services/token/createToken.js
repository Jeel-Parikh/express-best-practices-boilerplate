import { CustomError, httpStatusCodes } from "../../../constants/constants.js"
import Token from "../../../models/Token.js"

const createToken = async (data) => {
    try {
        const { userId, token } = data
        await Token.updateOne({ userId }, { refreshToken: token }, { runValidators: true, upsert: true })
    }
    catch (err) {
        console.log("======= Error createToken", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}

export default createToken