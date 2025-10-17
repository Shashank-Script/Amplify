import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors"

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: "redis-13565.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 13565,
  },
});

redisClient
  .connect()
  .then(() => console.log("redis connected"))
  .catch((err) => console.log("redis connection error", err));

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json());

app.get("/",(req,res) => {
    res.send("Server Running...")
})

app.use("/api/v1", songRoutes);

app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
