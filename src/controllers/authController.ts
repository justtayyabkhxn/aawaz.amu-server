// server/src/controllers/authController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { generateAnonUsername } from "../utils/generateAnonUsername";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    const username = await generateAnonUsername();

    const hashed = await bcrypt.hash(password, 10); 

    const newUser = await User.create({
      email,
      password: hashed,
      username,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        email: newUser.email,
        username: newUser.username,
      },
      // Optional: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
