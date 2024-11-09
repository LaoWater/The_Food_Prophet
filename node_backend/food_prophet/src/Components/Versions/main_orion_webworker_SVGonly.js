import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from '../GraphUI';

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
        console.log("Main thread received from worker:", { time, fullness });
        setTime(time);
        setFullness(fullness);
        setData(prevData => {
          const newData = [...prevData, { time, fullness }];
          console.log("Updated data array:", newData); // Log the data array
          const weeklyThreshold = 168 * 100; // Keep a week's worth of data
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




  // Update the graph each time data or time changes
  useEffect(() => {
    if (data.length === 0) return;
  
    const svg = d3.select(svgRef.current);
  
    const xScale = d3.scaleLinear()
      .domain([Math.max(0, time - 10), time + 10]) // Adjust the time window
      .range([50, 750]);
  
    const yScale = d3.scaleLinear()
      .domain([0, 1]) // Fullness ranges from 0 to 1
      .range([350, 50]);
  
    // Add x-axis
    svg.select('.x-axis').remove(); // Clear existing axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, 350)')
      .call(d3.axisBottom(xScale).ticks(10))
      .append('text')
      .attr('fill', 'black')
      .attr('x', 400)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Time (hours)');
  
    // Add y-axis
    svg.select('.y-axis').remove(); // Clear existing axis
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50, 0)')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('fill', 'black')
      .attr('x', -180)
      .attr('y', -35)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Fullness (%)');
  
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.fullness))
      .curve(d3.curveMonotoneX);
  
    // Append the path to the SVG
    svg.selectAll('.line').remove(); // Clear existing line
    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 3)
      .attr('d', line);
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
