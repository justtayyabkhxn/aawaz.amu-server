// server/src/controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../models/User";

export const getUserById = async (req: Request, res: Response) : Promise<any> => {
  try {
    const user = await User.findById(req.params.id).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
