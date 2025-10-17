import { useSongData } from "@/context/SongContext";
import { useUserData } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserData();

  const { albums, fetchAlbums, fetchSongs } = useSongData();

  const admin = import.meta.env.VITE_ADMIN_SERVICE_URL;

  const editMode = location.state?.editMode;
  const editData = location.state?.data || null;

  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [songTitle, setSongTitle] = useState<string>("");
  const [albumDescription, setAlbumDescription] = useState<string>("");
  const [songDescription, setSongDescription] = useState<string>("");
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
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", file);
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${admin}/api/v1/album/new`,
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
      setAlbumTitle("");
      setAlbumDescription("");
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
    formData.append("title", songTitle);
    formData.append("album", album);
    formData.append("description", songDescription);
    formData.append("file", file);
    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${admin}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setSongTitle("");
      setSongDescription("");
      setAlbum("");
      setFile(null);
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const updateAlbumHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editData?.id) return toast.error("Invalid album selected");
    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    if (file) formData.append("file", file);

    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${admin}/api/v1/update-album/${editData.id}`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      fetchAlbums();
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating album");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateSongHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editData?.id) return toast.error("Invalid song selected");
    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("album", album);
    if (file) formData.append("file", file);

    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${admin}/api/v1/update-song/${editData.id}`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      fetchSongs();
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating song");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (editMode === "album" && editData) {
      setAlbumTitle(editData.title || "");
      setAlbumDescription(editData.description || "");
    } else if (editMode === "song" && editData) {
      setSongTitle(editData.title || "");
      setSongDescription(editData.description || "");
      setAlbum(editData.album_id || "");
    }
  }, [editMode, editData]);

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
        onSubmit={editMode === "album" ? updateAlbumHandler : addAlbumHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripiton"
          className="auth-input"
          value={albumDescription}
          onChange={(e) => setAlbumDescription(e.target.value)}
          required
        />
        <input
          type="file"
          placeholder="Choose Thumbnail"
          onChange={fileChangeHandler}
          className="auth-input"
          accept="image/*"
          required={editMode === "album" ? false : true}
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading
            ? "Please Wait..."
            : editMode === "album"
            ? "Update"
            : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={editMode === "song" ? updateSongHandler : addSongHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripiton"
          className="auth-input"
          value={songDescription}
          onChange={(e) => setSongDescription(e.target.value)}
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
          required={editMode !== "song"}
        />
        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading
            ? "Please Wait..."
            : editMode === "song"
            ? "Update"
            : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AdminAdd;
