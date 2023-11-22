// TODO: implement a plot for the current price curve. It is always for the next 24 hours and accessible in 
// please rotate the x labels and assign Euro to y axis and times to x axis in hh:mm:ss format it is accessible in state.price_profile

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDroneStore } from '@/store'; // Adjust the import path

const PriceCurve = () => {
    const svgRef = useRef();
    const { price_profile } = useDroneStore(state => ({
        price_profile: state.price_profile
    }));

    const [timeWindow, setTimeWindow] = useState(8 * 3600); // 8 hours in seconds

    useEffect(() => {
        if (!price_profile || price_profile.length === 0) return;

        const totalMinutes = price_profile.length; // Assuming 24 hours * 60 minutes

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 50, left: 60 },
            width = 400 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleLinear()
            // .domain([0, totalMinutes - 1])
            .domain([0, timeWindow / 60])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([d3.min(price_profile), d3.max(price_profile)])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(x).tickFormat(d => {
            const hours = Math.floor(d / 60);
            const minutes = d % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }).ticks(8); // Only show 24 ticks for 24 hours

        const yAxis = d3.axisLeft(y).tickFormat(d => `€${d.toFixed(2)}`);

        // Append the axes to the svg
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(yAxis);

        // Add Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Price (€)");

        // Line function
        const line = d3.line()
            .x((_, i) => x(i))
            .y(price => y(price));

        // Draw the line for the price curve
        svg.append("path")
            .datum(price_profile)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        return () => {
            svg.selectAll("*").remove();
        };
    }, [price_profile]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default PriceCurve;
