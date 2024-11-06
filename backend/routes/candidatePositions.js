const express = require('express');
const router = express.Router();
const CandidatePosition = require('../models/CandidatePosition');
const auth = require('../middleware/auth'); // For protecting admin routes

// Get all candidate positions
router.get('/', async (req, res) => {
    try {
        const positions = await CandidatePosition.find({ active: true });
        res.json({
            status: 'success',
            data: positions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching candidate positions'
        });
    }
});

// Create candidate position
router.post('/', auth, async (req, res) => {
    try {
        const { candidateId, positions } = req.body;

        // Validate required fields
        if (!candidateId || !positions) {
            return res.status(400).json({
                status: 'error',
                message: 'candidateId and positions are required'
            });
        }

        // Validate all position values
        const requiredPositions = [
            'taxation', 'smallBusiness', 'energy', 'healthcare',
            'gunRights', 'education', 'immigration', 'socialWelfare',
            'climateChange', 'foreignPolicy'
        ];

        for (const pos of requiredPositions) {
            if (!positions[pos] || positions[pos] < 1 || positions[pos] > 5) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid value for position: ${pos}. Must be between 1 and 5`
                });
            }
        }

        // Deactivate existing positions
        await CandidatePosition.updateMany(
            { active: true },
            { $set: { active: false } }
        );

        // Create new position
        const candidatePosition = new CandidatePosition({
            candidateId,
            positions,
            active: true
        });

        await candidatePosition.save();

        res.status(201).json({
            status: 'success',
            message: 'Candidate positions created successfully',
            data: candidatePosition
        });
    } catch (error) {
        console.error('Error creating candidate positions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating candidate positions',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Update candidate position
router.put('/:id', auth, async (req, res) => {
    try {
        const { positions } = req.body;
        const candidatePosition = await CandidatePosition.findByIdAndUpdate(
            req.params.id,
            { positions },
            { new: true }
        );
        res.json({
            status: 'success',
            data: candidatePosition
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating candidate positions'
        });
    }
});

module.exports = router;