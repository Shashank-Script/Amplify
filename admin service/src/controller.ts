import type { Request } from "express";
import tryCatch from "./errorHandling.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { db } from "./config/db.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "You are not an admin" });
      return;
    }

    const { title, description } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: "Title and description are required" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({ message: "Failed to generate file buffer" });
      return;
    }

    const cloud = cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "albums",
    });

    const result = await db`
        INSERT INTO albums(title,description,thumbnail) VALUES (${title},${description},${
      (
        await cloud
      ).secure_url
    }) RETURNING *
    `;

    res.status(200).json({
      message: "Album added successfully",
      album: result[0],
    });
  }
);

export const addSong = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "You are not an admin" });
      return;
    }

    const { title, description, album } = req.body;

    const isAlbum = await db`SELECT * FROM albums WHERE id=${album}`;
    if (isAlbum.length === 0) {
      res.status(404).json({ message: "Album not found" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({ message: "Failed to generate file buffer" });
      return;
    }

    const cloud = cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "songs",
      resource_type: "video",
    });

    const result = await db`
        INSERT INTO songs(title,description,audio,album_id) VALUES (${title},${description},${
      (
        await cloud
      ).secure_url
    },${album})`;

    res.status(200).json({
      message: "Song added successfully",
    });
  }
);

export const addSongThumbnail = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "You are not an admin" });
      return;
    }

    const song = await db`SELECT * FROM songs WHERE id=${req.params.id}`;
    if (song.length === 0) {
      res.status(404).json({ message: "Song not found" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({ message: "Failed to generate file buffer" });
      return;
    }

    const cloud = cloudinary.v2.uploader.upload(fileBuffer.content);

    const result = await db`
        UPDATE songs SET thumbnail=${(await cloud).secure_url} WHERE id=${
      req.params.id
    } RETURNING *`;

    res.status(200).json({
      message: "Song thumbnail added successfully",
      song: result[0],
    });
  }
);

export const deleteAlbum = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "You are not an admin" });
      return;
    }

    const {id} = req.params

    const isAlbum = await db `SELECT * FROM albums WHERE id=${id}`;
    if (isAlbum.length === 0) {
      res.status(404).json({ message: "Album not found" });
      return;
    }

    await db `DELETE FROM songs WHERE album_id=${id}`

    await db `DELETE FROM albums WHERE id=${id}`

    res.status(200).json({
      message: "Album deleted successfully",
    });
  }
)

export const deleteSong = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "You are not an admin" });
      return;
    }

    const {id} = req.params

    const song = await db `SELECT * FROM songs WHERE id=${id}`
    if (song.length === 0) {
      res.status(404).json({ message: "Song not found" });
      return;
    }

    await db `DELETE FROM songs WHERE id=${id}`

    res.status(200).json({
      message: "Song deleted successfully",
    });
  }
)
