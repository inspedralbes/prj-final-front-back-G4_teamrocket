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
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo comentario
router.post('/new-comment', async (req, res) => {
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

router.put('/update-comment', async (req, res) => {
  const { commentId, newContent } = req.body;

  try {
    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { content: newContent },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    console.log(updated);

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error actualizando comentario:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar el comentario' });
  }
});

router.delete('/delete-comment', async (req, res) => {
  const id = req.body.commentId;

  if (!id) {
    return res.status(400).json({ error: 'ID de comentario no proporcionado' });
  }

  const deleted = await Comment.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Comentario no encontrado' });
  }

  res.status(200).json({ message: 'Comentario eliminado correctamente' });
});

export default router;