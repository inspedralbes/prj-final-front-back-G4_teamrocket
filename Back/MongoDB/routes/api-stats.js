import express from 'express';
import DailyModStats from '../models/dailyModStats.js';

const router = express.Router();

router.get('/stats-mods', async (req, res) => {
    try {
        const statsDailyModStats = await DailyModStats.find();

        console.log(statsDailyModStats);

        res.status(200).json(statsDailyModStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las estadistiques' });
    }
});

export default router;