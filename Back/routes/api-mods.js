import express from 'express';
import fs from 'fs';
import path from 'path';
import { models } from '../models/index.js';
import DailyNewMods from '../MongoDB/models/dailyModStats.js';
import DailyDownloadsMods from '../MongoDB/models/dailyDownloadsMods.js';
import { getIO } from '../app.js';
import mod from '../models/mod.js';

const router = express.Router();
const { Mod, User, Tag } = models;

const uploadsDir = path.join('uploads');
const modsDir = path.join(uploadsDir, 'mods');
const imagesDir = path.join(modsDir, 'images');

[uploadsDir, modsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Carpeta "${dir}" creada.`);
  }
});

// Hecho
router.get('/', async (req, res) => {
  try {
    const mods = await Mod.findAll({
      include: [
        {
        model: User,
        attributes: ['username']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });

    const listMods = mods.filter(mod => mod.visible !== false && mod.security !== false);

    res.status(200).json(listMods);
  } catch (error) {
    console.log({ error: 'Error al obtener los mods' });
  }
});

// Hecho
router.get('/admin-mods', async (req, res) => {
  try {
    const mods = await Mod.findAll({
      include: [{
        model: User,
        attributes: ['username'],
      }],
      attributes: ['id', 'title', 'uploaded_at', 'security', 'file_path'],
      order: [['uploaded_at', 'DESC']]
    });

    const result = mods.map(mod => ({
      id: mod.id,
      title: mod.title,
      username: mod.User ? mod.User.username : 'Desconocido',
      uploaded_at: new Date(mod.uploaded_at).toISOString().split('T')[0],
      security: mod.security,
      file_path: mod.file_path
    }));

    res.status(200).json({ mods: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener mods para administración' });
  }
});

// Hecho
router.get('/:id', async (req, res) => {
  try {
    const modId = req.params.id;

    const mod = await Mod.findByPk(modId, {
      include: {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: { attributes: [] }
      }
    });
    if (!mod) return res.status(404).json({ error: 'Mod no trobat' });

    const user = await User.findByPk(mod.uploaded_by);
    if (!user) return res.status(404).json({ error: 'Usuari no trobat' });

    const modUser = {
      description: mod.description,
      downloads: mod.downloads,
      title: mod.title,
      file_path: mod.file_path,
      uploaded_at: mod.uploaded_at,
      uploaded_by: user.username,
      image: mod.image,
      tags: mod.tags.map(tag => tag.name)
    };

    const statsDailyDownloadsMods = await DailyDownloadsMods.find({ modId: Number(modId) });

    res.status(200).json({ modUser, statsDailyDownloadsMods });
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

// Hecho
router.post('/new-mod', async (req, res) => {
  try {
    const { title, description, email } = req.body;
    const tags = JSON.parse(req.body.tags);

    if (!req.files || !req.files.modFile || !req.files.imageFile) {
      return res.status(400).json({ error: "No se han subido los archivos requeridos (mod o imagen)" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const modPath = await handleFileUpload(req.files.modFile, modsDir);
    const imagePath = await handleFileUpload(req.files.imageFile, imagesDir);
    
    const newMod = await Mod.create({
      title,
      description,
      file_path: modPath,
      image: imagePath,
      uploaded_by: user.id
    });

    console.log(tags);

    if (Array.isArray(tags) && tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(name =>
          Tag.findOrCreate({
            where: { name: name.trim().toLowerCase() }
          })
        )
      );

      await newMod.addTags(tagInstances.map(([tag]) => tag));
    } else {
      console.log("No");
    }
    
    // MongoDB
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyNewMods.findOneAndUpdate(
      { date: today },
      { $inc: { newMods: 1 } },
      { upsert: true }
    );

    const listMods = await Mod.findAll({
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['uploaded_at', 'DESC']]
    });

    const io = getIO();
    io.emit('newMod', listMods);

    res.status(201).json({ message: 'Mod subido exitosamente'});
  } catch (error) {
    console.log('Error al actualizar estadísticas:', error);
    res.status(500).json({ error: 'Error al crear el mod' });
  }
});

// Hecho
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

// Hecho
router.patch('/change-visible/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);
    if(!mod) return res.status(404).json({ error: 'Mod no trobat' });

    mod.visible = !mod.visible;
    await mod.save();

    res.status(200).json({ message: 'Visibilidad del mod actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la visibilidad del mod' });
  }
});

// Hecho
router.patch('/security/:id', async (req, res) => {
  try {
    const modId = req.params.id;

    const mod = await Mod.findByPk(modId);
    if(!mod) return res.status(404).json({ error: 'Mod no encontrado' });

    mod.security = !mod.security;
    mod.save();

    const io = getIO();
    io.emit('updateSecurity', { modId: mod.id, security: mod.security });

    res.status(200).json({ message: "Seguridad del mod actualizada correctamente" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error en actualizar la seguridad del mod" });
  }
});

//Hecho
router.delete('/delete-mod/:id', async (req, res) => {
  try {
    const deleted = await Mod.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });

    // MongoDB
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyNewMods.findOneAndUpdate(
      { date: today },
      { $inc: { deletedMods: 1 } },
      { upsert: true }
    );

    res.status(200).json({ message: 'Mod eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Mod existosamente eliminado' });
  }
});

// Hecho
router.patch('/download/:id', async (req, res) => {
  try {
    const modId = req.params.id;
    const mod = await Mod.findByPk(modId);

    if (!mod) {
      return res.status(404).json({ error: 'Mod no encontrado' });
    }

    const io = getIO();
    io.emit('modDownloaded', { id: mod.id, downloads: mod.downloads + 1 });

    mod.downloads += 1;
    await mod.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyDownloadsMods.findOneAndUpdate(
      { date: today, modId: modId },
      { $inc: { totalDownloads: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Descarga existosa' });
  } catch (error) {
    console.error('Error al registrar descarga:', error);
    res.status(500).json({ error: 'Error al registrar descarga' });
  }
});

router.post('/new-tag/:id', async (req, res) => {
  const modId = req.params.id;
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Se requiere un nombre de tag válido.' });
  }

  try {
    const mod = await Mod.findByPk(modId);
    if (!mod) {
      return res.status(404).json({ error: 'Mod no encontrado.' });
    }

    const [tag] = await Tag.findOrCreate({
      where: { name: name.trim().toLowerCase() }
    });

    await mod.addTag(tag);

    return res.status(200).json({ message: `Tag '${tag.name}' agregado al mod.` });
  } catch (error) {
    console.error('Error al agregar tag:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;