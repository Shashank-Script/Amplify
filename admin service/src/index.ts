import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import adminRoutes from "./route.js"
import cloudinary from "cloudinary"
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
})


const app = express();
app.use(express.json())
const port = process.env.PORT || 7000;

async function initDB() {
  try {
    await db`
            CREATE TABLE IF NOT EXISTS albums(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await db`
            CREATE TABLE IF NOT EXISTS songs(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                audio VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255),
                album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing database: ", error);
  }
}

app.use('/api/v1',adminRoutes)

initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
  });
});


