import express from 'express'
import { client } from '../../dbConfig.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

const db = client.db("bazarify")
const userColl = db.collection("user")

router.post("/login", async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true
        })

        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                status: 0,
                message: "Both Fields are Required"
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

            else {
                let checkUser = await userColl.findOne({ email })
                if (!checkUser) {
                    return res.status(400).send({
                        status: 0,
                        message: "Email or Password is Invalid"
                    })
                }
                else {
                    if (!checkUser.isVerified) {
                        return res.status(400).send({
                            status: 0,
                            message: "User Not Verified"
                        })
                    }
                    else {
                        let hashedPassword = bcrypt.compareSync(req.body.password, checkUser.password);
                        if (!hashedPassword) {
                            return res.status(400).send({
                                status: 0,
                                message: "Email or Password is Invalid"
                            })
                        }
                        else {
                            const oldToken = await req.cookies.token
                            console.log(token)
                            if (oldToken) {
                                const decoded = jwt.verify(oldToken, process.env.MY_SECRET)
                                if (decoded) {
                                    res.clearCookie('token', {
                                        httpOnly: true,
                                        secure: true
                                    })
                                }
                            }

                            const token = jwt.sign({
                                firstName: req.body.firstName,
                                userId: checkUser._id,
                                email: checkUser.email
                            }, process.env.MY_SECRET, { expiresIn: "1h" })

                            res.cookie("token", token, {
                                httpOnly: true,
                                secure: true
                            })

                            const sendUserData =await userColl.findOne({_id: checkUser._id}, {projection: {_id: 1, firstName: 1}})
                            return res.status(200).send({
                                status: 1,
                                message: "Login Successfully",
                                data: sendUserData
                            })
                        }
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