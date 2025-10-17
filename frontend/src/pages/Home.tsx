import { useSongData } from "@/context/SongContext";
import Layout from "../components/Layout";
import AlbumCard from "@/components/AlbumCard";
import SongCard from "@/components/SongCard";
import Loading from "@/components/Loading";
import { useSearch } from "@/context/SearchContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();
  const {searchQuery} = useSearch();

  const filteredAlbums = albums?.filter(album => album.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSongs = songs?.filter(song => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Trending Songs</h1>
            <div className="flex overflow-auto">
              {filteredSongs && filteredSongs.length > 0 ? (
                filteredSongs.map((e, i) => (
                  <SongCard
                    key={i}
                    image={e.thumbnail}
                    name={e.title}
                    desc={e.description}
                    id={e.id}
                  />
                ))
              ) : (
                <p className="text-gray-400">No songs found.</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Popular Albums</h1>
            <div className="flex overflow-auto">
              {filteredAlbums && filteredAlbums?.length > 0 ? (
                filteredAlbums?.map((e, i) => (
                  <AlbumCard
                    key={i}
                    image={e.thumbnail}
                    name={e.title}
                    desc={e.description}
                    id={e.id}
                  />
                ))
              ) : (
                <p className="text-slate-400">No albums found</p>
            )}
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;
