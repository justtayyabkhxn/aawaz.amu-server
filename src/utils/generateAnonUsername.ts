// utils/generateAnonUsername.ts
import {User} from "../models/User";

export const generateAnonUsername = async (): Promise<string> => {
  let unique = false;
  let username = "";

  while (!unique) {
    const randomNum = Math.floor(Math.random() * (999999 - 100) + 100); // 3 to 6 digits
    username = `Anon${randomNum}`;

    const existing = await User.findOne({ username });
    if (!existing) unique = true;
  }

  return username;
};
