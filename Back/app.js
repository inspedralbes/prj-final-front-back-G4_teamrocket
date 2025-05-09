"use strict";
// Importación de módulos necesarios
import express from "express";
import path from "path";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import http from 'http';
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

// Importación de rutas y modelos
import { sequelize } from './models/index.js';
import api_users from './routes/api-users.js';
import api_mods from './routes/api-mods.js';
import api_comments from './MongoDB/routes/api-comments.js';

// Carga variables de entorno desde .env
dotenv.config();

// Inicialización de la app de Express
const app = express();

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let io;

io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:7001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
});

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado');
  }
  return io;
};

app.use(cors());
app.use(fileUpload());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/mods', express.static(path.join(__dirname, 'uploads/mods')));

app.use("/api/users", api_users);
app.use("/api/mods", api_mods);
app.use("/api/comments", api_comments);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));

// Sincroniza Sequelize (base de datos relacional) y arranca el servidor
sequelize
  .sync()
  .then(() => {
    console.log("Base de dades sincronitzada.");
    server.listen(PORT, () => {
      console.log(`Servidor funcionan en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronitzant la base de dades:", err));