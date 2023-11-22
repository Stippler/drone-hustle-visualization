import React from 'react';

const Card = ({ title, children }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4" style={{ maxWidth: 'fit-content' }}>
            <div className="mb-4 flex justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="cursor-pointer">?</span> {/* Replace with an icon as needed */}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Card;
