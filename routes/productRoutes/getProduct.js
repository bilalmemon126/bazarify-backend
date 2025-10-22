import express from 'express'
import { client } from '../../dbConfig.js'
const router = express.Router()

const db = client.db("bazarify")
const productsColl = db.collection("products")


router.get('/product', async (req, res) => {
    try {
        let findProducts = productsColl.find()
        let response = await findProducts.toArray()
        if (response.length > 0) {
            return res.send(response)
        }
        else {
            return res.send({
                status: 0,
                message: "Product Not Found"
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