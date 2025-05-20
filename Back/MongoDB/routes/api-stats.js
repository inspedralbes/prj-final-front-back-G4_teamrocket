import express from 'express';
import DailyModStats from '../models/dailyNewMods.js';

const router = express.Router();

router.get('/stats-mods', async (req, res) => {
    try {
        const statsDailyModStats = await DailyModStats.find();

        await DailyModStats.deleteMany({});

        res.status(200).json(statsDailyModStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las estadistiques' });
    }
});

export default router;