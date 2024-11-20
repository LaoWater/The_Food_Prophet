// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from './GraphUI';

const StomachFullnessGraph = () => {
  // State variables for data points, fullness, time, and pause status
  const [data, setData] = useState([{ time: 0, fullness: 0.5 }]);
  const [fullness, setFullness] = useState(0.5); // Initial fullness level
  const svgRef = useRef(); // Reference to the SVG for D3 manipulations
  const [time, setTime] = useState(0); // Time variable to track simulation progress
  const [isPaused, setIsPaused] = useState(false); // Pause state

  // Initialize SVG element with D3 and set up gradients and axes
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 800 400')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', '#f0f0f0')
      .style('border-radius', '10px');

    // Define a clipping path to restrict graph overflow
    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', 700)
      .attr('height', 300)
      .attr('transform', 'translate(50,50)');

    // Create a gradient for the line that changes color based on fullness
    svg.append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 400)
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#d50000' }, // Green at 0% fullness
        { offset: '100%', color:  '#00c853' } // Red at 100% fullness
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    // Append x and y axes groups to the SVG
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,350)');

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50,0)');
  }, []);

  // Updates data over time, reducing fullness at a set digestion rate
  useEffect(() => {
    if (isPaused) return; // Skip update if paused

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = +(prevTime + 0.1).toFixed(1); // Increase time by 0.1 each interval

        // Update fullness level with digestion effect
        setFullness(prevFullness => {
          const digestionRate = 0.005; // Fullness decrease rate
          const newFullness = Math.max(prevFullness - digestionRate, 0); // Ensure fullness doesn't go below 0

          // Add new data point to data array, keeping the array within 100 items
          setData(prevData => {
            const newData = [...prevData, { time: newTime, fullness: newFullness }];
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
          });

          return newFullness;
        });

        return newTime;
      });
    }, 200); // 200ms interval

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isPaused]);

  // Update the graph each time data or time changes
  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    // Define scales for x and y axes
    const xScale = d3.scaleLinear()
      .domain([Math.max(0, time - 50), time + 10]) // Shows last 50 units of time
      .range([50, 750]);

    const yScale = d3.scaleLinear()
      .domain([0, 1]) // Fullness ranges from 0 to 1
      .range([350, 50]);

    // Update axes with animations
    svg.select('.x-axis')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(d3.axisBottom(xScale).ticks(10));

    svg.select('.y-axis')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(d3.axisLeft(yScale).ticks(5));

    // Define the line for the graph
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.fullness))
      .curve(d3.curveMonotoneX);

    // Select or create the group to contain the line graph
    const graph = svg.selectAll('.graph').data([null]);
    const graphEnter = graph.enter().append('g')
      .attr('class', 'graph')
      .attr('clip-path', 'url(#clip)');

    const graphMerge = graphEnter.merge(graph);

    // Bind data to the line and update the path
    const path = graphMerge.selectAll('.line')
      .data([data]);

    // Enter and merge phases for line path updates
    path.enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .merge(path)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr('d', line); // Update path with new data

    // Remove old paths no longer needed
    path.exit().remove();
  }, [data, time]);

  // Handler to increase fullness when eating a meal
  const handleEat = (amount) => {
    setFullness(prevFullness => {
      const updatedFullness = Math.min(prevFullness + amount, 1); // Cap fullness at 1

      setData(prevData => {
        const newData = [...prevData, { time: time, fullness: updatedFullness }];
        return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
      });

      return updatedFullness;
    });
  };

  // Handler to reset the graph and variables to initial state
  const handleReset = () => {
    setData([{ time: 0, fullness: 0.5 }]); // Reset data to initial point
    setFullness(0.5); // Set fullness back to starting value
    setTime(0); // Reset time
    setIsPaused(false); // Unpause if paused
  };

  // Render the UI using the separated GraphUI component
  return (
    <GraphUI 
      svgRef={svgRef} 
      fullness={fullness} 
      handleEat={handleEat} 
      handleReset={handleReset} 
      isPaused={isPaused} 
      setIsPaused={setIsPaused} 
    />
  );
};

export default StomachFullnessGraph;
