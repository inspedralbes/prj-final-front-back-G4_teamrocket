import express from 'express';
import Like from '../models/like.js';
import { getIO } from '../../app.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allLikes = await Like.find();
    res.status(200).json(allLikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en obtenir tots els likes" });
  }
});

router.post('/new-like', async (req, res) => {
  try {
    const { modId, email } = req.body;
  
    const newLike = new Like({ modId, email });
    await newLike.save();

    const allLikes = await Like.find();

    const io = getIO();
    io.emit('updateLikes', { allLikes });
  
    res.status(201).json({ message: 'Like registrat' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en registrar el like' });
  }
});

router.delete('/delete-like', async (req, res) => {
  try {
    const { modId, email } = req.body;
  
    const deleted = await Like.findOneAndDelete({ modId, email });
  
    if (deleted) {
      const allLikes = await Like.find();

      const io = getIO();
      io.emit('updateLikes', { allLikes });

      res.status(200).json({ message: 'Like eliminat' });
    } else {
      res.status(404).json({ error: 'Like no trobat' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el like' });
  }
});

export default router;