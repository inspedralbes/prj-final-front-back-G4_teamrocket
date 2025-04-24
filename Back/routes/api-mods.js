import express from 'express';
import fs from 'fs';
import path from 'path';
import { models } from '../models/index.js';

const router = express.Router();
const { Mod, User } = models;

const uploadsDir = path.join('uploads');
const modsDir = path.join(uploadsDir, 'mods');

// Obtener todos los mods
router.get('/', async (req, res) => {
  try {
    const mods = await Mod.findAll();
    res.json(mods);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mods' });
  }
});

// Obtener un mod específico por ID
router.get('/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);
    if (!mod) return res.status(404).json({ error: 'Mod no encontrado' });
    res.json(mod);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el mod' });
  }
});

const handleFileUpload = (file, directory) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(directory, file.name);
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(`/${directory}/${file.name}`);
    });
  });
};

// Crear un nuevo mod
router.post('/new-mod', async (req, res) => {
  try {
    const { title, description, email } = req.body;

    if (!req.files || !req.files.modFile) {
      return res.status(400).json({ message: "No s'han penjat els fitxers requerits" });
    }

    const user = await User.findOne({ where: { email } });
    const modPath = await handleFileUpload(req.files.modFile, modsDir);
    const newMod = await Mod.create({ title, description, file_path: modPath, uploaded_by: user.id });
    res.status(201).json(newMod);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mod' });
  }
});

export default router;