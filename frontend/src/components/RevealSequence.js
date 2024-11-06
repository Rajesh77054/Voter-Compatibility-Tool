import React, { useState, useEffect } from 'react';

const RevealSequence = ({ matchData, onComplete, issues }) => {
    const [stage, setStage] = useState('loading');
    const [countUp, setCountUp] = useState(0);
    
    useEffect(() => {
        if (stage === 'loading') {
            setTimeout(() => setStage('reveal'), 2500);
        }
    }, [stage]);

    useEffect(() => {
        if (stage === 'reveal' && countUp < matchData.overallMatch) {
            const timer = setTimeout(() => {
                setCountUp(prev => Math.min(prev + 1, matchData.overallMatch));
            }, 20);
            return () => clearTimeout(timer);
        }
    }, [stage, countUp, matchData.overallMatch]);

    const getMatchColor = (percentage) => {
        if (percentage >= 90) return 'match-color-green';
        if (percentage >= 70) return 'match-color-blue';
        if (percentage >= 50) return 'match-color-yellow';
        return 'match-color-red';
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'progress-green';
        if (percentage >= 70) return 'progress-blue';
        if (percentage >= 50) return 'progress-yellow';
        return 'progress-red';
    };

    return (
        <div className="reveal-overlay">
            <div className="reveal-background" />

            {stage === 'loading' && (
                <div className="reveal-loading animate-fadeIn">
                    <div className="loading-spinner animate-spin" />
                    <p>Calculating Compatibility...</p>
                </div>
            )}

            {stage === 'reveal' && (
                <div className="reveal-text animate-scaleUp">
                    <h1 className={`reveal-percentage ${getMatchColor(countUp)}`}>
                        {countUp}%
                    </h1>
                    <p className="reveal-subtitle">Overall Match</p>
                    <button
                        onClick={() => setStage('details')}
                        className="reveal-button"
                    >
                        View Details
                    </button>
                </div>
            )}

            {stage === 'details' && (
                <div className="reveal-details animate-fadeIn">
                    <div className="details-container">
                        <div className="details-header">
                            <h2>Issue Breakdown</h2>
                            <h2 className="match-header">Match</h2>
                        </div>
                        <div className="issues-list">
                            {Object.entries(matchData.issueMatches).map(([issueId, match], index) => (
                                <div
                                    key={issueId}
                                    className="issue-item animate-slideUp"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="issue-header">
                                        <span className="issue-name">
                                            {issues.find(issue => issue.id === issueId)?.title || issueId}
                                        </span>
                                        <span className={getMatchColor(match)}>{match}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${getProgressColor(match)}`}
                                            style={{ width: `${match}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={onComplete}
                            className="close-button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevealSequence;