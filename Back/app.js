"use strict";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { sequelize } from './models/index.js';
import api_users from './routes/api-users.js';
import api_mods from './routes/api-mods.js';
import api_comments from './MongoDB/routes/api-comments.js';
import api_likes from './MongoDB/routes/api-likes.js';
import api_stats from './MongoDB/routes/api-stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(fileUpload());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/uploads/mods', express.static(path.join(__dirname, 'uploads/mods')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/image-profile')));
app.use('/resources/bepinex', express.static(path.join(__dirname, 'resources/bepinex')));
app.use('/resources/game', express.static(path.join(__dirname, 'resources/game')));

app.use("/api/users", api_users);
app.use("/api/mods", api_mods);
app.use("/api/comments", api_comments);
app.use("/api/likes", api_likes);
app.use("/api/stats", api_stats);

let io;
io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:7001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

io.on('connection', (socket) => {
  console.log('Usuari connectat:', socket.id);

  socket.on('disconnect', () => {
    console.log(`Usuari desconnectat: ${socket.id}`);
  });
});

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no ha estat inicialitzat');
  }
  return io;
};

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

sequelize
  .sync()
  .then(() => {
    console.log("Base de dades sincronitzada.");
    server.listen(PORT, () => {
      console.log(`Servidor funcionan en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronitzant la base de dades:", err));