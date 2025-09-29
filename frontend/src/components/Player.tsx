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
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          <div className="lg:flex items-center gap-4">
            <img
              src={song.thumbnail ? song.thumbnail : "/download.jpeg"}
              className="w-12"
              alt=""
            />
            <div className="hidden md:block">
              <p>{song.title}</p>
              <p>{song.description?.slice(0, 30)}...</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 m-auto">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isPlaying} />
            )}

            {/* Song Progress Slider */}
            <div className="w-full flex items-center text-green-400">
              <Slider
                value={[(progress / duration) * 100 || 0]}
                onValueChange={durationChange}
                max={100}
                step={1}
                color="green"
                className="w-[120px] md:w-[300px]"
              />
            </div>

            {/* Player Controls */}
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer" onClick={prevSong}>
                <GrChapterPrevious />
              </span>

              <button
                className="bg-white text-black rounded-full p-2"
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="cursor-pointer" onClick={nextSong}>
                <GrChapterNext />
              </span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center">
            <Slider
              value={[volume * 100]}
              onValueChange={volumeChange}
              max={100}
              step={1}
              color="blue"
              className="w-16 md:w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
