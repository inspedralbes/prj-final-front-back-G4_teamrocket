import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema({
    modId: {
        type: String,
        required: true
    },
    createdAt: { 
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalDislikes: {
        type: Number,
        default: 0
    }
});

ReactionSchema.index({ modId: 1, date: 1 }, { unique: true });

const Reaction = mongoose.model('Reaction', CommentSchema);

export default Reaction;