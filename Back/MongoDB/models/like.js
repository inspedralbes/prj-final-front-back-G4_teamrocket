import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    modId: {
        type: Number,
        required: true
    },
    createdAt: { 
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    }
});

const Like = mongoose.model('Like', LikeSchema);

export default Like;