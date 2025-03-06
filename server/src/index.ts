import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import coursesRoutes from "./routes/courseRoutes";
import { clerkMiddleware, createClerkClient, requireAuth } from '@clerk/express'
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";

dotenv.config()

const isProduction = process.env.NODE_ENV === "production"

if (!isProduction) {
    dynamoose.aws.ddb.local()
}

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
})

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use("/courses", coursesRoutes)
app.use("/users/clerk", requireAuth(), userClerkRoutes)
app.use("/transactions", requireAuth(), transactionRoutes)




const port = process.env.PORT || 3000
if (!isProduction) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}