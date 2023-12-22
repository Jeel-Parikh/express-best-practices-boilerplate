import dotenv from "dotenv"
import { rateLimit } from "express-rate-limit"

dotenv.config()

// ===============  Environment variables   ===============

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SALT_ROUND: process.env.SALT_ROUND,
    RATE_LIMIT_TIME: process.env.RATE_LIMIT_TIME,    // In Minutes
    RATE_LIMIT_REQUEST: process.env.RATE_LIMIT_REQUEST,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    ACCESS_TOKEN_COOKIE_EXPIRE_TIME: process.env.ACCESS_TOKEN_COOKIE_EXPIRE_TIME,   //  In Minutes
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
    REFRESH_TOKEN_COOKIE_EXPIRE_TIME: process.env.REFRESH_TOKEN_COOKIE_EXPIRE_TIME,  //  In Minutes
    DB_TOKEN_EXPIRES: process.env.DB_TOKEN_EXPIRES  //  In Minutes
}

// ===============  CORS options   ===============

export const corsOptions = {
    origin: "*",
}

// ===============  rate-limiter config   ===============

export const limiter = rateLimit({
    windowMs: 60 * 1000 * config.RATE_LIMIT_TIME,
    max: config.RATE_LIMIT_REQUEST,
})


export default config