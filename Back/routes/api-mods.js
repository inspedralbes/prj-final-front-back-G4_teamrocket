import express from 'express';
import { models } from '../models/index.js'; // Importa tu modelo Mod
// También podrías tener middlewares como auth
// import { isAuthenticated } from '../middleware/auth';

const router = express.Router();
const { Mod } = models;

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

// Crear un nuevo mod
router.post('/new-mod', async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const newMod = await Mod.create({ title, description, userId });
    res.status(201).json(newMod);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mod' });
  }
});

export default router;