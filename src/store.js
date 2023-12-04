import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/*
export const useDroneStore = create()(
    immer((set) => ({
        droneState: {
            "current_time": 3600,
            "optimized_schedule": [[]],
            "unoptimized_schedule": [[]],
            "price_profile": [],
            "batteries": {
                "waiting": [],
                "charging": [],
                "finished": []
            },
            "demand_events": [],
            "battery_prognosis": {
                "waiting_battery_prognosis": [],
                "finished_battery_prognosis": []
            },
            "pending_charge_requests": [],
        }
    })),
)
*/

export const useDroneStore = create()(
    immer((set) => ({
        loading: true,
        current_time: '',
        optimized_schedule: [[]],
        unoptimized_schedule: [[]],
        price_profile: [],
        batteries: {
            waiting: [],
            charging: [],
            finished: []
        },
        demand_events: [],
        battery_prognosis: {
            waiting_battery_prognosis: [],
            finished_battery_prognosis: []
        },
        pending_charge_requests: [],
        updateState: async () => {
            try {
                // 'https://f4r.ict.tuwien.ac.at:443/visualisation'
                const response = await fetch('http://localhost:8009/visualisation');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                // Update the state with the new data
                set((state) => {
                    Object.keys(data).forEach(key => {
                        state[key] = data[key];
                    });
                    state.loading=false;
                });
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        },
    })),
)