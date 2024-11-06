const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    googleId: String,
    linkedinId: String,
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    preferences: {
        receiveUpdates: {
            type: Boolean,
            default: true
        },
        privacySettings: {
            shareData: {
                type: Boolean,
                default: false
            }
        }
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);