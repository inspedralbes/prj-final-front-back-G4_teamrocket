import express from 'express';
import fs from 'fs';
import path from 'path';
import { models } from '../models/index.js';
import { title } from 'process';

const router = express.Router();
const { Mod, User } = models;

const uploadsDir = path.join('uploads');
const modsDir = path.join(uploadsDir, 'mods');

// Obtener todos los mods
router.get('/', async (req, res) => {
  try {
    const mods = await Mod.findAll();
    console.log(mods);
    res.json(mods);
  } catch (error) {
    console.log({ error: 'Error al obtener los mods' });
  }
});

// Obtener un mod específico por ID
router.get('/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);
    if (!mod) return res.status(404).json({ error: 'Mod no encontrado' });
    const user = await User.findByPk(mod.uploaded_by);
    if (!user) return res.status(404).json({ error: 'User no encontrado' });
    const modUser = {
      description: mod.description,
      downloads: mod.downloads,
      title: mod.title,
      uploaded_at: mod.uploaded_at,
      uploaded_by: user.username
    }
    res.json(modUser);
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

router.get('/download/:id', async (req, res) => {
  try {
    // Buscar el mod por ID
    const mod = await Mod.findByPk(req.params.id);
    
    if (!mod) {
      return res.status(404).json({ error: 'Mod no encontrado' });
    }
    
    // Obtener la ruta completa del archivo
    const filePath = path.resolve(__dirname, modsDir, mod.file_path);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Incrementar el contador de descargas
    mod.downloads += 1;
    await mod.save();
    
    // Obtener el nombre del archivo de la ruta
    const fileName = path.basename(filePath);
    
    // Configurar los headers para la descarga
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Enviar el archivo como respuesta
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error al descargar el mod:', error);
    res.status(500).json({ error: 'Error al descargar el mod' });
  }
});

export default router;