import { useSongData } from "@/context/SongContext";
import Layout from "../components/Layout";
import AlbumCard from "@/components/AlbumCard";

const Home = () => {
  const { albums } = useSongData();
  return (
    <Layout>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albums?.map((e, i) => {
            return (
              <AlbumCard
                key={i}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
