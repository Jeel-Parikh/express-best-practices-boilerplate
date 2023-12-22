import express from "express"

import controller from "./controller.js";
import validator from "../../../middlewares/validator.js";
import authValidatorSchema from "./validatorSchema.js";

const route = express.Router()

route.post("/login",
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/definitions/login"
                    }  
                }
            }
        } 
    */
    validator(authValidatorSchema.loginSchema), controller.login);

route.post("/refresh_token", controller.refreshToken);

route.post("/logout", controller.logout);

export default route;