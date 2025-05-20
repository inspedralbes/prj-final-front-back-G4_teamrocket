import mongoose from "mongoose";

const DailyNewModsSchema = new mongoose.Schema({
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
DailyNewModsSchema.index({ date: 1 }, { unique: true });

const DailyNewMods = mongoose.model("DailyNewMods", DailyNewModsSchema);

export default DailyNewMods;
