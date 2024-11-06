// /backend/services/compatibilityService.js
const calculateCompatibility = (userPositions, candidatePositions) => {
    const issues = Object.keys(userPositions);
    let totalDifference = 0;
    const issueMatches = {};

    issues.forEach(issue => {
        const difference = Math.abs(userPositions[issue] - candidatePositions[issue]);
        const matchPercentage = ((5 - difference) / 5) * 100;
        totalDifference += difference;
        issueMatches[issue] = Math.round(matchPercentage);
    });

    const overallCompatibility = Math.round(((50 - totalDifference) / 50) * 100);

    return {
        overallMatch: Math.max(0, overallCompatibility),
        issueMatches
    };
};

module.exports = { calculateCompatibility };