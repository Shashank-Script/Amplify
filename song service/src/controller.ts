import { db } from "./config/db.js";
import tryCatch from "./errorHandling.js";
import { redisClient } from "./index.js";

export const getAllAlbums = tryCatch(async (req, res) => {
  let albums;
  const cache_expiry = 1800;

  if (redisClient.isReady) {
    albums = await redisClient.get("albums");
  }

  if (albums) {
    console.log("from redis");
    res.status(200).json({
      message: "Albums fetched successfully",
      albums: JSON.parse(albums),
    });
    return;
  } else {
    console.log("from db");
    albums = await db`SELECT * FROM albums`;

    if (redisClient.isReady) {
      await redisClient.set("albums", JSON.stringify(albums), {
        EX: cache_expiry,
      });
    }

    res.status(200).json({
      message: "Albums fetched successfully",
      albums,
    });
  }
});

export const getAllSongs = tryCatch(async (req, res) => {
  let songs;
  const cache_expiry = 1800;

  if (redisClient.isReady) {
    songs = await redisClient.get("songs");
  }

  if (songs) {
    console.log("from redis");
    res.status(200).json({
      message: "Songs fetched successfully",
      songs: JSON.parse(songs),
    });
    return;
  } else {
    console.log("from db");
    songs = await db`SELECT * FROM albums`;

    if (redisClient.isReady) {
      await redisClient.set("songs", JSON.stringify(songs), {
        EX: cache_expiry,
      });
    }

    res.status(200).json({
      message: "Songs fetched successfully",
      songs,
    });
  }
});

export const getAllSongsOfAlbum = tryCatch(async (req, res) => {
  const { id } = req.params;
  const cache_expiry = 1800;
  let album, songs;

  if(redisClient.isReady) {
    const cacheData = await redisClient.get(`album_songs_${id}`)
    if(cacheData){
      console.log("from redis")
      res.status(200).json(JSON.parse(cacheData))
      return
    }
  }

  album = await db`SELECT * FROM albums WHERE id=${id}`;
  if (album.length === 0) {
    res.status(404).json({ message: "Album not found" });
    return;
  }

  songs = await db`SELECT * FROM songs WHERE album_id=${id}`;
  const response = { album: album[0], songs };

  if(redisClient.isReady){
    await redisClient.set(`album_songs_${id}`, JSON.stringify(response),{
      EX: cache_expiry
    })
  }
  console.log("from db");

  res.status(200).json(response);
});

export const getSingleSong = tryCatch(async (req, res) => {
  const { id } = req.params;
  const song = await db`SELECT * FROM songs WHERE id=${id}`;

  res.status(200).json(song[0]);
});
