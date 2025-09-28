import { useUserData } from "@/context/UserContext";
import { FaMusic } from "react-icons/fa"

const PlayListCard = () => {
  const { user, isAuth } = useUserData();
  return (
    <div className="flex items-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#ffffff26]">
      <div className="w-10 h-10 flex bg-gray-600 rounded-md items-center justify-center">
        <FaMusic className="text-xl text-white" />
      </div>
      <div className="ml-4">
        <h2>My PlayList</h2>
        <p className="text-gray-400 text-sm">
          PlayList •{" "} 
          {isAuth ? <span>{user?.name}</span> : <span>{"User"}</span>}
        </p>
      </div>
    </div>
  )
}

export default PlayListCard