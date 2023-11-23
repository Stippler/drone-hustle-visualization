// Evtl. noch ein Feld, wo man Infos über alle waiting/charging/finished Batterien bekommt (Quelle: batteries/waiting_batteries, batteries/charging_batteries, batteries/finished_batteries) und auch über charge requests (Quelle: pending_charge_requests).
// Also add controls over changing the state and stuff...

import React, { useState } from 'react';

const TextField = ({ name, placeholder, type = "text", required = false, step = "any" }) => (
    <input
        className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
    />
);

const TextAreaField = ({ name, placeholder, required = false }) => (
    <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
        name={name}
        placeholder={placeholder}
        required={required}
    ></textarea>
);

const SubmitButton = ({ text }) => (
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
    >
        {text}
    </button>
);

const TabButton = ({ children, active, onClick }) => (
    <button
        className={`px-4 py-2 rounded-t-lg text-sm font-medium focus:outline-none ${active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'
            }`}
        onClick={onClick}
    >
        {children}
    </button>
);



const ApiInteractionForms = () => {
    const [activeTab, setActiveTab] = useState('removeBatteries');
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const action = form.getAttribute('action');
        const method = form.getAttribute('method');

        // Example of handling the form submission
        // You can adapt this to make an actual API call
        fetch(action, {
            method: method,
            body: data,
        }).then(response => {
            // Handle response
            console.log('Response:', response);
        }).catch(error => {
            // Handle error
            console.error('Error:', error);
        });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex border-b border-gray-300">
                <TabButton active={activeTab === 'removeBatteries'} onClick={() => setActiveTab('removeBatteries')}>
                    Remove All Batteries
                </TabButton>
                <TabButton active={activeTab === 'addBattery'} onClick={() => setActiveTab('addBattery')}>
                    Add Battery
                </TabButton>
                <TabButton active={activeTab === 'requestCharging'} onClick={() => setActiveTab('requestCharging')}>
                    Request Charging
                </TabButton>
                <TabButton active={activeTab === 'exchangeBattery'} onClick={() => setActiveTab('exchangeBattery')}>
                    Exchange Battery
                </TabButton>
                <TabButton active={activeTab === 'demandEstimation'} onClick={() => setActiveTab('demandEstimation')}>
                    Demand Estimation
                </TabButton>
                <TabButton active={activeTab === 'updatePriceProfile'} onClick={() => setActiveTab('updatePriceProfile')}>
                    Update Price Profile
                </TabButton>
                <TabButton active={activeTab === 'restartSimulation'} onClick={() => setActiveTab('restartSimulation')}>
                    Restart Simulation
                </TabButton>
            </div>

            <div className="p-4 border border-t-0 border-gray-300 rounded-b-lg">
                {activeTab === 'removeBatteries' && (
                    <form onSubmit={handleSubmit} method="DELETE" action="/batteries">
                        <SubmitButton text="Remove All Batteries" />
                    </form>
                )}
                {activeTab === 'addBattery' && (
                    <form onSubmit={handleSubmit} method="POST" action="/battery" className="mb-4 space-y-4">
                        <TextField name="battery_id" placeholder="Battery ID" required />
                        <TextField name="state_of_charge" placeholder="State Of Charge" type="number" step="0.01" required />
                        <TextField name="capacity_kwh" placeholder="Capacity (kWh)" type="number" step="0.01" required />
                        <TextField name="max_power_watt" placeholder="Max Power (Watt)" type="number" required />
                        <SubmitButton text="Add Battery" />
                    </form>
                )}

                {activeTab === 'requestCharging' && (
                    <form onSubmit={handleSubmit} method="POST" action="/charge-request" className="space-y-4">
                        <TextField name="drone_id" placeholder="Drone ID" required />
                        <TextField name="state_of_charge" placeholder="State Of Charge" type="number" step="0.01" required />
                        <TextField name="capacity_kwh" placeholder="Capacity (kWh)" type="number" step="0.01" required />
                        <TextField name="max_power_watt" placeholder="Max Power (Watt)" type="number" required />
                        <TextField name="delta_eta_seconds" placeholder="ETA (seconds)" type="number" required />
                        <SubmitButton text="Request Charging" />
                    </form>
                )}


                {activeTab === 'exchangeBattery' && (
                    <form onSubmit={handleSubmit} method="PUT" action="/exchange" className="space-y-4">
                        <TextField name="drone_id" placeholder="Drone ID" required />
                        <TextField name="state_of_charge" placeholder="State Of Charge" type="number" step="0.01" required />
                        <SubmitButton text="Exchange Battery" />
                    </form>
                )}

                {activeTab === 'demandEstimation' && (
                    <form onSubmit={handleSubmit} method="PUT" action="/demand-estimation" className="space-y-4">
                        <TextAreaField name="demand" placeholder="Enter demand events (comma-separated seconds after midnight)" required />
                        <SubmitButton text="Submit Demand Estimation" />
                    </form>
                )}


                {activeTab === 'updatePriceProfile' && (
                    <form onSubmit={handleSubmit} method="PUT" action="/price-profile" className="space-y-4">
                        <TextAreaField name="price" placeholder="Enter price profile (comma-separated values)" required />
                        <TextField name="resolution_s" placeholder="Resolution in seconds" type="number" required />
                        <SubmitButton text="Update Price Profile" />
                    </form>
                )}


                {activeTab === 'restartSimulation' && (
                    <form onSubmit={handleSubmit} method="POST" action="/restart" className="space-y-4">
                        <TextField name="start_time" placeholder="Start Time (seconds since midnight)" type="number" required />
                        <SubmitButton text="Restart Simulation" />
                    </form>
                )}

            </div>
        </div>
    );
};

export default ApiInteractionForms;
