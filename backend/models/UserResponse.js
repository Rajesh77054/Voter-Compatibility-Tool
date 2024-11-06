const mongoose = require('mongoose');

const userResponseSchema = new mongoose.Schema({
    positions: {
        taxation: { type: Number, required: true, min: 1, max: 5 },
        smallBusiness: { type: Number, required: true, min: 1, max: 5 },
        energy: { type: Number, required: true, min: 1, max: 5 },
        healthcare: { type: Number, required: true, min: 1, max: 5 },
        gunRights: { type: Number, required: true, min: 1, max: 5 },
        education: { type: Number, required: true, min: 1, max: 5 },
        immigration: { type: Number, required: true, min: 1, max: 5 },
        socialWelfare: { type: Number, required: true, min: 1, max: 5 },
        climateChange: { type: Number, required: true, min: 1, max: 5 },
        foreignPolicy: { type: Number, required: true, min: 1, max: 5 }
    },
    results: [{
        candidateId: {
            type: String  // Changed from ObjectId to String
        },
        compatibilityScore: {
            type: Number,
            required: true
        },
        issueMatches: {
            type: Map,
            of: Number
        }
    }],
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

module.exports = mongoose.model('UserResponse', userResponseSchema);