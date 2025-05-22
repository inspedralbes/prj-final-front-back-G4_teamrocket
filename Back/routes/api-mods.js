import express from 'express';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { models } from '../models/index.js';
import DailyNewMods from '../MongoDB/models/dailyNewMods.js';
import DailyDownloadsMods from '../MongoDB/models/dailyDownloadsMods.js';
import Comment from '../MongoDB/models/comment.js';
import Like from '../MongoDB/models/like.js';
import { getIO } from '../app.js';

const router = express.Router();
const { Mod, User, Tag } = models;

const uploadsDir = path.join('uploads');
const modsDir = path.join(uploadsDir, 'mods');
const imagesModDir = path.join(modsDir, 'imagesMods');

[uploadsDir, modsDir, imagesModDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Carpeta "${dir}" creat.`);
  }
});

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
    console.error(error)
    res.status(500).json({ error: 'Error en obtenir els mods' });
  }
});

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
      username: mod.User ? mod.User.username : 'Desconegut',
      uploaded_at: new Date(mod.uploaded_at).toISOString().split('T')[0],
      security: mod.security,
      file_path: mod.file_path
    }));

    res.status(200).json({ mods: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en obtenir mods per a administració' });
  }
});

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
    console.error(error);
    res.status(500).json({ error: 'Error en obtenir el mod' });
  }
});

const handleFileUpload = (file, directory, baseName = 'mod') => {
  return new Promise((resolve, reject) => {
    const extension = path.extname(file.name);
    const idfile = uuidv4().slice(0,5);
    const uniqueName = `${baseName}_${idfile}${extension}`;
    const uploadPath = path.join(directory, uniqueName);

    file.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve(`/${directory}/${uniqueName}`);
    });
  });
};

router.post('/new-mod', async (req, res) => {
  try {
    const { title, description, email } = req.body;
    const tags = JSON.parse(req.body.tags);

  if (!req.files || !req.files.modFile || !req.files.imageFile) {
      return res.status(400).json({ error: "No s'han penjat els fitxers requerits (mod o imatge)" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat" });
    }

    const modPath = await handleFileUpload(req.files.modFile, modsDir, title);
    const imagePath = await handleFileUpload(req.files.imageFile, imagesModDir, title);
    
    const newMod = await Mod.create({
      title,
      description,
      file_path: modPath,
      image: imagePath,
      uploaded_by: user.id
    });

    if (Array.isArray(tags) && tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(name =>
          Tag.findOrCreate({
            where: { name: name.trim().toLowerCase() }
          })
        )
      );

      await newMod.addTags(tagInstances.map(([tag]) => tag));
    }
    
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

    res.status(201).json({ message: 'Mod pujat'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en crear el mod' });
  }
});

const deleteFile = (filePath) => {
  if (!filePath) return;
  const resolvedPath = path.resolve(`.${filePath}`);
  if (fs.existsSync(resolvedPath)) {
    const rm = spawn('rm', ['-f', resolvedPath]);
    rm.on('error', (err) => console.error(`Error eliminant ${resolvedPath}:`, err));
    rm.stderr.on('data', (data) => console.error(`stderr: ${data}`));
    rm.on('close', (code) => console.log(`Fitxer ${resolvedPath} eliminat amb codi ${code}`));
  } else {
    console.warn(`Fitxer no trobat: ${resolvedPath}`);
  }
};

router.put('/update-mod', async (req, res) => {
  try {
    const { id, title, description, tags } = req.body;

    const mod = await Mod.findByPk(id, {
      include: [{ model: Tag, as: 'tags' }]
    });
    if(!mod) return res.status(404).json({ error: 'Mod no trobat' });

    mod.title = title;
    mod.description = description;

    if (req.files && req.files.modFile) {
      if (mod.file_path) deleteFile(mod.file_path);

      const modPath = await handleFileUpload(req.files.modFile, modsDir, title);
      mod.file_path = modPath;
    }

    if (req.files && req.files.image) {
      if (mod.image) deleteFile(mod.image);

      const imagePath = await handleFileUpload(req.files.image, imagesModDir, title);
      mod.image = imagePath;
    }

    await mod.save();

    const newTags = JSON.parse(tags);

    if (Array.isArray(newTags) && newTags.length > 0) {
      const tagInstances = await Promise.all(
        newTags.map(name =>
          Tag.findOrCreate({
            where: { name: name.trim().toLowerCase() }
          })
        )
      );

      await mod.setTags(tagInstances.map(([tag]) => tag));
    }

    res.status(200).json({ message: 'Mod actualitzat correctament' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en actualitzar el mod' });
  }
});

router.patch('/change-visible/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);
    if(!mod) return res.status(404).json({ error: 'Mod no trobat' });

    mod.visible = !mod.visible;
    await mod.save();

    res.status(200).json({ message: 'Visibilitat del mod actualitzat' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en actualitzar la visibilitat del mod' });
  }
});

router.patch('/security/:id', async (req, res) => {
  try {
    const modId = req.params.id;

    const mod = await Mod.findByPk(modId);
    if(!mod) return res.status(404).json({ error: 'Mod no trobat' });

    mod.security = !mod.security;
    mod.save();

    const io = getIO();
    io.emit('updateSecurity', { modId: mod.id, security: mod.security });

    res.status(200).json({ message: "Seguretat del mod actualitzada correctament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en actualitzar la seguretat del mod" });
  }
});

router.delete('/delete-mod/:id', async (req, res) => {
  try {
    const mod = await Mod.findByPk(req.params.id);
    if (!mod) return res.status(404).json({ error: 'Mod no trobat' });

    const deleteFile = (filePath) => {
      const resolvedPath = path.resolve(`.${filePath}`);
      if (fs.existsSync(resolvedPath)) {
        const rm = spawn('rm', ['-f', resolvedPath]);

        rm.on('error', (err) => {
          console.error(`Error eliminant ${resolvedPath}:`, err);
        });

        rm.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });

        rm.on('close', (code) => {
          console.log(`Fitxer ${resolvedPath} eliminat amb codi ${code}`);
        });
      } else {
        console.warn(`Fitxer no trobat: ${resolvedPath}`);
      }
    };

    if (mod.file_path) {
      deleteFile(mod.file_path);
    }

    if (mod.image) {
      deleteFile(mod.image);
    }

    await Comment.deleteMany({ modId: req.params.id });
    await Like.deleteMany({ modId: req.params.id });
    await DailyDownloadsMods.deleteMany({ modId: req.params.id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyNewMods.findOneAndUpdate(
      { date: today },
      { $inc: { deletedMods: 1 } },
      { upsert: true }
    );

    res.status(200).json({ message: 'Mod eliminat' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en eliminar el Mod' });
  }
});

router.patch('/download/:id', async (req, res) => {
  try {
    const modId = req.params.id;
    const mod = await Mod.findByPk(modId);

    if (!mod) {
      return res.status(404).json({ error: 'Mod no trobat' });
    }

    mod.downloads += 1;
    await mod.save();

    const io = getIO();
    io.emit('modDownloaded', { id: mod.id, downloads: mod.downloads });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await DailyDownloadsMods.findOneAndUpdate(
      { date: today, modId: modId },
      { $inc: { totalDownloads: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Descàrrega existosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en registrar descàrrega' });
  }
});

export default router;