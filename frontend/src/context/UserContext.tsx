import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const server = "http://localhost:3000";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  btnLoading: boolean;
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  signUpUser: (
    name:string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  addToPlaylist: (id: string) => void;
  logoutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function signUpUser (
    name:string,
    email: string,
    password: string,
    navigate: (path: string) => void
  )  {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, {
        name,
        email,
        password,
      });
      const token = data.token;
      const user = data.user;
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error:any) {
      console.log(error.response?.data || error.message);
      setBtnLoading(false);
    }
  };

  async function loginUser (
    email: string,
    password: string,
    navigate: (path: string) => void
  )  {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password,
      });
      const token = data.token;
      const user = data.user;
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error:any) {
      console.log(error.response?.data || error.message);
      setBtnLoading(false);
    }
  };

  async function logoutUser() {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);

    toast.success("User Logged Out");
  }

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token not found");
      }
      const { data } = await axios.get(`${server}/api/v1/user/profile`, {
        headers: {
          token : token,
        },
      });
      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error:any) {
      console.log(error.response?.data || error.message);
      setLoading(false);
    }
  };

  async function addToPlaylist(id: string) {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isAuth, loading, btnLoading, signUpUser, loginUser, addToPlaylist, logoutUser }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
