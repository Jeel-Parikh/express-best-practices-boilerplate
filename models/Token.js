import mongoose from "mongoose";

import config from "../constants/config.js";

const tokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
)

tokenSchema.index({ userId: 1, refreshToken: 1 })
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: config.DB_TOKEN_EXPIRES * 60 })

const Token = mongoose.model("token", tokenSchema)

export default Token