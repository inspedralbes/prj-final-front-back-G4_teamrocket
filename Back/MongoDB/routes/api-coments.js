import express from 'express';
import Comment from '../models/comment.js';

const router = express.Router();

// Obtener todos los comentarios
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener comentarios de un mod específico
router.get('/:modId', async (req, res) => {
  try {
    const comments = await Comment.find({ modId: req.params.modId });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo comentario
router.post('/new-comment', async (req, res) => {
  console.log(req.body);
  const comment = new Comment({
    email: req.body.email,
    modId: req.body.modId,
    content: req.body.content,
    rating: req.body.rating
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;