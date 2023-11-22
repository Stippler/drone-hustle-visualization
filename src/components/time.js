// Die aktuelle Simulationszeit auf einer Uhr oder einfach nur groß in einer Ecke (Quelle: current_time, Achtung: es ist ein String).

import { useDroneStore } from '@/store';
import React from 'react';

const DigitalClock = () => {
    const currentTime = useDroneStore((state)=>state.current_time);

    return (
        <div className="text-center font-mono text-3xl bg-black text-white p-4 rounded-lg">
            {currentTime}
        </div>
    );
};

export default DigitalClock;
