import express from 'express';
import bcrypt from 'bcrypt'; 
import path from 'path';
import { models } from '../models/index.js';
import { getIO } from '../app.js';
import { error } from 'console';

const router = express.Router(); // Crea un enrutador de Express
const { User, Mod } = models;

const uploadsDir = path.join('uploads');
const imageDir = path.join(uploadsDir, 'image-profile');

const handleFileUpload = (file, directory) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(directory, file.name);
    file.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve(`/${directory}/${file.name}`);
    });
  });
};

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        
        res.status(200).json(users);
    } catch (error) {
        console.error()
        res.status(500).end('Erro');
    }
});

// Hecho
router.post('/login-web', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuario por email
        const user = await User.findOne({ where: { email } });

        if(!user) return res.status(401).json({ error: "No existeix cap usuari amb aquest email." });
    
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Usuari o contrasenya incorrectes" });
        }
  
        res.status(200).json({email: user.email, admin: user.admin });
    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        res.status(500).json({ error: "Error intern del servidor" });
    }
});

// Hecho
router.post('/register-web', async (req, res) => {
    try {
        const { uPerfilsername, email, password } = req.body;

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
        console.error("Error en el registra:", error);
        res.status(500).json({ error: "Error intern del servidor" });
    }
});

// Hecho
router.post('/user-data', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email }});
        if(!user) return res.status(404).end();

        const mods = await Mod.findAll( { where: { uploaded_by: user.id }});
        if(!mods) return res.status(404).end();

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_path,
            mods: mods
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error en obtenir les dades de l'usuari:", error);
        res.status(500).end();
    }
});

// Hecho
router.put('/update-perfil/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, newPassword } = req.body;

        const user = await User.findByPk(userId);
        if(!user) return res.status(404).end();
        
        if (username) {
            if (username === user.username) {
              return res.status(404).json("El nombre de usuario ya está en uso");
            }
          
            user.username = username;
        }

        if(newPassword) {
            console.log(newPassword);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password_hash = hashedPassword;
        }

        if(req.files && req.files.newAvatar) {
            const newAvatarPath = await handleFileUpload(req.files.newAvatar, imageDir);
            user.avatar_path = newAvatarPath;
        }

        await user.save();

        res.json({ message: 'Dades actualizats' });
    } catch (error) {
        console.error("Error en actualitzar noves dades de l'usuari:", error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});

// Hecho
router.delete('/delete-user/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Hecho
router.patch('/toggle-admin/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.admin = !user.admin;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar rol de admin' });
  }
});

export default router;