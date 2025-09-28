import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import SignUp from "./pages/SignUp";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Admin from "./pages/Admin";
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
            <Route path="/admin/dashboard" element={isAuth ? <Admin /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/signup" element={isAuth ? <Home /> : <SignUp />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
