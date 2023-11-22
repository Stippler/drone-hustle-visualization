import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useDroneStore } from '@/store'; // Adjust the import path

const ScheduleBar = () => {
    const svgRef = useRef();
    const optimized_schedule = useDroneStore(state => state.optimized_schedule);
    const loading = useDroneStore(state => state.loading);


    
    useEffect(() => {
        if (loading) return;

        const schedules = optimized_schedule.schedules[0]; // Assuming we visualize the first schedule

        // Data parsing to identify start and end of each schedule
        const parsedSchedules = schedules.reduce((acc, current, index) => {
            if (current !== -1 && (index === 0 || current !== schedules[index - 1])) {
                acc.push({ batteryId: current, start: index, end: index });
            } else if (current !== -1 && current === schedules[index - 1]) {
                acc[acc.length - 1].end = index;
            }
            return acc;
        }, []);

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 30, left: 40 },
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const x = d3.scaleLinear()
                    .domain([0, schedules.length])
                    .range([0, width]);

        const y = d3.scaleBand()
                    .range([0, height])
                    .domain(parsedSchedules.map(d => d.batteryId))
                    .padding(0.1);

        // Draw bars
        svg.selectAll("rect")
           .data(parsedSchedules)
           .enter()
           .append("rect")
           .attr("x", d => x(d.start))
           .attr("y", d => y(d.batteryId))
           .attr("width", d => x(d.end) - x(d.start))
           .attr("height", y.bandwidth())
           .attr("fill", getColor);

        // Clear the SVG on unmount or before next render
        return () => {
            svg.selectAll("*").remove();
        };
    }, [optimized_schedule]);

    return (
        <svg ref={svgRef}></svg>
    );
};

const getColor = (d) => {
    // Logic to determine color based on the battery id
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
    return colors[d.batteryId % colors.length];
};

export default ScheduleBar;
