import express from 'express'
import { client } from '../../dbConfig.js'
const router = express.Router()

const db = client.db("bazarify")
const userColl = db.collection("user")


router.get('/user', async (req, res) => {
    try {
        let findUsers = userColl.find({},{projection: {password: 0}})
        let response = await findUsers.toArray()
        let filteredUsers = response.filter((v, i) => !v.isAdmin)
        if (filteredUsers.length > 0) {
            return res.status(200).send(filteredUsers)
        }
        else {
            return res.send({
                status: 0,
                message: "users net found"
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