import express from 'express'
import jwt from 'jsonwebtoken'


const router = express.Router()

router.get("/protected", async (req, res) => {
    try{
        const token =await req.cookies.token
        console.log(token)

        if(!token){
            return res.status(401).send({
                status: 0,
                message: "unauthorizedd",
                token: token
            })
        }
        const decoded = jwt.verify(req.cookies.token, process.env.MY_SECRET)
        return res.status(200).send({
            status: 1,
            message: "verified user"
        })
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