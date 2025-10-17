import { useSongData } from "@/context/SongContext";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { Slider } from "@/components/ui/slider";
const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const volumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const durationChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);

  return (
    <div>
      {song && (
        <div className="h-[60px] bg-black flex justify-between items-center text-white px-4 border-t border-gray-800 fixed bottom-0 left-0 w-full z-40">
          {/* Left Section: Song Info */}
          <div className="flex items-center gap-3 w-[25%]">
            <img
              src={song.thumbnail ? song.thumbnail : "/download.jpeg"}
              alt=""
              className="w-14 h-14 object-cover rounded-md"
            />
            <div className="hidden md:block overflow-hidden">
              <p className="text-sm font-semibold truncate w-[150px]">
                {song.title}
              </p>
              <p className="text-xs text-gray-400 truncate w-[150px]">
                {song.description?.slice(0, 30)}...
              </p>
            </div>
          </div>

          {/* Center Section: Controls */}
          <div className="flex flex-col items-center justify-center w-[50%]">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isPlaying} />
            )}

            {/* Progress Slider */}
            <Slider
              value={[(progress / duration) * 100 || 0]}
              onValueChange={durationChange}
              max={100}
              step={1}
              className="w-[60%] mb-1"
            />

            {/* Controls */}
            <div className="flex justify-center items-center gap-5">
              <button
                className="text-gray-300 hover:text-white cursor-pointer transition"
                onClick={prevSong}
              >
                <GrChapterPrevious size={20} />
              </button>

              <button
                className="bg-white text-black rounded-full p-2 hover:scale-110 cursor-pointer transition"
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button
                className="text-gray-300 hover:text-white cursor-pointer transition"
                onClick={nextSong}
              >
                <GrChapterNext size={20} />
              </button>
            </div>
          </div>

          {/* Right Section: Volume */}
          <div className="w-[25%] flex justify-end items-center">
            <Slider
              value={[volume * 100]}
              onValueChange={volumeChange}
              max={100}
              step={1}
              className="w-20 md:w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
