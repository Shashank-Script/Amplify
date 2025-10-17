import { useUserData } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { useSearch } from "@/context/SearchContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuth, logoutUser } = useUserData();
  const { searchQuery, setSearchQuery } = useSearch();

  const logoutUserHanlder = () => {
    logoutUser();
  };

  return (
    <nav className="w-full h-[72px] flex items-center justify-between px-6 bg-black text-white shadow-md">
      <div className="flex items-center gap-4">
        <img
          src="/Amplify_logo2.jpeg"
          alt="Amplify"
          className="w-32 h-auto object-contain"
        />
        <img
          src="/home.png"
          alt="Home"
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="What do you want to play?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-[#242424] text-white outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      <div className="flex items-center gap-4">
        {user && user.role === "admin" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-1 bg-white text-black font-medium rounded-full cursor-pointer hover:scale-105 transition-transform">
                Admin
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={10}
              className="bg-[#181818] border border-[#2a2a2a] text-white rounded-xl shadow-lg p-2 w-40"
            >
              <DropdownMenuLabel className="text-gray-400 text-xs mb-1">
                Admin Panel
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2a2a2a]" />
              <DropdownMenuItem
                onClick={() => navigate("/admin/add")}
                className="hover:bg-[#36d76e] hover:text-black rounded-md cursor-pointer transition-colors"
              >
                <MdOutlineAddCircle /> Add New
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/dashboard")}
                className="hover:bg-[#2ce86e] hover:text-black rounded-md cursor-pointer transition-colors"
              >
                <IoStatsChart /> Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <p
          className="px-4 py-1 bg-white text-black rounded-full cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/premium")}
        >
          Explore Premium
        </p>
        {isAuth ? (
          <p
            onClick={logoutUserHanlder}
            className="px-4 py-1 bg-white text-black rounded-full cursor-pointer hover:scale-105 transition"
          >
            Logout
          </p>
        ) : (
          <p
            onClick={() => navigate("/login")}
            className="px-4 py-1 bg-white text-black rounded-full cursor-pointer hover:scale-105 transition"
          >
            Login
          </p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
