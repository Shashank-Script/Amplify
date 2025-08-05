import tryCatch from "./errorHandling.js";
import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = tryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );

  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
});

export const loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "User logged in successfully",
    user,
    token,
  });
});

export const getUserProfile = tryCatch(async (req:AuthenticatedRequest, res, next) => {
  const user = req.user

  res.status(200).json({
    message: "User profile fetched successfully",
    user,
  });
});