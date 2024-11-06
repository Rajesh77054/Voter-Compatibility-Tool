import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import '../styles/styles.css';
import RevealSequence from './RevealSequence';

const VoterSlider = ({ onSubmitResult }) => {  // Component function starts here
    // All state declarations
    const [positions, setPositions] = useState({  // Add this missing state
        taxation: 3,
        smallBusiness: 3,
        energy: 3,
        healthcare: 3,
        gunRights: 3,
        education: 3,
        immigration: 3,
        socialWelfare: 3,
        climateChange: 3,
        foreignPolicy: 3
    });
    
    const [candidatePositions, setCandidatePositions] = useState({
        taxation: 4,
        smallBusiness: 2,
        energy: 5,
        healthcare: 4,
        gunRights: 3,
        education: 2,
        immigration: 4,
        socialWelfare: 5,
        climateChange: 5,
        foreignPolicy: 3
    });
    const [matchResults, setMatchResults] = useState({
        issueMatches: {},
        overallMatch: 0
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showReveal, setShowReveal] = useState(false);

    const issues = [
        {
            id: 'taxation',
            title: 'Taxation',
            leftLabel: 'Lower Taxes',
            rightLabel: 'Raise Taxes for Wealthy',
            leftDescription: 'I prefer lower taxes for all income brackets',
            rightDescription: 'I support raising taxes for wealthy individuals and corporations'
        },
        {
            id: 'smallBusiness',
            title: 'Small Business Support',
            leftLabel: 'Free Market',
            rightLabel: 'Targeted Government Aid',
            leftDescription: 'I believe in a free market without government intervention',
            rightDescription: 'I support targeted government aid for small businesses'
        },
        {
            id: 'energy',
            title: 'Energy Policy',
            leftLabel: 'Expand Oil/Gas',
            rightLabel: 'Prioritize Renewable Energy',
            leftDescription: 'I favor expanding oil and gas production',
            rightDescription: 'I prioritize renewable energy sources and sustainability'
        },
        {
            id: 'healthcare',
            title: 'Healthcare',
            leftLabel: 'Private Market',
            rightLabel: 'Expand Public Healthcare',
            leftDescription: 'I believe in a private market for healthcare services',
            rightDescription: 'I support expanding public healthcare options for all citizens'
        },
        {
            id: 'gunRights',
            title: 'Gun Rights',
            leftLabel: 'Second Amendment Protections',
            rightLabel: 'Stricter Gun Laws',
            leftDescription: 'I advocate for strict protections of the Second Amendment',
            rightDescription: 'I believe in implementing stricter gun control laws'
        },
        {
            id: 'education',
            title: 'Education',
            leftLabel: 'Support Public Schools',
            rightLabel: 'Support Alternatives',
            leftDescription: 'I support traditional public schooling and funding',
            rightDescription: 'I believe in alternatives such as charter schools and school vouchers'
        },
        {
            id: 'immigration',
            title: 'Immigration',
            leftLabel: 'Open Borders',
            rightLabel: 'Strict Controls',
            leftDescription: 'I believe in open borders and welcoming immigrants',
            rightDescription: 'I support stricter immigration controls'
        },
        {
            id: 'socialWelfare',
            title: 'Social Welfare Programs',
            leftLabel: 'Minimal Welfare',
            rightLabel: 'Expand Welfare',
            leftDescription: 'I prefer minimal government welfare programs',
            rightDescription: 'I believe in expanding social welfare programs for those in need'
        },
        {
            id: 'climateChange',
            title: 'Climate Change Policy',
            leftLabel: 'Skeptical of Climate Change',
            rightLabel: 'Proactive Climate Action',
            leftDescription: 'I believe climate change is a natural cycle',
            rightDescription: 'I support aggressive measures to combat climate change'
        },
        {
            id: 'foreignPolicy',
            title: 'Foreign Policy',
            leftLabel: 'Isolationist',
            rightLabel: 'Interventionist',
            leftDescription: 'I advocate for a more isolationist approach',
            rightDescription: 'I support active involvement in international affairs'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!positions) {
                console.error('No positions set');
                return;
            }
            // Calculate match percentages for each issue
            const issueMatches = {};
            let totalMatch = 0;
    
            Object.keys(positions).forEach(issue => {
                const voterPos = positions[issue];
                const candidatePos = candidatePositions[issue];
                const difference = Math.abs(voterPos - candidatePos);
                const matchPercentage = 100 - (difference * 25); // 25% per point difference
                issueMatches[issue] = matchPercentage;
                totalMatch += matchPercentage;
            });
    
            const overallMatch = Math.round(totalMatch / Object.keys(positions).length);
    
            // Update match results state
            setMatchResults({
                issueMatches,
                overallMatch
            });
    
            // Show reveal sequence
            setShowReveal(true);
    
            // API call
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-engagement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    positions,
                    matchResults: {
                        issueMatches,
                        overallMatch
                    }
                })
            });
            const data = await response.json();
            setHasSubmitted(true);
            if (onSubmitResult) {
                onSubmitResult(data);
            }
        } catch (error) {
            console.error('Error submitting positions:', error);
            // Maybe add user feedback for errors
            setMatchResults({
                issueMatches: {},
                overallMatch: 0
            });
        }
    };

    const getMatchInterval = (voterPos, candidatePos) => {
        const start = Math.min(voterPos, candidatePos);
        const end = Math.max(voterPos, candidatePos);
        const matchPercentage = 100 - (Math.abs(voterPos - candidatePos) * 25);
        
        const result = {
            fillStart: `${((start - 1) / 4) * 100}%`,
            fillEnd: `${((end - 1) / 4) * 100}%`,
            matchColor: matchPercentage === 100 ? 'green-track' : 
                       matchPercentage >= 75 ? 'blue-track' :
                       matchPercentage >= 50 ? 'yellow-track' : 'red-track'
        };
        
        console.log('getMatchInterval result:', result);
        return result;
    };
       
    const getMatchColor = (percentage) => {
        if (!percentage || percentage === undefined) return 'default-track';
        if (percentage === 100) return 'green-track';
        if (percentage >= 75) return 'blue-track';
        if (percentage >= 50) return 'yellow-track';
        return 'red-track';
    };
    
    const updateMatchInterval = (voterPos, candidatePos) => {
        console.log('updateMatchInterval called with:', voterPos, candidatePos);
        
        const matchInterval = document.querySelector('.match-interval');
        const sliderContainer = document.querySelector('.slider-input-container');
        console.log('Found elements:', { matchInterval, sliderContainer });
        
        const { fillStart, fillEnd, matchColor } = getMatchInterval(voterPos, candidatePos);
        
        if (matchInterval && sliderContainer) {
            // Update positions
            matchInterval.style.setProperty('--interval-start', fillStart);
            matchInterval.style.setProperty('--interval-end', fillEnd);
            
            // Update color classes on both elements
            // Remove color classes from container
            sliderContainer.classList.remove('green-track', 'blue-track', 'yellow-track', 'red-track');
            // Add new color class to container
            sliderContainer.classList.add(matchColor);
            
            console.log('Updated with:', {
                fillStart,
                fillEnd,
                matchColor,
                containerClasses: sliderContainer.classList,
                intervalClasses: matchInterval.classList
            });
        }
    };

    const handleReset = () => {
        setHasSubmitted(false);
        setShowReveal(false); // Reset reveal state
        setPositions({
            taxation: 3,
            smallBusiness: 3,
            energy: 3,
            healthcare: 3,
            gunRights: 3,
            education: 3,
            immigration: 3,
            socialWelfare: 3,
            climateChange: 3,
            foreignPolicy: 3
        });
        if (onSubmitResult) {
            onSubmitResult(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="slider-container">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900">
                    {hasSubmitted && (
                        <span 
                            style={{ 
                                color: matchResults.overallMatch >= 90 ? '#10B981' :
                                    matchResults.overallMatch >= 75 ? '#3B82F6' :
                                    matchResults.overallMatch >= 50 ? '#F59E0B' : '#EF4444'
                            }}
                        >
                            Overall Compatibility: {matchResults.overallMatch}%
                        </span>
                    )}
                </h1>
            </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {issues.map((issue) => (
                        <div key={issue.id} className="slider-item">
                            <div className="slider-header">
                                <h2 className="text-xl font-semibold">
                                    {issue.title}
                                </h2>
                            </div>
                            <div className="slider-controls">
                                {/* Left label group with tooltip */}
                                <div className="label-group left">
                                    <div 
                                        className="slider-label cursor-help"
                                        data-tooltip-id={`left-tooltip-${issue.id}`}
                                        data-tooltip-content={issue.leftDescription}
                                    >
                                        {issue.leftLabel}
                                    </div>
                                    <Tooltip 
                                        id={`left-tooltip-${issue.id}`} 
                                        place="top"
                                        className="text-sm max-w-[200px] tooltip-override"
                                    />
                                </div>

                                <div className="slider-input-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={positions[issue.id]}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            setPositions({
                                                ...positions,
                                                [issue.id]: value
                                            });
                                        }}
                                        className="default-track"
                                        style={{
                                            '--thumb-color': hasSubmitted ? (
                                                matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                            ) : '#3b82f6'
                                        }}
                                    />

                                        {/* Thumb value indicator - always visible */}
                                        <span 
                                            className="value-indicator"
                                            style={{
                                                left: `${((positions[issue.id] - 1) / 4) * 100}%`,
                                                color: hasSubmitted ? (
                                                    matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                    matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                    matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                                ) : '#4B5563'
                                            }}
                                        >
                                            {positions[issue.id]}
                                        </span>
                                        
                                        {/* Show candidate position and match interval after submission */}
                                        {hasSubmitted && (
                                            <>
                                                {/* Match interval fill */}
                                                <div 
                                                    className="match-interval"
                                                    style={{
                                                        '--interval-start': `${Math.min(
                                                            ((positions[issue.id] - 1) / 4) * 100,
                                                            ((candidatePositions[issue.id] - 1) / 4) * 100
                                                        )}%`,
                                                        '--interval-end': `${100 - Math.max(
                                                            ((positions[issue.id] - 1) / 4) * 100,
                                                            ((candidatePositions[issue.id] - 1) / 4) * 100
                                                        )}%`,
                                                        backgroundColor: matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                                        matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                                        matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                                    }}
                                                />
                                                
                                                {/* Candidate position with value indicator */}
                                                <div 
                                                    className="candidate-position"
                                                    style={{
                                                        left: `${((candidatePositions[issue.id] - 1) / 4) * 100}%`,
                                                        borderColor: matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                                    matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                                    matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                                    }}
                                                >
                                                    <div 
                                                        className="value-indicator"
                                                        style={{ 
                                                            color: matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                                matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                                matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                                        }}
                                                    >
                                                        {candidatePositions[issue.id]}
                                                    </div>
                                                </div>

                                            {/* Match percentage indicator */}
                                            <div 
                                                className="result-indicator"
                                                style={{ 
                                                    color: matchResults.issueMatches?.[issue.id] >= 100 ? '#10B981' :
                                                        matchResults.issueMatches?.[issue.id] >= 75 ? '#3B82F6' :
                                                        matchResults.issueMatches?.[issue.id] >= 50 ? '#F59E0B' : '#EF4444'
                                                }}
                                            >
                                                {matchResults.issueMatches?.[issue.id]}% Match
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right label group with tooltip */}
                                <div className="label-group right">
                                    <div 
                                        className="slider-label cursor-help"
                                        data-tooltip-id={`right-tooltip-${issue.id}`}
                                        data-tooltip-content={issue.rightDescription}
                                    >
                                        {issue.rightLabel}
                                    </div>
                                    <Tooltip 
                                        id={`right-tooltip-${issue.id}`} 
                                        place="top"
                                        className="text-sm max-w-[200px] tooltip-override"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                        {/* Submit and Reset buttons */}
                        <div className="mt-12 space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                                disabled={hasSubmitted}
                            >
                                Calculate Compatibility
                            </button>
                            {hasSubmitted && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                {showReveal && (
                    <RevealSequence
                        matchData={{
                            overallMatch: matchResults.overallMatch,
                            issueMatches: matchResults.issueMatches
                        }}
                        issues={issues}  // Make sure this line is here
                        onComplete={() => {
                            setShowReveal(false);
                            setHasSubmitted(true);
                        }}
                    />
                )}
            </div>
    );
};

export default VoterSlider;