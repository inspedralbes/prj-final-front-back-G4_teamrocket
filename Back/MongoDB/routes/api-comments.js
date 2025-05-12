import express from 'express';
import Comment from '../models/comment.js';
import { getIO } from '../../app.js';

const router = express.Router();

// Obtener todos los comentarios
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();

    //await Comment.deleteMany({});

    res.status(200).json(comments);
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
  const { email, modId, content, rating } = req.body;

  if (!email || !modId || !content || rating === undefined) {
    return res.status(400).json({ message: 'Faltan datos necesarios' });
  }

  const comment = new Comment({
    email,
    modId,
    content,
    rating
  });

  try {
    await comment.save();

    const allComments = await Comment.find();

    const io = getIO();
    io.emit('updateComments', { allComments });

    res.status(201).json({ message: "Nuevo comentario creado exitosamente" });
  } catch (err) {
    console.error("Hola");
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
  
  const allComments = await Comment.find();

  const io = getIO();
  io.emit('updateComments', { allComments });

  if (!deleted) {
    return res.status(404).json({ error: 'Comentario no encontrado' });
  }

  res.status(200).json({ message: 'Comentario eliminado correctamente' });
});

export default router;