// server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';               
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from "./routes/userRoutes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow specific origins
const allowedOrigins = ["http://localhost:3000", "https://aawazamu.vercel.app"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use("/api/user", userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
