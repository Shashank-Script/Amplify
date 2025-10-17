import express from "express"
import dotenv from "dotenv"
import connectDB from "./database.js"
import userRoutes from "./route.js"
import cors from "cors"

dotenv.config()
connectDB();
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 6000

app.get("/", (req, res) => {
    res.send("Server Running....")
})

app.use("/api/v1", userRoutes)


app.listen(3000, () => {
    console.log(`server is running on port: ${port}`)
})