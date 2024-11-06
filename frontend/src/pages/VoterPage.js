import React, { useState } from 'react';
import VoterSlider from '../components/VoterSlider';

const VoterPage = () => {
    const [compatibilityResult, setCompatibilityResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCompatibilityResult = (result) => {
        console.log('VoterPage received result:', result);
        setCompatibilityResult(result);
        setIsLoading(false);
    };

    // Helper function to get color based on match percentage
    const getMatchColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-600';
        if (percentage >= 60) return 'bg-blue-600';
        if (percentage >= 40) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    // Helper function to format issue names
    const formatIssueName = (issue) => {
        return issue
            .replace(/([A-Z])/g, ' $1')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Helper function to get match description
    const getMatchDescription = (percentage) => {
        if (percentage >= 80) return 'Strong Match';
        if (percentage >= 60) return 'Moderate Match';
        if (percentage >= 40) return 'Weak Match';
        return 'Significant Difference';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Hero Section */}
            <div className="bg-white shadow mb-6 w-full">
                <div className="max-w-4xl mx-auto py-8 px-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Political Match</h1>
                    <p className="text-lg text-gray-600">Compare your positions on key issues with candidates</p>
                </div>
            </div>

            <div className="w-full max-w-4xl px-6 space-y-8 pb-12">
                {/* Voter Form Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <VoterSlider 
                            onSubmitResult={handleCompatibilityResult}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VoterPage;