import { useSongData } from "@/context/SongContext";
import { useUserData } from "@/context/UserContext";
import React from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlaylist, isAuth } = useUserData();
  const { setSelectedSong, setIsPlaying } = useSongData();

  const saveToPlayListHanlder = () => {
    addToPlaylist(id);
  };

  return (
    <Card className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] bg-transparent border-none shadow-none">
      <CardHeader className="p-0">
        <div className="relative group">
          <img
            src={image}
            className="rounded-md w-[180px] h-[180px] object-cover mb-0"
            alt={name}
          />
          <div className="flex gap-2">
            <button
              className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => {
                setSelectedSong(id);
                setIsPlaying(true);
              }}
            >
              <FaPlay />
            </button>

            {isAuth && (
              <button
                className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={saveToPlayListHanlder}
              >
                <FaBookmark />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-0 leading-tight">
        <CardTitle className="font-bold text-white m-0 p-0">{name.slice(0, 20)}..</CardTitle>
        <CardDescription className="text-slate-200 text-sm m-0 p-0">
          {desc.slice(0, 20)}...
        </CardDescription>
      </CardContent>

      <CardFooter className="hidden" />
    </Card>
  );
};

export default SongCard;
