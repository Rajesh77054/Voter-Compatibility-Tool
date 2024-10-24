import React, { useEffect, useState } from 'react';

const AdminPage = () => {
    const [engagementData, setEngagementData] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/user-engagement`)
            .then(response => response.json())
            .then(data => setEngagementData(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Admin Interface for Customization</h1>
            {engagementData && <pre>{JSON.stringify(engagementData, null, 2)}</pre>}
            {/* Additional admin page functionality */}
        </div>
    );
};

export default AdminPage;
