import mongoose from "mongoose";

const DailyModStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  newMods: {
    type: Number,
    default: 0
  },
  deletedMods: {
    type: Number,
    default: 0
  }
});

// Solo puede haber un documento por fecha
DailyModStatsSchema.index({ date: 1 }, { unique: true });

const DailyNewMods = mongoose.model("DailyModStats", DailyModStatsSchema);

export default DailyNewMods;
