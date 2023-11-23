// Graph mit Prognose von Batterie-Vorrat:
// Waiting und finished batteries als Kurve (Quelle: battery_prognosis/waiting_battery_prognosis und battery_prognosis/finished_battery_prognosis) und erwartete Demand-Events als senkrechte Striche (Quelle: demand_events).

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDroneStore } from '@/store'; // Adjust the import path

const BatteryPrognosis = () => {
    const svgRef = useRef();
    const { battery_prognosis, demand_events, loading } = useDroneStore(state => ({
        battery_prognosis: state.battery_prognosis,
        demand_events: state.demand_events,
        loading: state.loading
    }));

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

        const waitingBatteryPrognosis = battery_prognosis.waiting_battery_prognosis[0];
        const finishedBatteryPrognosis = battery_prognosis.finished_battery_prognosis;

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
            .domain([0, timeWindow / 60])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max([...waitingBatteryPrognosis, ...finishedBatteryPrognosis])])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(x).tickFormat(d => {
            const hours = Math.floor(d * 60 / 3600);
            const minutes = Math.floor((d * 60 % 3600) / 60);
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

        // Line function
        const createLine = d3.line()
            .x((_, i) => x(i))
            .y(d => y(d));

        // Draw lines for battery prognosis
        svg.append("path")
            .datum(waitingBatteryPrognosis)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", createLine);

        svg.append("path")
            .datum(finishedBatteryPrognosis)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", createLine);

        demand_events.forEach(eventInSeconds => {
            const eventInMinutes = eventInSeconds / 60; // Convert seconds to minutes
            svg.append("line")
                .attr("x1", x(eventInMinutes))
                .attr("x2", x(eventInMinutes))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "red")
                .attr("stroke-width", 1);
        });

        // Add the legend at the top right
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 100}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "red");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Demand Events")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "Orange");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 30)
            .text("Finished Batteries")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 40)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "Blue");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 50)
            .text("Waiting Batteries")
            .style("font-size", "12px");

        const svgElement = svgRef.current;
        svgElement.addEventListener('wheel', handleWheel);

        return () => {
            svg.selectAll("*").remove();
            svgElement.removeEventListener('wheel', handleWheel);
        };
    }, [battery_prognosis, demand_events, loading]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default BatteryPrognosis;
