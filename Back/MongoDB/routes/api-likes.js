import express from 'express';
import Reaction from '../models/like.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reactions = Reaction.findAll();
        res.json(reactions);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/new-like', async (req, res) => {
    try {
        const { modId, email } = req.body;
        
        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);

        await ModDailyReactions.findOneAndUpdate(
            { modId, date: todayDate },
            { $inc: { totalLikes: 1 } },
            { upsert: true}
        );
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al registrar el like.' });
    }
});

// router.put('/dislike/:modId', async (req, res) => {
//     try {
//         const modId = req.params.modId;

//         const todayDate = new Date();
//         todayDate.setHours(0, 0, 0, 0);

//         await ModDailyReactions.findOneAndUpdate(
//             { modId, date: todayDate },
//             { $inc: { totalDislikes: 1 } },
//             { upsert: true, new: true }
//         );
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Ocurrió un error al registrar el dislike.' });
//     }
// });

export default router;