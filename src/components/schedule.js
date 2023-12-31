import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDroneStore } from '@/store'; // Adjust the import path

function calculateSecondsSinceMidnight(timeStr) {
    let totalSeconds = 0;
    if (timeStr.includes('days')) {
        const parts = timeStr.split(', ');
        timeStr = parts[1];
    }
    const timeParts = timeStr.split(':').map(Number);
    totalSeconds += timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    return totalSeconds;
}

const ScheduleBar = () => {
    const svgRef = useRef();
    const { optimized_schedule, loading, current_time } = useDroneStore(state => ({
        optimized_schedule: state.optimized_schedule,
        loading: state.loading,
        current_time: state.current_time
    }));

    const timeSinceMidnight = calculateSecondsSinceMidnight(current_time);

    const [timeWindow, setTimeWindow] = useState(8 * 3600); // 8 hours in seconds

    const handleWheel = (event) => {
        event.preventDefault();
        const zoomIntensity = 0.1;
        const scaleChange = event.deltaY * -zoomIntensity;
        // Calculate the new time window, but constrain it between 1 hour and 72 hours
        let newTimeWindow = timeWindow + scaleChange * timeWindow;
        newTimeWindow = Math.min(Math.max(newTimeWindow, 3600), 48 * 3600);
        setTimeWindow(newTimeWindow);
    };

    useEffect(() => {
        if (loading) return;

        const scheduleData = optimized_schedule.schedules[0][0]; // Assuming the first series for illustration
        const processedData = []; // This will be an array of {id, start, end} objects

        let lastId = scheduleData[0];
        let startTime = 0;

        scheduleData.forEach((id, i) => {
            if (id !== lastId || id === -1) {
                if (lastId !== -1) {
                    processedData.push({ id: lastId, start: startTime * 60, end: i * 60 });
                }
                startTime = i;
                lastId = id;
            }
        });

        // Set the dimensions and margins of the graph
        // Set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 50, left: 60 },
            width = 400 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define the scales
        const x = d3.scaleLinear()
            .domain([0, timeWindow]) // 8 hours in seconds
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(processedData.map(d => d.id))
            .range([0, height])
            .padding(0.1);

        // Define the axes
        const xAxis = d3.axisBottom(x).tickFormat(d => {
            d = d+timeSinceMidnight/60;
            const hours = Math.floor(d / 3600);
            const minutes = Math.floor((d % 3600) / 60);
            const seconds = d % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        });

        const yAxis = d3.axisLeft(y);

        // Draw the axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg.append('g')
            .call(yAxis);

        // Draw the bars
        svg.selectAll('rect')
            .data(processedData)
            .enter()
            .append('rect')
            .attr('x', d => x(d.start))
            .attr('width', d => x(d.end) - x(d.start))
            .attr('y', d => y(d.id))
            .attr('height', y.bandwidth())
            .attr('fill', d => getColor(d.id));

        const svgElement = svgRef.current;
        svgElement.addEventListener('wheel', handleWheel);

        return () => {
            svg.selectAll("*").remove();
            svgElement.removeEventListener('wheel', handleWheel);
        };
    }, [optimized_schedule, loading, timeWindow]);

    const getColor = (id) => {
        const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
        return colors[id % colors.length];
    };

    return (
        <svg ref={svgRef}></svg>
    );
};

export default ScheduleBar;