"use strict";
// Importación de módulos necesarios
import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

// Importación de rutas y modelos
import { sequelize } from './models/index.js';
import api_users from './routes/api-users.js';
import api_mods from './routes/api-mods.js';

// Carga variables de entorno desde .env
dotenv.config();

// Inicialización de la app de Express
const app = express();
const PORT = process.env.PORT || 3002;

const corsOptions = {
  origin: 'http://localhost:7001',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", api_users);
app.use("/api/mods", api_mods);

// Sincroniza Sequelize (base de datos relacional) y arranca el servidor
sequelize
  .sync()
  .then(() => {
    console.log("Base de dades sincronitzada.");
    app.listen(PORT, () => {
      console.log(`Servidor funcionan en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error sincronitzant la base de dades:", err));
