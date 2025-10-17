import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import SignUp from "./pages/SignUp";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAdd from "./pages/AdminAdd";
import Premium from "./pages/Premium";
const App = () => {
  const { isAuth, loading } = useUserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/playlist" element={isAuth ? <PlayList /> : <Login />} />
            <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard /> : <Login />} />
            <Route path="/admin/add" element={isAuth ? <AdminAdd /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/signup" element={isAuth ? <Home /> : <SignUp />} />
            <Route path="/premium" element={<Premium />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
