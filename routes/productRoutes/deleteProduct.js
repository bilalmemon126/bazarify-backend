import express from 'express'
import { ObjectId } from 'mongodb'
import { client } from '../../dbConfig.js'
import cloudinary from '../../config/cloudinary.js'
const router = express.Router()

const db = client.db("bazarify")
const productsColl = db.collection("products")
const userColl = db.collection("user")

router.delete('/product/:productId/:userId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        console.log("productId ", productId)

        let userId = new ObjectId(req.params.userId)
        console.log("userId ", userId)

        let findProduct = await productsColl.findOne({ _id: productId })
        let checkUser = await userColl.findOne({ _id: userId })
        if (checkUser) {
            if (findProduct) {
                cloudinary.uploader.destroy(findProduct.mainImage.public_id)
                .then(result => {
                    return result
                })

                findProduct.images.map((v, i) => {
                    return cloudinary.uploader.destroy(v.public_id)
                    .then(result => {
                        return result
                    })
                })

                let deleteProduct = await productsColl.deleteOne({_id: productId})
                if (deleteProduct) {
                    return res.send({
                        status: 1,
                        message: "Product Deleted Successfully"
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
                    message: "Product Not Found"
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
            message: "Internal Server Errorrrr"
        })
    }
})

export default router