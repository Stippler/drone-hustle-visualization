import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDroneStore } from '@/store'; // Adjust the import path

const CostCurve = () => {
    const svgRef = useRef();
    const { optimized_schedule, unoptimized_schedule, price_profile, loading } = useDroneStore(state => ({
        optimized_schedule: state.optimized_schedule,
        unoptimized_schedule: state.unoptimized_schedule,
        price_profile: state.price_profile,
        loading: state.loading
    }));

    const [timeWindow, setTimeWindow] = useState(8 * 3600); // 8 hours in seconds

    useEffect(() => {
        if (loading) return;

        const optimizedCostCurve = optimized_schedule.cost_curve;
        const unoptimizedCostCurve = unoptimized_schedule.cost_curve;

        // Cumulative costs
        const cumulative = (arr) => arr.map((sum => value => sum += value)(0));
        const cumulativeOptimized = cumulative(optimizedCostCurve);
        const cumulativeUnoptimized = cumulative(unoptimizedCostCurve);

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 40, left: 60 },
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
            .domain([0, timeWindow / optimized_schedule.resolution_seconds])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max([...cumulativeOptimized, ...cumulativeUnoptimized])])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(x).tickFormat(d => {
            const hours = Math.floor(d * optimized_schedule.resolution_seconds / 3600);
            const minutes = Math.floor((d * optimized_schedule.resolution_seconds % 3600) / 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        });
        const yAxis = d3.axisLeft(y);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.2em")
            .attr("dy", "1.20em")
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
            .text("Cost (€)");

        // Line function
        const createLine = d3.line()
            .x((_, i) => x(i))
            .y(d => y(d));

        // Draw lines
        svg.append("path")
            .datum(cumulativeOptimized)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", createLine);

        svg.append("path")
            .datum(cumulativeUnoptimized)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", createLine);

        // Add the legend at the top right
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 100}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "green");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Optimized Cost")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "red");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 30)
            .text("Unoptimized Cost")
            .style("font-size", "12px");

        // ... Zoom functionality can be added similarly to LoadCurve component

        return () => {
            svg.selectAll("*").remove();
        };
    }, [optimized_schedule, unoptimized_schedule, price_profile, timeWindow]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default CostCurve;