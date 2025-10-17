import { MdDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSongData } from "@/context/SongContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  
  const admin = import.meta.env.VITE_ADMIN_SERVICE_URL;

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addSongThumbnailHandler = async (id: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${admin}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${admin}/api/v1/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        fetchAlbums();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${admin}/api/v1/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Albums</h3>
        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {albums?.map((e, i) => {
            return (
              <Card
                key={i}
                className="bg-[#181818] hover:bg-[#151414] transition duration-200 border-none text-white w-56"
              >
                <CardHeader>
                  <img
                    src={e.thumbnail}
                    className="rounded-md w-[160px] h-[160px] object-cover"
                    alt=""
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-bold">
                    {e.title.slice(0, 30)}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    {e.description.slice(0, 20)}..
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <button
                    disabled={btnLoading}
                    className="px-3 py-1 cursor-pointer bg-red-500 text-white rounded"
                    onClick={() => deleteAlbum(e.id)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    disabled={btnLoading}
                    className="px-3 py-1 bg-blue-500 cursor-pointer text-white rounded"
                    onClick={() =>
                      navigate("/admin/add", {
                        state: { editMode: "album", data: e }, // pass the album data here
                      })
                    }
                  >
                    <FiEdit3 />
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>
        <div className="flex justify-center md:justify-start gap-3 items-center flex-wrap">
          {songs?.map((e, i) => (
            <Card
              key={i}
              className="bg-[#181818] border-none text-white w-56 hover:bg-[#151414] transition duration-200"
            >
              <CardHeader className="flex justify-center items-center">
                {e.thumbnail ? (
                  <img
                    src={e.thumbnail}
                    alt="thumbnail"
                    className="rounded-md w-[160px] h-[160px] object-cover"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 w-[160px] h-[160px]">
                    <input
                      type="file"
                      onChange={fileChangeHandler}
                      className="text-sm text-gray-300"
                    />
                    <button
                      className="auth-btn w-[130px]"
                      disabled={btnLoading}
                      onClick={() => addSongThumbnailHandler(e.id)}
                    >
                      {btnLoading ? "Please Wait..." : "Add Thumbnail"}
                    </button>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <CardTitle className="text-lg font-bold truncate">
                  {e.title.slice(0, 30)}
                </CardTitle>
                <CardDescription className="text-base text-gray-400 truncate">
                  {e.description.slice(0, 25)}..
                </CardDescription>
              </CardContent>

              <CardFooter className="flex items-center gap-2">
                <button
                  disabled={btnLoading}
                  className="px-3 py-1 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => deleteSong(e.id)}
                >
                  <MdDelete />
                </button>
                <button
                    disabled={btnLoading}
                    className="px-3 py-1 bg-blue-500 cursor-pointer text-white rounded"
                    onClick={() =>
                      navigate("/admin/add", {
                        state: { editMode: "song", data: e }, // pass the album data here
                      })
                    }
                  >
                    <FiEdit3 />
                  </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
