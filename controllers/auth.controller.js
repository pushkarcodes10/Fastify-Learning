import User from "../models/user.models.js"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { request } from "http"

exports.register(async (request, reply) => {
    try {
       const {name, email, password, country} = request.body;
       if(!name || !email || !password) {
            throw new Error("All fields are required")
       }
    } catch (err) {
        reply.send(err)
    }
})