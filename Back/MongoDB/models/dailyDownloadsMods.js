import mongoose from "mongoose";

const dailyDownloadsModsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  modId: {
    type: Number,
    required: true
  },
  totalDownloads: {
    type: Number,
    default: 0
  }
});

// Solo puede haber un documento por fecha
dailyDownloadsModsSchema.index({ date: 1, modId: 1 }, { unique: true });

const dailyDownloadsMods = mongoose.model("dailyDownloadsMods", dailyDownloadsModsSchema);

export default dailyDownloadsMods;
