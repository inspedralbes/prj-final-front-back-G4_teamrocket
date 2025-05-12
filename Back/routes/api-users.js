// Importa módulos necesarios
import express from 'express';
import bcrypt from 'bcrypt'; 
import path from 'path';
import { models } from '../models/index.js'; // Modelo de usuario desde Sequelize

const router = express.Router(); // Crea un enrutador de Express
const { User, Mod } = models;

const uploadsDir = path.join('uploads');
const imageDir = path.join(uploadsDir, 'images');

const handleFileUpload = (file, directory) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(directory, file.name);
    file.mv(uploadPath, (err) => {
      if (err) return reject(err);
      resolve(`/${directory}/${file.name}`);
    });
  });
};

router.post('/login-unity', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca el usuario por nombre
        const user = await User.findOne({ where: { username } });

        if(!user) return res.json({ message: "No existeix cap usuari amb aquest email." });

        // Compara contraseña ingresada con la guardada (encriptada)
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.json({ message: "Usuari o contrasenya incorrecta" });
        }

        res.status(201).json({ message: "success", email: user.email });
    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

// Ruta POST para registrar un nuevo usuario (modo normal)
router.post('/register-unity', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verifica si ya existe un usuario con el mismo nombre
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ message: "Ja existeix un usuari amb aquest nom" });
        }

        // Verifica si el correo electrónico ya está en uso
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.json({ message: "El correu electrònic ja està en ús" });
        }

        // Encripta la contraseña
        const hardPassword = await bcrypt.hash(password, 10);

        // Genera la ruta de carpeta asociada al email para estadísticas
        // const emailFolder = `/statistics/images/${email.replace(/[@.]/g, "_")}`;

        // Crea el nuevo usuario en la base de datos
        await User.create({ username, email, password_hash: hardPassword });

        res.status(201).json({ message: "success", email: email });
    } catch (error) {
        console.error("Error en el registra:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.post('/login-web', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuario por email
        const user = await User.findOne({ where: { email } });

        if(!user) return res.status(401).json({ message: "No existeix cap usuari amb aquest email." });
    
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: "Usuari o contrasenya incorrectes" });
        }
  
        res.status(201).json({ message: "success" });
    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

// Ruta POST para registrar un nuevo usuario (modo normal)
router.post('/register-web', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verifica si ya existe un usuario con el mismo nombre
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ message: "Ja existeix un usuari amb aquest nom" });
        }

        // Verifica si el correo electrónico ya está en uso
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.json({ message: "El correu electrònic ja està en ús" });
        }

        // Encripta la contraseña
        const hardPassword = await bcrypt.hash(password, 10);

        // Genera la ruta de carpeta asociada al email para estadísticas
        // const emailFolder = `/statistics/images/${email.replace(/[@.]/g, "_")}`;

        // Crea el nuevo usuario en la base de datos
        await User.create({ username, email, password_hash: hardPassword });

        res.status(201).json({ message: "success", email: email });
    } catch (error) {
        console.error("Error en el registra:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.post('/user-data', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email }});
        const mods = await Mod.findAll( { where: { uploaded_by: user.id }});

        const userData = {
            username: user.username,
            email: user.email,
            avatar: user.avatar_path,
            mods: mods
        }

        res.status(201).json(userData);
    } catch (error) {
        console.error("Error en obtenir les dades del usuari:", error);
        res.status(500).json({ message: "Error intern del servidor" });
    }
});

router.put('/update-perfil', async (req, res) => {
    try {
        const { email, username, newPassword } = req.body;

        const user = await User.findOne({ where: { email }});

        if(username && username != user.username) user.username = username;

        if(newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        if(req.files && req.files.newAvatar) {
            const newAvatarPath = await handleFileUpload(req.files.newAvatar, imageDir);
            user.avatar_path = newAvatarPath;
        }

        await user.save();

        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});

// router.put('/change-profile-picture', async (req, res) => {
//     try {
//         const { email } = req.body;

//         const user = await User.findOne({ where: { email }});

//         if (req.files && req.files.profile_picture) {
//             const modPath = await handleFileUpload(req.files.profile_picture, imageDir);
//             user.profile_picture = modPath;
//         }

//         user.save();
//         res.status(201).json({ message: 'Perfil de foto actualizado correctamente' });
//     } catch (error) {
//         console.error("Error en obtenir les dades del usuari:", error);
//         res.status(500).json({ message: "Error intern del servidor" });
//     }
// });

export default router;