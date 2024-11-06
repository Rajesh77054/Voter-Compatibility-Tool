// /backend/models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    positions: {
        taxation: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        smallBusiness: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        energy: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        healthcare: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        gunRights: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        education: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        immigration: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        socialWelfare: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        climateChange: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        foreignPolicy: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);
