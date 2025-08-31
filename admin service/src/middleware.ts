import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.token as string;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/user/profile`,
      { headers: { token: token } }
    );
    //console.log(data)
    req.user = data.user
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Please log in" });
  }
};

//multer setup
import multer from "multer";

const storage = multer.memoryStorage()
const uploadFile = multer({storage}).single('file')

export default uploadFile