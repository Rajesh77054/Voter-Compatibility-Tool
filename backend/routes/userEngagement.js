const express = require('express');
const router = express.Router();
const UserResponse = require('../models/UserResponse');
const CandidatePosition = require('../models/CandidatePosition');

// Calculate similarity for a single issue
const calculateIssueSimilarity = (userPosition, candidatePosition) => {
    const difference = Math.abs(userPosition - candidatePosition);
    return Math.round(((5 - difference) / 5) * 100);
};

router.post('/', async (req, res) => {
    try {
        const { positions } = req.body;
        
        // Get active candidate positions
        const candidatePositions = await CandidatePosition.findOne({ active: true });
        
        if (!candidatePositions) {
            return res.json({
                status: 'success',
                data: {
                    overallMatch: 0,
                    issueMatches: Object.keys(positions).reduce((acc, issue) => {
                        acc[issue] = 0;
                        return acc;
                    }, {})
                }
            });
        }

        // Calculate similarity for each issue
        const issueMatches = {};
        let totalSimilarity = 0;
        const issues = Object.keys(positions);

        issues.forEach(issue => {
            const similarity = calculateIssueSimilarity(
                positions[issue],
                candidatePositions.positions[issue]
            );
            issueMatches[issue] = similarity;
            totalSimilarity += similarity;
        });

        // Calculate overall match percentage
        const overallMatch = Math.round(totalSimilarity / issues.length);

        // Save user response
        const userResponse = new UserResponse({
            positions,
            results: [{
                candidateId: candidatePositions.candidateId,
                compatibilityScore: overallMatch,
                issueMatches
            }],
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });
        await userResponse.save();

        res.json({
            status: 'success',
            data: {
                overallMatch,
                issueMatches
            }
        });
    } catch (error) {
        console.error('Error processing user engagement:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error processing compatibility calculation',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Get aggregated engagement data (for admin)
router.get('/', async (req, res) => {
    try {
        const aggregatedData = await UserResponse.aggregate([
            {
                $group: {
                    _id: null,
                    totalResponses: { $sum: 1 },
                    averageScore: {
                        $avg: { 
                            $arrayElemAt: ['$results.compatibilityScore', 0] 
                        }
                    },
                    // Add issue-specific averages
                    issueAverages: {
                        $push: '$positions'
                    }
                }
            }
        ]);

        // Calculate average positions for each issue
        const result = aggregatedData[0] || { 
            totalResponses: 0, 
            averageScore: 0,
            issueAverages: []
        };

        // Process issue averages if there are responses
        if (result.issueAverages?.length > 0) {
            const issues = Object.keys(result.issueAverages[0]);
            result.issueBreakdown = {};
            
            issues.forEach(issue => {
                const sum = result.issueAverages.reduce((acc, pos) => acc + pos[issue], 0);
                result.issueBreakdown[issue] = Math.round((sum / result.totalResponses) * 100) / 100;
            });
        }

        delete result.issueAverages; // Remove raw data from response

        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('Error fetching engagement data:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching engagement data'
        });
    }
});

module.exports = router;