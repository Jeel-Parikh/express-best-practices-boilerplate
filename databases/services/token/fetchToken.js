import { CustomError, httpStatusCodes } from "../../../constants/constants.js";
import Token from "../../../models/Token.js";

const fetchToken = async (conditions, project = {}) => {
    try {
        const data = await Token.findOne(conditions, project).lean();
        if (!data) {
            throw new CustomError(httpStatusCodes.Unauthorized, "Invalid Tokens")
        }
        return data
    }
    catch (err) {
        console.log("======= Error fetchToken", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}

export default fetchToken