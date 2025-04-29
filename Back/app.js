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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(fileUpload());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/mods', express.static(path.join(__dirname, 'uploads/mods')));

app.use("/api/users", api_users);
app.use("/api/mods", api_mods);

/*
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));
*/

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
