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
import { sequelize } from "./models/index.js";
import api_users from "./routes/api-users.js";

// Carga variables de entorno desde .env
dotenv.config();

// Inicialización de la app de Express
const app = express();
const PORT = process.env.PORT || 3002;

app.use("/api/users", api_users);  

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
