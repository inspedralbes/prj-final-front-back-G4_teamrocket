// Importa módulos necesarios
import express from 'express';
import bcrypt from 'bcrypt'; // Para encriptar contraseñas
import { models } from '../models/index.js'; // Modelo de usuario desde Sequelize

const router = express.Router(); // Crea un enrutador de Express
const { User } = models;

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

        return res.status(201).json({ message: "success", email: user.email });

    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
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

        return res.status(201).json({ message: "success", email: email });

    } catch (error) {
        console.error("Error en el registra:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
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
  
        return res.status(201).json({ message: "success" });
    } catch (error) {
        console.error("Error en Inicia sessió:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
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

        return res.status(201).json({ message: "success", email: email });

    } catch (error) {
        console.error("Error en el registra:", error);
        return res.status(500).json({ message: "Error intern del servidor" });
    }
});

export default router;