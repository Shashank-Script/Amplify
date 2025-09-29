import { useSongData } from "@/context/SongContext";
import { useUserData } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const server = "http://localhost:7000";

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addAlbumHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      fetchAlbums();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("album", album);
    formData.append("description", description);
    formData.append("file", file);
    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setAlbum("");
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const addSongThumbnailHandler = async (id: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
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
        const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
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
        const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
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
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={addAlbumHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripiton"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          placeholder="Choose Thumbnail"
          onChange={fileChangeHandler}
          className="auth-input"
          accept="image/*"
          required
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={addSongHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripiton"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="auth-input"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          required
        >
          <option value="">Choose Album</option>
          {albums?.map((e: any, i: number) => {
            return (
              <option value={e.id} key={i}>
                {e.title}
              </option>
            );
          })}
        </select>
        <input
          type="file"
          placeholder="Choose audio"
          onChange={fileChangeHandler}
          className="auth-input"
          accept="audio/*"
          required
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Albums</h3>
        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {albums?.map((e, i) => {
            return (
              <Card key={i} className="bg-[#181818] border-none text-white w-56">
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
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    //onClick={}
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
        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {songs?.map((e, i) => {
            return (
              <div className="bg-[#181818] p-4 rounded-lg shadow-md" key={i}>
                {e.thumbnail ? (
                  <img src={e.thumbnail} className="mr-1 w-52 h-52" alt="" />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 w-[250px]">
                    <input type="file" onChange={fileChangeHandler} />
                    <button
                      className="auth-btn"
                      style={{ width: "200px" }}
                      disabled={btnLoading}
                      onClick={() => addSongThumbnailHandler(e.id)}
                    >
                      {btnLoading ? "Please Wait..." : "Add Thumbnail"}
                    </button>
                  </div>
                )}

                <h4 className="text-lg font-bold">{e.title.slice(0, 30)}</h4>
                <h4 className="text-lg font-bold">
                  {e.description.slice(0, 20)}..
                </h4>
                <button
                  disabled={btnLoading}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteSong(e.id)}
                >
                  <MdDelete />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
