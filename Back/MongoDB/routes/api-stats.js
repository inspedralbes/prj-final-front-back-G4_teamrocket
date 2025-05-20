import express from 'express';
import DailyModStats from '../models/dailyNewMods.js';

const router = express.Router();

router.get('/stats-mods', async (req, res) => {
    try {
        const statsDailyModStats = await DailyModStats.find();
        res.status(200).json(statsDailyModStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en obtenir les estadístiques' });
    }
});

export default router;