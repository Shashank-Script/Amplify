import express from "express";
import { getUserProfile, loginUser, registerUser } from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);

router.post("/user/login", loginUser);

router.get("/user/profile", isAuth, getUserProfile);
export default router;
