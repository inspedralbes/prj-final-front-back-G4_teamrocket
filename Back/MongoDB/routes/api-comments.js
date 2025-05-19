import express from 'express';
import Comment from '../models/comment.js';
import { getIO } from '../../app.js';

const router = express.Router();

// Hecho
router.get('/', async (req, res) => {
  try {
    const allComments = await Comment.find();
    res.status(200).json(allComments);
  } catch (err) {
    res.status(500).json({ error: 'Error en obtenir tots els comentaris' });
  }
});

// Hecho
router.get('/:modId', async (req, res) => {
  try {
    const comments = await Comment.find({ modId: req.params.modId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error en obtenir els comentaris del Mod" });
  }
});

// Hecho
router.post('/new-comment', async (req, res) => {
  const { email, modId, content, rating } = req.body;

  if (!email || !modId || !content || rating === undefined) {
    return res.status(400).json({ message: 'Falten dades necesaries' });
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

    res.status(201).json({ message: "Nou comentari creat existosament" });
  } catch (err) {
    res.status(400).json({ error: "Error en registrar el comentari" });
  }
});

// Hecho
router.put('/update-comment', async (req, res) => {
  const { commentId, newContent } = req.body;

  try {
    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { content: newContent },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Comentari no trobat i actualitzat' });
    }

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Error en actualitzar el comentari' });
  }
});

// Hecho
router.delete('/delete-comment/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Comentari no trobat' });
    }
  
    const allComments = await Comment.find();
  
    const io = getIO();
    io.emit('updateComments', { allComments });
  
    res.status(200).json({ message: 'Comentario eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error en eliminar el comentari' });
  }
});

export default router;