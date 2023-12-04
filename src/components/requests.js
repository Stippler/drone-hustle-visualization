import React from 'react';
import { useDroneStore } from '@/store'; // Adjust the import path to your global state management

const SubmitButton = ({ text, onClick }) => (
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={onClick}
    >
        {text}
    </button>
);

const ExchangeRequests = () => {
    const { pending_exchange_requests, loading } = useDroneStore(state => ({
        pending_exchange_requests: state.pending_exchange_requests,
        loading: state.loading,
    }));

    const handleButtonClick = (id) => {
        console.log(`Button clicked for ID: ${id}`);
        // Add any additional logic you need here
        console.log({ drone_id: id });
        fetch('https://f4r.ict.tuwien.ac.at:443/exchange-completed', {
            method: 'PUT', // Assuming it's a POST request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                drone_id: id, 
                response_uri: "https://bexstream-preprod.beyond-vision.pt/swagger-ieot/#/IEOT/IeotController_processBatteryExchanged"
            }),
        }).then(response => response.json()) // Assuming the server responds with JSON
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    if(loading){
        return <></>
    }

    return (
        <div style={{
            width: '400px',
            minHeight: '300px',
            margin: '10px auto', // center the container
            padding: '10px',
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            alignItems: 'center', // Center items horizontally
            justifyContent: 'flex-start' // Start aligning items from the top
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start', // Align buttons to the start
                gap: '10px', // Use gap to provide spacing between items
                width: '100%' // Ensure the inner div takes the full width of the parent
            }}>
                {Object.entries(pending_exchange_requests).map(([id, request], index) => (
                    <SubmitButton key={index} onClick={() => handleButtonClick(id)} text={`Release ${id}`} />
                ))}
            </div>
        </div>
    );
};

export default ExchangeRequests;
