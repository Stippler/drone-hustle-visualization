// Evtl. noch ein Feld, wo man Infos über alle waiting/charging/finished Batterien bekommt (Quelle: batteries/waiting_batteries, batteries/charging_batteries, batteries/finished_batteries) und auch über charge requests (Quelle: pending_charge_requests).
// Also add controls over changing the state and stuff...

import React from 'react';

const ApiInteractionForms = () => {
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
        <div>
            {/* Remove All Batteries */}
            <form onSubmit={handleSubmit} method="DELETE" action="/batteries">
                <button type="submit">Remove All Batteries</button>
            </form>

            {/* Add a Battery */}
            <form onSubmit={handleSubmit} method="POST" action="/battery">
                {/* ... Battery input fields */}
                <button type="submit">Add Battery</button>
            </form>

            {/* Request for Charging */}
            <form onSubmit={handleSubmit} method="POST" action="/charge-request">
                {/* ... Charging request input fields */}
                <button type="submit">Request Charging</button>
            </form>

            {/* Battery Exchange */}
            <form onSubmit={handleSubmit} method="PUT" action="/exchange">
                {/* ... Battery exchange input fields */}
                <button type="submit">Exchange Battery</button>
            </form>

            {/* Demand Estimation */}
            <form onSubmit={handleSubmit} method="PUT" action="/demand-estimation">
                {/* ... Demand estimation input fields */}
                <button type="submit">Submit Demand Estimation</button>
            </form>

            {/* Update Price Profile */}
            <form onSubmit={handleSubmit} method="PUT" action="/price-profile">
                {/* ... Price profile input fields */}
                <button type="submit">Update Price Profile</button>
            </form>

            {/* Restart Simulation */}
            <form onSubmit={handleSubmit} method="POST" action="/restart">
                {/* ... Simulation restart input fields */}
                <button type="submit">Restart Simulation</button>
            </form>
        </div>
    );
};

export default ApiInteractionForms;
