import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const server = "http://localhost:8000";

export interface Song {
  id: string;
  title: string;
  description: string;
  audio: string;
  thumbnail: string;
  album: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setSelectedSong: (id: string) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  song: Song | null;
  prevSong: () => void;
  nextSong: () => void;
}

interface AlbumResponse {
  message: string;
  albums: Album[];
}

interface SongResponse {
  message: string;
  songs: Song[];
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<SongResponse>(
        `${server}/api/v1/song/all`
      );
      const Songs = data.songs;
      setSongs(Songs);
      if (Songs.length > 0) {
        setSelectedSong(Songs[0].id.toString());
      }
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleSong = useCallback(async () => {
    try {
      if (!selectedSong) return;
      const { data } = await axios.get<Song>(
        `${server}/api/v1/song/${selectedSong}`
      );
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);

  const [index, setIndex] = useState<number>(0);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0].id.toString());
    } else {
      setIndex((prevIdx) => prevIdx + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prevIdx) => prevIdx - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

  const fetchAlbums = useCallback(async () => {
    try {
      const { data } = await axios.get<AlbumResponse>(
        `${server}/api/v1/album/all`
      );
      setAlbums(data.albums);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchSongs(), fetchAlbums();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        albums,
        song,
        fetchSingleSong,
        prevSong,
        nextSong,
        isPlaying,
        setIsPlaying,
        loading,
        selectedSong,
        setSelectedSong,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }
  return context;
};
