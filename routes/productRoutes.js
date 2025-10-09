import express from 'express'
import { upload } from '../config/multer.js'
import { ObjectId } from 'mongodb'
import { client } from '../dbConfig.js'
const router = express.Router()

const db = client.db("bazarify")
const productsColl = db.collection("products")
const userColl = db.collection("user")

router.post('/product/:category/:userId', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]), async (req, res) => {
    try{
        let category = req.params.category
        let userId = new ObjectId(req.params.userId)
        let checkUser = await userColl.findOne({ _id: userId })
        if (checkUser) {
            if (!req.files.mainImage || !req.files.images || !req.body.title || !req.body.description || !req.body.price || !req.body.location) {
                return res.status(400).send({
                    status: 0,
                    message: "all fields are required"
                })
            }
            else {
                let products = {}
                console.log(category)
                if (category == "bike" || category == "car") {
                    if (!req.body.make) {
                        return res.status(400).send({
                            status: 0,
                            message: "all fields are required"
                        })
                    }
                    products = {
                        mainImage: req.files.mainImage,
                        images: req.files.images,
                        title: req.body.title,
                        description: req.body.description,
                        make: req.body.make,
                        price: req.body.price,
                        category: category,
                        location: req.body.location,
                        createdAt: Date.now(),
                        createdBy: userId
                    }
                }
                if (category == "mobile" || category == "tablet" || category == "electronics" || category == "furniture") {
                    if (!req.body.brand) {
                        return res.status(400).send({
                            status: 0,
                            message: "all fields are required"
                        })
                    }
                    products = {
                        mainImage: req.files.mainImage,
                        images: req.files.images,
                        title: req.body.title,
                        description: req.body.description,
                        brand: req.body.brand,
                        price: req.body.price,
                        category: category,
                        location: req.body.location,
                        createdAt: Date.now(),
                        createdBy: userId
                    }
                }
    
                if (category == "house") {
                    if (!req.body.bedrooms || !req.body.bathrooms || !req.body.areaUnit || !req.body.area) {
                        return res.status(400).send({
                            status: 0,
                            message: "all fields are required"
                        })
                    }
                    products = {
                        mainImage: req.files.mainImage,
                        images: req.files.images,
                        title: req.body.title,
                        description: req.body.description,
                        bedrooms: req.body.bedrooms,
                        bathrooms: req.body.bathrooms,
                        areaUnit: req.body.areaUnit,
                        area: req.body.area,
                        price: req.body.price,
                        category: category,
                        location: req.body.location,
                        createdAt: Date.now(),
                        createdBy: userId
                    }
                }
    
                if (category == "fashion") {
                    if (!req.body.brand || !req.body.fabric || !req.body.gender) {
                        return res.status(400).send({
                            status: 0,
                            message: "all fields are required"
                        })
                    }
                    products = {
                        mainImage: req.files.mainImage,
                        images: req.files.images,
                        title: req.body.title,
                        description: req.body.description,
                        brand: req.body.brand,
                        fabric: req.body.fabric,
                        price: req.body.price,
                        category: category,
                        gender: req.body.gender,
                        location: req.body.location,
                        createdAt: Date.now(),
                        createdBy: userId
                    }
                }
                else {
                    products = {
                        mainImage: req.files.mainImage,
                        images: req.files.images,
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        category: category,
                        location: req.body.location,
                        createdAt: Date.now(),
                        createdBy: userId
                    }
                }
    
                let insert = await productsColl.insertOne(products)
                if (insert) {
                    return res.status(200).send({
                        status: 1,
                        message: "inserted successfully"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "Something Went Wrong"
                    })
                }
            }
        }
        else {
            return res.send({
                status: 0,
                message: "something went wrong"
            })
        }
    }
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})


router.get('/product', async (req, res) => {
    try{
        // let userId = new ObjectId(req.params.userId)
        // let checkUser = await userColl.findOne({_id: userId})
        // if(checkUser){
        let findProducts = productsColl.find()
        let response = await findProducts.toArray()
        if (response.length > 0) {
            console.log(response)
            return res.send(response)
        }
        else {
            return res.send({
                status: 0,
                message: "Product Not Found"
            })
        }
        // }
        // else{
        //     return res.send({
        //         status: 0,
        //         message: "something went wrong"
        //     })
        // }
    }
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})


router.delete('/product/:productId/:userId', async (req, res) => {
    try{
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)
        let checkUser = await userColl.findOne({ _id: userId })
        let findProduct = await productsColl.findOne({ _id: productId })
        if (checkUser) {
            if (findProduct) {
                let deleteProduct = await productsColl.deleteOne(findProduct)
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
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})


router.put('/product/:productId/:userId', async (req, res) => {
    try{
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)
        let checkUser = await userColl.findOne({ _id: userId })
        let findProducts = await productsColl.findOne({ _id: productId })
    
        if (checkUser) {
            if (findProducts) {
                if (!req.body.title || !req.body.description || !req.body.price || !req.body.gender || !req.body.category || !req.body.location) {
                    return res.status(400).send({
                        status: 0,
                        message: "all fields are required"
                    })
                }
                else {
                    let products = {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        gender: req.body.gender,
                        category: req.body.category,
                        location: req.body.location
                    }
                    let updateProduct = await productsColl.updateOne(
                        { _id: productId },
                        { $set: products },
                        {}
                    )
                    if (updateProduct) {
                        return res.send({
                            status: 1,
                            message: "Product Updated Successfully"
                        })
                    }
                    else {
                        return res.send({
                            status: 0,
                            message: "Something Went Wrong"
                        })
                    }
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
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router