import express from 'express'
import { ObjectId } from 'mongodb'
import { client } from '../../dbConfig.js'
const router = express.Router()

const db = client.db("bazarify")
const userColl = db.collection("user")

router.put('/user/:userId/:adminId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let adminId = new ObjectId(req.params.adminId)
        let checkUser = await userColl.findOne({ _id: userId })
        let checkAdmin = await userColl.findOne({ _id: adminId })

        
        if (checkAdmin) {
            if(checkAdmin.isAdmin){
                if (checkUser) {
                    let updateUser =await userColl.updateOne(
                        {_id: userId},
                        {$set: {isBlocked: !checkUser.isBlocked}},
                        {}
                    )
    
                    if (updateUser) {
                        return res.send({
                            status: 1,
                            message: "user updated Successfully"
                        })
                    }
                    else {
                        return res.send({
                            status: 0,
                            message: "Something Went Wrong"
                        })
                    }
                }
                else {
                    return res.send({
                        status: 0,
                        message: "user Not Found"
                    })
                }
            }
            else{
                return res.status(400).send({
                    status: 0,
                    message: "only admin can update this user"
                })
            }
        }
        else {
            return res.send({
                status: 0,
                message: "something went wrong"
            })
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router