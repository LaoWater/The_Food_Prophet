// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from './GraphUI';

const StomachFullnessGraph = () => {
  const [data, setData] = useState([{ time: 0, fullness: 0 }]);
  const [fullness, setFullness] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const svgRef = useRef();
  const workerRef = useRef(null);

  // Initialize the worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('KS_fullness_worker.js', import.meta.url));

    // Receive updates from the worker
    workerRef.current.onmessage = (event) => {
      const { time, fullness } = event.data;
      setTime(time);
      setFullness(fullness);
      setData((prevData) => {
        const newData = [...prevData, { time, fullness }];
        const weeklyThreshold = 168 * 100; // Keep a week's worth of data points
        return newData.length > weeklyThreshold ? newData.slice(newData.length - weeklyThreshold) : newData;
      });
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate(); // Clean up the worker on component unmount
      }
    };
  }, []);

  // Handler to add a meal
  const handleEat = (amount) => {
    workerRef.current.postMessage({ type: 'ADD_MEAL', amount });
  };

  // Handler to reset the graph and worker state
  const handleReset = () => {
    setData([{ time: 0, fullness: 0 }]);
    setFullness(0);
    setTime(0);
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'RESET' }); // Send reset message to worker
    }
  };

  // Initialize the SVG with D3 and set up gradients, axes, and labels
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 800 400')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', '#f0f0f0')
      .style('border-radius', '10px');

    // Gradient for the fullness line
    svg.append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 400)
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#d50000' },
        { offset: '100%', color: '#00c853' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    // Axes
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,350)');

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50,0)');

    // Axis Labels
    svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'end')
      .attr('x', 750)
      .attr('y', 380)
      .text('Time (Hours)')
      .style('font-size', '12px')
      .style('fill', '#555');

    svg.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'end')
      .attr('x', -30)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .text('Fullness Level')
      .style('font-size', '12px')
      .style('fill', '#555');
  }, []);

  // Update the graph each time `data` or `time` changes
  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const xScale = d3.scaleLinear()
      .domain([0, time + 10])
      .range([50, 750]);

    const yScale = d3.scaleLinear()
      .domain([0, 1]) // Fullness ranges from 0 to 1
      .range([350, 50]);

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

    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.fullness))
      .curve(d3.curveMonotoneX);

    const graph = svg.selectAll('.graph').data([null]);
    const graphEnter = graph.enter().append('g').attr('class', 'graph');
    const graphMerge = graphEnter.merge(graph);

    const path = graphMerge.selectAll('.line').data([data]);
    path.enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .merge(path)
      .attr('d', line);

    path.exit().remove();

    // Hara Hachi Bu Line
    svg.selectAll('.hara-hachi-bu-line').remove(); // Clear previous line if exists
    svg.append('line')
      .attr('class', 'hara-hachi-bu-line')
      .attr('x1', 50)
      .attr('y1', yScale(0.8)) // Position at fullness level 0.8
      .attr('x2', 750)
      .attr('y2', yScale(0.8))
      .attr('stroke', 'blue')
      .attr('stroke-dasharray', '4 2')
      .attr('stroke-width', 1);

    svg.selectAll('.hara-hachi-bu-text').remove(); // Clear previous text if exists
    svg.append('text')
      .attr('class', 'hara-hachi-bu-text')
      .attr('x', 760)
      .attr('y', yScale(0.8) + 5)
      .text('Hara Hachi Bu (80%)')
      .style('font-size', '10px')
      .style('fill', 'blue')
      .attr('text-anchor', 'start');
  }, [data, time]);

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
