import express from "express";
import { addToPlaylist, getUserProfile, loginUser, registerUser } from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/profile", isAuth, getUserProfile);
router.post("/song/:id", isAuth, addToPlaylist);
export default router;
