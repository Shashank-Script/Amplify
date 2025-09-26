import axios from "axios"
import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"


const server = "http://localhost:8000"

export interface Song {
    id:string,
    title:string,
    description:string,
    audio:string,
    thumbnail:string,
    album:string
}

export interface Album {
    id:string,
    title:string,
    description:string,
    thumbnail:string
}

interface SongContextType{
    songs:Song[],
    isPlaying:boolean,
    setIsPlaying: (value: boolean) => void,
    loading: boolean,
    selectedSong: string | null,
    setSelectedSong: (id: string) => void
    albums:Album[],
}

interface AlbumResponse{
    message:string,
    albums:Album[]
}

const SongContext = createContext<SongContextType | undefined>(undefined)

interface SongProviderProps {
    children: ReactNode
}

export const SongProvider: React.FC<SongProviderProps> = ({children}) => {
    const [songs, setSongs] = useState<Song[]>([])
    const [albums, setAlbums] = useState<Album[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedSong, setSelectedSong] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const fetchSongs = useCallback(async () => {
        setLoading(true)
        try {
            const {data} = await axios.get<Song[]>(`${server}/api/v1/song/all`)
            setSongs(data)
            if(data.length > 0){
                setSelectedSong(data[0].id.toString())
            }
            setIsPlaying(false)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    },[])

    const fetchAlbums = useCallback(async () => {
        try {
            const {data} = await axios.get<AlbumResponse>(`${server}/api/v1/album/all`)
            setAlbums(data.albums)
        } catch (error) {
            console.log(error)
        }
    },[])

    useEffect(() => {
        fetchSongs(),
        fetchAlbums()
    },[])

    return (
        <SongContext.Provider value={{songs,albums,
         isPlaying, setIsPlaying, loading, selectedSong, setSelectedSong}}>
            {children}
        </SongContext.Provider>
    )
}

export const useSongData = (): SongContextType => {
    const context = useContext(SongContext)
    if(!context){
        throw new Error("useSongData must be used within a SongProvider")
    }
    return context
}
