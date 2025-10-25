import express from 'express'
import { client } from '../../dbConfig.js'
import bcrypt from 'bcrypt'
import { sendOtp } from '../../config/sendOtp.js'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const router = express.Router()
const db = client.db("bazarify")
const userColl = db.collection("user")

router.post("/register", async (req, res) => {
    try {
        const token =await req.cookies.token
        if(token){
            const decoded = jwt.verify(token, process.env.MY_SECRET)
            if(decoded){
                res.clearCookie('token',{
                    httpOnly: true,
                    secure: true
                })
            }
        }

        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.phone) {
            return res.status(400).send({
                status: 0,
                message: "all fields are required"
            })
        }
        else {
            let email = req.body.email.toLowerCase()
            const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!email.match(emailFormat)) {
                return res.status(400).send({
                    status: 0,
                    message: "invalid email format"
                })
            }
            else{
                const checkUser = await userColl.findOne({ email: email })
                if (checkUser) {
                    return res.status(409).send({
                        status: 0,
                        message: "email already exist"
                    })
                }
                else {
                    const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
                    let verificationOTP = Math.floor(100000 + Math.random() * 900000)
                    const expiryOTP = Date.now() + 2 * 60 * 1000;
                    const user = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: email,
                        password: hashedPassword,
                        phone: req.body.phone,
                        otp: verificationOTP,
                        expiry: expiryOTP,
                        isVerified: false,
                        isAdmin: false,
                        isBlocked: false
                    }

                    const insertUser = await userColl.insertOne(user)
                    if (insertUser.insertedId) {
                        const findUser = await userColl.findOne({ _id: new ObjectId(insertUser.insertedId) }, {projection: {_id: 1, firstName: 1}})
                        sendOtp(`${email}`, `${verificationOTP}`);
                        return res.status(200).send({
                            status: 1,
                            message: "registered successfully",
                            data: findUser
                        })
                    }
                    else {
                        return res.status(400).send({
                            status: 0,
                            message: "something went wrong"
                        })
                    }
                }
            }
        }
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router