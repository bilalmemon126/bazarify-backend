import express from 'express'
import adminLoginRoute from './adminLogin.js'
import adminGetProductsRoute from './adminGetProducts.js'
import adminGetUsersRoute from './adminGetUsers.js'
import adminEditProductsRoute from './adminEditProducts.js'
import adminEditUsersRoute from './adminEditUsers.js'
import adminLogoutRoute from './adminLogout.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.use("/admin", adminLoginRoute)

router.use( async(req, res, next) => {
    try{
        const token =await req.cookies.token
        if(!token){
            return res.status(401).send({
                status: 0,
                message: "unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.MY_SECRET)
        return next()
    }
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errorr"
        })
    }
})

router.use("/admin", adminGetProductsRoute)
router.use("/admin", adminGetUsersRoute)
router.use("/admin", adminEditProductsRoute)
router.use("/admin", adminEditUsersRoute)
router.use("/admin", adminLogoutRoute)

export default router