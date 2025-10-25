import express from 'express'
// import { upload } from '../config/multer.js'
// import { ObjectId } from 'mongodb'
// import { client } from '../dbConfig.js'
// import cloudinary from '../config/cloudinary.js'
import addProductRoute from './addProduct.js'
import getProductRoute from './getProduct.js'
import deleteProductRoute from './deleteProduct.js'
import editProductRoute from './editProduct.js'
const router = express.Router()

// const db = client.db("bazarify")
// const productsColl = db.collection("products")
// const userColl = db.collection("user")


router.use(addProductRoute)
// router.post('/product/:userId', upload.fields([
//     { name: 'mainImage', maxCount: 1 },
//     { name: 'images', maxCount: 8 }
// ]), async (req, res) => {
//     try {
//         let userId = new ObjectId(req.params.userId)
//         let checkUser = await userColl.findOne({ _id: userId })
//         if (checkUser) {
//             if (!req.files.mainImage || !req.files.images || !req.body.title || !req.body.description || !req.body.price || !req.body.category || !req.body.location) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: "all fields are required"
//                 })
//             }
//             else {
//                 let category = req.body.category
//                 let products = {}

//                 let mainImageResult = await cloudinary.uploader
//                     .upload(req.files.mainImage[0].path, {
//                         folder: "products"
//                     })
//                     .then(result => {
//                         return ({
//                             public_id: result.public_id,
//                             secure_url: result.secure_url
//                         })
//                     })

//                 let getImages = req.files.images
//                 let imagesUpload = getImages.map((v, i) => {
//                     return cloudinary.uploader
//                         .upload(v.path, {
//                             folder: "products"
//                         })
//                         .then(result => {
//                             return ({
//                                 public_id: result.public_id,
//                                 secure_url: result.secure_url
//                             })
//                         })

//                 })

//                 let result = await Promise.all(imagesUpload)
//                 let imagesResult = result

//                 if (category == "bike" || category == "car") {
//                     if (!req.body.make) {
//                         return res.status(400).send({
//                             status: 0,
//                             message: "all fields are required"
//                         })
//                     }

//                     products = {
//                         mainImage: mainImageResult,
//                         images: imagesResult,
//                         title: req.body.title,
//                         description: req.body.description,
//                         make: req.body.make,
//                         price: req.body.price,
//                         category: category,
//                         status: "active",
//                         isBlocked: false,
//                         location: req.body.location,
//                         createdAt: Date.now(),
//                         createdBy: userId
//                     }
//                 }
//                 if (category == "mobile" || category == "tablet" || category == "electronics" || category == "furniture") {
//                     if (!req.body.brand) {
//                         return res.status(400).send({
//                             status: 0,
//                             message: "all fields are required"
//                         })
//                     }
//                     products = {
//                         mainImage: mainImageResult,
//                         images: imagesResult,
//                         title: req.body.title,
//                         description: req.body.description,
//                         brand: req.body.brand,
//                         price: req.body.price,
//                         category: category,
//                         status: "active",
//                         isBlocked: false,
//                         location: req.body.location,
//                         createdAt: Date.now(),
//                         createdBy: userId
//                     }
//                 }

//                 if (category == "house") {
//                     if (!req.body.bedrooms || !req.body.bathrooms || !req.body.areaUnit || !req.body.area) {
//                         return res.status(400).send({
//                             status: 0,
//                             message: "all fields are required"
//                         })
//                     }
//                     products = {
//                         mainImage: mainImageResult,
//                         images: imagesResult,
//                         title: req.body.title,
//                         description: req.body.description,
//                         bedrooms: req.body.bedrooms,
//                         bathrooms: req.body.bathrooms,
//                         areaUnit: req.body.areaUnit,
//                         area: req.body.area,
//                         price: req.body.price,
//                         category: category,
//                         status: "active",
//                         isBlocked: false,
//                         location: req.body.location,
//                         createdAt: Date.now(),
//                         createdBy: userId
//                     }
//                 }

//                 if (category == "fashion") {
//                     if (!req.body.brand || !req.body.fabric || !req.body.gender) {
//                         return res.status(400).send({
//                             status: 0,
//                             message: "all fields are required"
//                         })
//                     }
//                     products = {
//                         mainImage: mainImageResult,
//                         images: imagesResult,
//                         title: req.body.title,
//                         description: req.body.description,
//                         brand: req.body.brand,
//                         fabric: req.body.fabric,
//                         price: req.body.price,
//                         category: category,
//                         status: "active",
//                         isBlocked: false,
//                         gender: req.body.gender,
//                         location: req.body.location,
//                         createdAt: Date.now(),
//                         createdBy: userId
//                     }
//                 }
//                 if (category != "bike" && category != "car" && category != "mobile" && category != "tablet" && category != "electronics" && category != "furniture" && category != "house" && category != "fashion") {
//                     products = {
//                         mainImage: mainImageResult,
//                         images: imagesResult,
//                         title: req.body.title,
//                         description: req.body.description,
//                         price: req.body.price,
//                         category: category,
//                         status: "active",
//                         isBlocked: false,
//                         location: req.body.location,
//                         createdAt: Date.now(),
//                         createdBy: userId
//                     }
//                 }

