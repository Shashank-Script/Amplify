import type { ReactNode } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import type React from "react"
import Player from "./Player"

interface LayoutProps {
    children : ReactNode
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main Content Section (below navbar) */}
      <div className="flex flex-1 pt-[72px]"> 
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 m-2 px-6 pt-4 rounded bg-[#121212] overflow-auto">
          {children}
        </div>
      </div>

      {/* Player at bottom */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Player />
      </div>
    </div>
  )
}

export default Layout