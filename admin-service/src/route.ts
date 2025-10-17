import express from "express";
import uploadFile, { isAuth } from "./middleware.js";
import { addAlbum, addSong, addSongThumbnail, deleteAlbum, deleteSong, updateAlbum, updateSong } from "./controller.js";

const router = express.Router();

router.post('/album/new', isAuth, uploadFile, addAlbum)
router.post('/song/new', isAuth, uploadFile, addSong)
router.post('/song/:id', isAuth, uploadFile, addSongThumbnail)
router.put('/update-album/:id', isAuth,uploadFile,updateAlbum)
router.put('/update-song/:id',isAuth,uploadFile,updateSong)
router.delete('/album/:id',isAuth, deleteAlbum)
router.delete('/song/:id',isAuth, deleteSong)

export default router