//                 let insert = await productsColl.insertOne(products)
//                 if (insert) {
//                     return res.status(200).send({
//                         status: 1,
//                         message: "inserted successfully"
//                     })
//                 }
//                 else {
//                     return res.send({
//                         status: 0,
//                         message: "Something Went Wrong"
//                     })
//                 }
//             }
//         }
//         else {
//             return res.send({
//                 status: 0,
//                 message: "something went wrong"
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).send({
//             status: 0,
//             error: error,
//             message: "Internal Server Error"
//         })
//     }
// })


router.use(getProductRoute)
// router.get('/product', async (req, res) => {
//     try {
//         let findProducts = productsColl.find()
//         let response = await findProducts.toArray()
//         if (response.length > 0) {
//             return res.send(response)
//         }
//         else {
//             return res.send({
//                 status: 0,
//                 message: "Product Not Found"
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).send({
//             status: 0,
//             error: error,
//             message: "Internal Server Error"
//         })
//     }
// })


router.use(deleteProductRoute)
// router.delete('/product/:productId/:userId', async (req, res) => {
//     try {
//         let productId = new ObjectId(req.params.productId)
//         console.log("productId ", productId)

//         let userId = new ObjectId(req.params.userId)
//         console.log("userId ", userId)

//         let findProduct = productsColl.findOne({ _id: productId })
//         let checkUser = userColl.findOne({ _id: userId })
//         if (checkUser) {
//             if (findProduct) {
//                 let deleteProduct = await productsColl.deleteOne(findProduct)
//                 if (deleteProduct) {
//                     return res.send({
//                         status: 1,
//                         message: "Product Deleted Successfully"
//                     })
//                 }
//                 else {
//                     return res.send({
//                         status: 0,
//                         message: "Something Went Wrong"
//                     })
//                 }
//             }
//             else {
//                 return res.send({
//                     status: 0,
//                     message: "Product Not Found"
//                 })
//             }
//         }
//         else {
//             return res.send({
//                 status: 0,
//                 message: "something went wrong"
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).send({
//             status: 0,
//             error: error,
//             message: "Internal Server Errorrrr"
//         })
//     }
// })


router.use(editProductRoute)
// router.put('/product/:productId/:userId', upload.fields([
//     { name: 'mainImage', maxCount: 1 },
//     { name: 'images', maxCount: 8 }
// ]), async (req, res) => {
//     try {
//         let productId = new ObjectId(req.params.productId)
//         let userId = new ObjectId(req.params.userId)
//         let checkUser = await userColl.findOne({ _id: userId })
//         let findProducts = await productsColl.findOne({ _id: productId })

//         let category = findProducts.category
//         if (checkUser) {
//             if (findProducts) {
//                 if (findProducts.createdBy.equals(userId)) {
//                     if (!req.files.mainImage && !req.body.mainImage || !req.files.images && !req.body.images || !req.body.title || !req.body.description || !req.body.price || !req.body.status || !req.body.location) {
//                         return res.status(400).send({
//                             status: 0,
//                             message: "all fields are required"
//                         })
//                     }
//                     else {
//                         let products = {}
//                         let mainImageResult = null;
//                         let imagesResult = null;

//                         if(req.body.mainImage){
//                             mainImageResult = JSON.parse(req.body.mainImage)
//                         }

//                         if(req.body.images){
//                             let imagesUpload = req.body.images

//                             imagesResult = imagesUpload.map((v, i) => {
//                                 return JSON.parse(v)
//                             })
//                         }

//                         if(req.files.mainImage){
//                             mainImageResult = await cloudinary.uploader
//                                 .upload(req.files.mainImage[0].path, {
//                                     folder: "products"
//                                 })
//                                 .then(result => {
//                                     return ({
//                                         public_id: result.public_id,
//                                         secure_url: result.secure_url
//                                     })
//                                 })
//                         }

//                         let getImages = req.files.images
//                         if(getImages){
//                             let imagesUpload = getImages.map((v, i) => {
//                                 return cloudinary.uploader
//                                     .upload(v.path, {
//                                         folder: "products"
//                                     })
//                                     .then(result => {
//                                         return ({
//                                             public_id: result.public_id,
//                                             secure_url: result.secure_url
//                                         })
//                                     })
    
//                             })
    
//                             let result = await Promise.all(imagesUpload)
//                             imagesResult = result
//                         }

//                         if (category == "bike" || category == "car") {
//                             if (!req.body.make) {
//                                 return res.status(400).send({
//                                     status: 0,
//                                     message: "all fields are required"
//                                 })
//                             }
//                             products = {
//                                 mainImage: mainImageResult,
//                                 images: imagesResult,
//                                 title: req.body.title,
//                                 description: req.body.description,
//                                 make: req.body.make,
//                                 price: req.body.price,
//                                 category: category,
//                                 status: req.body.status,
//                                 isBlocked: req.body.isBlocked || false,
//                                 location: req.body.location,
//                                 createdAt: Date.now(),
//                                 createdBy: userId
//                             }
//                         }
//                         if (category == "mobile" || category == "tablet" || category == "electronics" || category == "furniture") {
//                             if (!req.body.brand) {
//                                 return res.status(400).send({
//                                     status: 0,
//                                     message: "all fields are required"
//                                 })
//                             }
//                             products = {
//                                 mainImage: mainImageResult,
//                                 images: imagesResult,
//                                 title: req.body.title,
//                                 description: req.body.description,
//                                 brand: req.body.brand,
//                                 price: req.body.price,
//                                 category: category,
//                                 status: req.body.status,
//                                 isBlocked: req.body.isBlocked || false,
//                                 location: req.body.location,
//                                 createdAt: Date.now(),
//                                 createdBy: userId
//                             }
//                         }

//                         if (category == "house") {
//                             if (!req.body.bedrooms || !req.body.bathrooms || !req.body.areaUnit || !req.body.area) {
//                                 return res.status(400).send({
//                                     status: 0,
//                                     message: "all fields are required"
//                                 })
//                             }
//                             products = {
//                                 mainImage: mainImageResult,
//                                 images: imagesResult,
//                                 title: req.body.title,
//                                 description: req.body.description,
//                                 bedrooms: req.body.bedrooms,
//                                 bathrooms: req.body.bathrooms,
//                                 areaUnit: req.body.areaUnit,
//                                 area: req.body.area,
//                                 price: req.body.price,
//                                 category: category,
//                                 status: req.body.status,
//                                 isBlocked: req.body.isBlocked || false,
//                                 location: req.body.location,
//                                 createdAt: Date.now(),
//                                 createdBy: userId
//                             }
//                         }

//                         if (category == "fashion") {
//                             if (!req.body.brand || !req.body.fabric || !req.body.gender) {
//                                 return res.status(400).send({
//                                     status: 0,
//                                     message: "all fields are required"
//                                 })
//                             }
//                             products = {
//                                 mainImage: mainImageResult,
//                                 images: imagesResult,
//                                 title: req.body.title,
//                                 description: req.body.description,
//                                 brand: req.body.brand,
//                                 fabric: req.body.fabric,
//                                 price: req.body.price,
//                                 category: category,
//                                 status: req.body.status,
//                                 isBlocked: req.body.isBlocked || false,
//                                 gender: req.body.gender,
//                                 location: req.body.location,
//                                 createdAt: Date.now(),
//                                 createdBy: userId
//                             }
//                         }
//                         if (category != "bike" && category != "car" && category != "mobile" && category != "tablet" && category != "electronics" && category != "furniture" && category != "house" && category != "fashion") {
//                             products = {
//                                 mainImage: mainImageResult,
//                                 images: imagesResult,
//                                 title: req.body.title,
//                                 description: req.body.description,
//                                 price: req.body.price,
//                                 category: category,
//                                 status: req.body.status,
//                                 isBlocked: req.body.isBlocked || false,
//                                 location: req.body.location,
//                                 createdAt: Date.now(),
//                                 createdBy: userId
//                             }
//                         }
//                         let updateProduct = await productsColl.updateOne(
//                             { _id: productId },
//                             { $set: products },
//                             {}
//                         )
//                         if (updateProduct) {
//                             return res.send({
//                                 status: 1,
//                                 message: "Product Updated Successfully"
//                             })
//                         }
//                         else {
//                             return res.send({
//                                 status: 0,
//                                 message: "Something Went Wrong"
//                             })
//                         }
//                     }
//                 }
//                 else {
//                     return res.send({
//                         status: 0,
//                         message: "something went wrong"
//                     })
//                 }
//             }
//             else {
//                 return res.send({
//                     status: 0,
//                     message: "Product Not Found"
//                 })
//             }
//         }
//         else {
//             return res.send({
//                 status: 0,
//                 message: "something went wrong"
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).send({
//             status: 0,
//             error: error,
//             message: "Internal Server Error"
//         })
//     }
// })

export default router