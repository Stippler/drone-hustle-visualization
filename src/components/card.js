import React from 'react';

const Card = ({ title, text, children }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 relative" style={{ maxWidth: 'fit-content' }}>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="relative flex items-center">
                    <span className="cursor-pointer relative group inline-block text-white bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-300 hover:shadow-outline">
                        ?
                        <div className="absolute 
                            opacity-0 group-hover:opacity-100 
                            bottom-0 left-1/2 transform 
                            -translate-x-1/2 translate-y-full 
                            -mb-1 p-2 text-sm text-white bg-blue-500 
                            rounded-md shadow-lg w-48 transition-opacity duration-300 z-10 hidden group-hover:block">
                            {text}
                        </div>
                    </span>
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Card;
