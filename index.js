import express from 'express'
import { client } from './dbConfig.js'
import jwt from 'jsonwebtoken'
import registrationRoute from './routes/authRoutes/resgistration.js'
import otpverificationRoute from './routes/authRoutes/otpVerification.js'
import loginRoute from './routes/authRoutes/login.js'
import protectedRoute from './routes/authRoutes/protectedRoute.js'
import productRoutes from './routes/productRoutes.js'
import logoutRoute from './routes/authRoutes/logout.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

client.connect()
console.log("connected successfully with mongodb")

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const port = 3001

app.use(express.json());
app.use(cookieParser())

app.use(loginRoute)
app.use(registrationRoute)
app.use(otpverificationRoute)
app.use(protectedRoute)
app.use(logoutRoute)

app.use( async(req, res, next) => {
    try{
        const token =await req.cookies.token
        if(!token){
            return res.status(401).send({
                status: 0,
                message: "unauthorized"
            })
        }
        const decoded = jwt.verify(req.cookies.token, process.env.MY_SECRET)
        return next()
    }
    catch(error){
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

app.use(productRoutes)

app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`app is listening on Port ${port}`)
})