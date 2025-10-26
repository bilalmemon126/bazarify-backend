import express from 'express'
import { client } from '../../dbConfig.js'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const router = express.Router()
const db = client.db("bazarify")
const userColl = db.collection("user")

router.post("/user-otpverification/:id", async (req, res) => {
    let userId = new ObjectId(req.params.id)
    let findUser = await userColl.findOne({ _id: userId })
    if (!findUser) {
        return res.status(400).send({
            status: 0,
            message: "something went wrong"
        })
    }
    else {
        if (!req.body.otp) {
            return res.status(401).send({
                status: 0,
                message: "please enter your otp"
            })
        }
        else {
            if (req.body.otp == findUser.otp) {
                if (Date.now() > findUser.expiry) {
                    let deletedUser = await userColl.deleteOne({ _id: userId })
                    if (deletedUser) {
                        return res.status(401).send({
                            status: 0,
                            message: "your otp has expired"
                        })
                    }
                }
                else {
                    let updateVerifiedUser = await userColl.updateOne(
                        { _id: userId },
                        { $set: { otp: true, expiry: "", isVerified: true } },
                        {}
                    )
                    if (!updateVerifiedUser) {
                        return res.status(400).send({
                            status: 0,
                            message: "something went wrong"
                        })
                    }
                    else {
                        const token = jwt.sign({
                            userId: findUser._id,
                            firstName: findUser.firstName,
                            email: findUser.email
                        }, process.env.MY_SECRET, { expiresIn: "1h" })

                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        })
                        const sendUserData = await userColl.findOne({ _id: userId }, { projection: { _id: 1, firstName: 1 } })
                        return res.status(200).send({
                            status: 1,
                            message: "now you can login",
                            data: sendUserData
                        })
                    }
                }
            }
            else {
                return res.status(401).send({
                    status: 0,
                    message: "invalid otp"
                })
            }
        }

    }
})

export default router