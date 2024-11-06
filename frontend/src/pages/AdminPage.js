import React, { useEffect, useState } from 'react';
import VoterSlider from '../components/VoterSlider';

const AdminPage = () => {
    const [engagementData, setEngagementData] = useState(null);

    useEffect(() => {
        console.log("Starting API request to fetch user engagement data...");
        console.log('API URL being used:', process.env.REACT_APP_API_URL);
        
        fetch(`${process.env.REACT_APP_API_URL}/api/user-engagement`)
            .then(response => response.json())
            .then(data => {
                setEngagementData(data);
                console.log('User engagement data:', data);
            })
            .catch(error => console.error('Error fetching engagement data:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto py-4 px-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-8">
                {/* Voter Compatibility Form Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Voter Compatibility Tool</h2>
                        <VoterSlider />
                    </div>
                </div>

                {/* Engagement Data Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">User Engagement Data</h2>
                        {engagementData ? (
                            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-sm">
                                    {JSON.stringify(engagementData, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="text-gray-500">Loading data...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;