import express from "express";
import logger from "morgan"
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors"
import swaggerUi from 'swagger-ui-express';

import indexRoute from "./modules/index.js"
import { CustomError, httpStatusCodes } from "./constants/constants.js";
import { errResponse } from "./helpers/response.js";
import connectMongo from "./databases/connectMongo.js"
import { corsOptions, limiter } from "./constants/config.js";
import swaggerDocument from './swagger_doc/swagger-output.json' assert {type: "json"}

const app = express();

app.use(cors(corsOptions))

app.use(limiter)    // Limit rate of request

app.use(helmet())   // secure server by setting HTTP response headers

app.use(cookieParser()) // Parse Cookie header and populate req.cookies

app.use(express.json()) // used to handle JSON payloads in HTTP requests

app.use(express.urlencoded({ extended: true })) // handling form data submitted from web pages

app.use(logger("dev"))  // Log REST APIs call in console

await connectMongo();

app.use("/api", indexRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Welcome to Express App")
})

app.use("*", (req, res, next) => {
    next(new CustomError(httpStatusCodes["Not Found"], "Not found"))
})

app.use(errResponse)

export default app;