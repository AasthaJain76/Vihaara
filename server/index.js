import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import mindfulnessRoutes from "./routes/mindfulnessRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);

/* --------------------------- CORS CONFIG --------------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://vihaara.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* --------------------------- MIDDLEWARE ---------------------------------- */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.originalUrl}`);
  next();
});

/* -------------------------- HEALTH CHECK --------------------------------- */

app.get("/ping", (req, res) => {
  res.json({ status: "ok", message: "Vihaara API running" });
});

/* ---------------------------- ROUTES ------------------------------------- */

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/journal", journalRoutes);
app.use("/mood", moodRoutes);
app.use("/chat", chatRoutes);
app.use("/mindfulness", mindfulnessRoutes);

app.get("/", (req, res) => {
  res.send("🧘‍♀️ Vihaara API + Socket server is live...");
});

/* --------------------------- SOCKET.IO ----------------------------------- */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("ai-message", (data) => {
    console.log("🧠 User Message:", data.message);

    setTimeout(() => {
      socket.emit("ai-response", {
        message: `Here's a calm thought: "${data.message}" 🌿`,
      });
    }, 800);
  });

  socket.on("disconnect", () =>
    console.log(`❎ Socket disconnected: ${socket.id}`)
  );
});

/* --------------------------- MONGODB ------------------------------------- */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected to Vihaara");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* ---------------------- GLOBAL ERROR HANDLERS ---------------------------- */

process.on("unhandledRejection", (err) => {
  console.error("🚨 Unhandled Promise Rejection:", err);
});

process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  process.exit(0);
});
