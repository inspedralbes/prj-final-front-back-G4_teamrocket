import express from 'express';
import fs from 'fs';
import path from 'path';
import { models } from '../models/index.js';
import DailyNewMod from '../MongoDB/models/dailyNewMods.js';
import { getIO } from '../app.js';

const router = express.Router();
const { Mod, User } = models;

const uploadsDir = path.join('uploads');
const modsDir = path.join(uploadsDir, 'mods');
const imagesDir = path.join(modsDir, 'images');
const imageDir = path.join(uploadsDir, 'images');

[uploadsDir, modsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Carpeta "${dir}" creada.`);
  }
});

// Obtener todos los mods
router.get('/', async (req, res) => {
  try {
    const mods = await Mod.findAll({
      include: [{
        model: User,
        attributes: ['username']
      }],
    });

    const listMods = mods.filter(mod => mod.visible === true);

    res.status(200).json(listMods);
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
      file_path: mod.file_path,
      uploaded_at: mod.uploaded_at,
      uploaded_by: user.username,
      image: mod.image
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
      if (err) return reject(err);
      resolve(`/${directory}/${file.name}`);
    });
  });
};

// Crear un nuevo mod
router.post('/new-mod', async (req, res) => {
  try {
    const { title, description, email } = req.body;

    if (!req.files || !req.files.modFile || !req.files.imageFile) {
      return res.status(400).json({ message: "No se han subido los archivos requeridos (mod o imagen)" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Guardar el archivo del mod
    const modPath = await handleFileUpload(req.files.modFile, modsDir);
    // Guardar la imagen usando el mismo nombre
    const imagePath = await handleFileUpload(req.files.imageFile, imagesDir);
    // Guardar en la base de datos
    const newMod = await Mod.create({
      title,
      description,
      file_path: modPath,
      image: imagePath,
      uploaded_by: user.id
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyNewMod.findOneAndUpdate(
      { date: today },
      { $inc: { newMods: 1 } },
      { upsert: true }
    );

    res.status(201).json(newMod);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mod' });
  }
});

router.put('/update-mod', async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const mod = await Mod.findByPk(id);
    if(!mod) return res.status(404).json({ error: 'Mod no encontrado' });

    mod.title = title;
    mod.description = description;

    if (req.files && req.files.modFile) {
      const modPath = await handleFileUpload(req.files.modFile, modsDir);
      mod.file_path = modPath;
    }

    await mod.save();
    res.status(200).json({ message: 'Mod actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizado el mod:', error);
    res.status(500).json({ error: 'Error al actualizar el mod' });
  }
});

router.put('/update-visible', async (req, res) => {
  try {
    const { id, visible } = req.body;

    const mod = await Mod.findByPk(id);
    if(!mod) return res.status(404).json({ error: 'Mod no encontrado' });

    mod.visible = visible;
    await mod.save();
    res.status(200).json({ message: 'Visibilidad del mod actualizado correctamente' });
  } catch (error) {
    console.error('Error en actualizar la visibilidad del mod:', error);
    res.status(500).json({ error: 'Error en actualizar la visibilidad del mod' });
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);

    if (!mod) {
      return res.status(404).json({ error: 'Mod no encontrado' });
    }

    const io = getIO();
    io.emit('modDownloaded', { id: mod.id, downloads: mod.downloads + 1 });

    mod.downloads += 1;
    await mod.save();

    res.status(200).json({ message: 'Descarga registrada' });
  } catch (error) {
    console.error('Error al registrar descarga:', error);
    res.status(500).json({ error: 'Error al registrar descarga' });
  }
});

export default router;