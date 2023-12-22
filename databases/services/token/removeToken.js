import { CustomError, httpStatusCodes } from "../../../constants/constants.js";
import Token from "../../../models/Token.js";

const removeToken = async (conditions) => {
    try {

        const data = await Token.findOneAndRemove(conditions);

        if (!data) {
            throw new CustomError(httpStatusCodes["Bad Request"], "Invalid Data")
        }
        return data
    }
    catch (err) {
        console.log("======= Error removeToken", err.message)
        throw new CustomError(err.status || httpStatusCodes["Bad Request"], err.message)
    }
}

export default removeToken;