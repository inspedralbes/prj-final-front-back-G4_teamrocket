import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs'; 
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { models } from '../models/index.js';
import Like from '../MongoDB/models/like.js';
import Comment from '../MongoDB/models/comment.js';
import { getIO } from '../app.js';

const router = express.Router();
const { User, Mod, Tag } = models;

const uploadsDir = path.join('uploads');
const image_ProfileDir = path.join(uploadsDir, 'image-profile');

[uploadsDir, image_ProfileDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Carpeta "${dir}" creat.`);
  }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        
        res.status(200).json(users);
    } catch (error) {
        console.error(error)
        res.status(500).end();
    }
});

router.post('/login-web', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if(!user) return res.status(401).json({ error: "No existeix cap usuari amb aquest email." });
    
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Usuari o contrasenya incorrectes" });
        }
  
        res.status(200).json({email: user.email, admin: user.admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en Inicia sessió" });
    }
});

router.post('/register-web', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(404).json({ error: "Ja existeix un usuari amb aquest nom" });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(404).json({ error: "El correu electrònic ja està en ús" });
        }

        const hardPassword = await bcrypt.hash(password, 10);

        await User.create({ username, email, password_hash: hardPassword });

        const listUsers = await User.findAll();

        const io = getIO();
        io.emit('newUser', listUsers );

        res.status(201).json({ message: "Registrat l'usuari correctament" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en registrar l'usuari" });
    }
});

router.post('/user-data', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email }});
        if(!user) return res.status(404).end();

        const mods = await Mod.findAll(
            { 
                where: { uploaded_by: user.id },
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['name'],
                        through: { attributes: [] }
                    }
                ]
            }
        );

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_path,
            mods: mods
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

const handleFileUpload = (file, directory) => {
  return new Promise((resolve, reject) => {
    const extension = path.extname(file.name);
    const baseName = path.parse(file.name).name;
    const idfile = uuidv4().slice(0,5);
    const uniqueName = `${baseName}_${idfile}${extension}`;
    const uploadPath = path.join(directory, uniqueName);

    file.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve(`/${directory}/${uniqueName}`);
    });
  });
};

router.put('/update-perfil/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, newPassword } = req.body;

        const user = await User.findByPk(userId);
        if(!user) return res.status(404).end();
        
        if (username) {
            if (username === user.username) {
              return res.status(404).json("El nom d'usuari ja està en ús");
            }
            user.username = username;
        }

        if(newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password_hash = hashedPassword;
        }

        if(req.files && req.files.newAvatar) {
            const newAvatarPath = await handleFileUpload(req.files.newAvatar, image_ProfileDir);
            user.avatar_path = newAvatarPath;
        }

        await user.save();
        res.json({ message: 'Dades actualitzades' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en actualitzar les dades' });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuari no trobat' });

    await Like.deleteMany({ email: user.email });
    await Comment.deleteMany({ email: user.email });

    await user.destroy();
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: "Error en eliminar l'usuari" });
  }
});

router.patch('/toggle-admin/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuari no trobat' });

    user.admin = !user.admin;
    await user.save();

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: "Error en canviar rol d'admin" });
  }
});

export default router;