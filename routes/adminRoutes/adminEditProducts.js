import express from 'express'
import { ObjectId } from 'mongodb'
import { client } from '../../dbConfig.js'
const router = express.Router()

const db = client.db("bazarify")
const productsColl = db.collection("products")
const userColl = db.collection("user")

router.put('/product/:productId/:adminId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let adminId = new ObjectId(req.params.adminId)
        let checkUser = await userColl.findOne({ _id: adminId })
        let findProducts = await productsColl.findOne({ _id: productId })

        
        if (checkUser) {
            if(checkUser.isAdmin){
                if (findProducts) {
                    let updateProduct =await productsColl.updateOne(
                        {_id: productId},
                        {$set: {isBlocked: !findProducts.isBlocked}},
                        {}
                    )
    
                    if (updateProduct) {
                        return res.send({
                            status: 1,
                            message: "Product updated Successfully"
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
            else{
                return res.status(400).send({
                    status: 0,
                    message: "only admin can update this product"
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