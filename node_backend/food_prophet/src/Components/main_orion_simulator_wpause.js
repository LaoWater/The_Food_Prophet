// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from './GraphUI';
import { ArchetypeSimulator} from './Workers/archtype_simulators'; // Adjust the path as needed

const StomachFullnessGraph = () => {
  const [data, setData] = useState([{ time: 0, fullness: 0 }]);
  const [fullness, setFullness] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [isWorkerReady, setIsWorkerReady] = useState(false); // Worker readiness
  const svgRef = useRef();
  const workerRef = useRef(null);
  const isPageActive = useRef(true);
  const simulatorRef = useRef(null);

  // 1. Load data from localStorage on mount
  useEffect(() => {
    console.log('Component mounted. Attempting to load data from localStorage.');
    const storedData = localStorage.getItem('fullnessData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      console.log('Data loaded from localStorage:', parsedData);
    } else {
      console.log('No data found in localStorage.');
    }
  }, []);

  // 2. Initialize the worker
  useEffect(() => {
    console.log('Initializing web worker.');
    workerRef.current = new Worker(new URL('Workers/KS_fullness_worker.js', import.meta.url));

    // Receive updates from the worker
    workerRef.current.onmessage = (event) => {
      const { type, time: workerTime, fullness: workerFullness, data: workerData } = event.data;
      console.log('Message received from worker:', event.data);

      if (type === 'STORE_DATA') {
        localStorage.setItem('fullnessData', JSON.stringify(workerData));
        console.log('Data stored to localStorage by worker:', workerData);
      } else if (type === 'RESET_COMPLETE') {
        setData([{ time: 0, fullness: 0 }]);
        setFullness(0);
        setTime(0);
        console.log('Data and state reset complete.');
      } else {
        setTime(workerTime);
        setFullness(workerFullness);
        console.log(`Updating state: time=${workerTime}, fullness=${workerFullness}`);

        setData((prevData) => {
          const newData = [...prevData, { time: workerTime, fullness: workerFullness }];
          console.log('New data length:', newData.length);
          const weeklyThreshold = 2200; // Adjust based on data frequency
          console.log('Weekly threshold set to:', weeklyThreshold);

          if (newData.length > weeklyThreshold) {
            const trimmedData = newData.slice(newData.length - weeklyThreshold);
            console.log(`Data exceeds threshold. Trimming data. New data length: ${trimmedData.length}`);
            return trimmedData;
          }

          return newData;
        });
      }

      // Set worker as ready after receiving the first data point
      if (!isWorkerReady) {
        setIsWorkerReady(true);
        console.log('Worker is ready.');
      }
    };

    // Handle worker errors
    workerRef.current.onerror = (error) => {
      console.error('Error in web worker:', error);
    };

    // Cleanup on component unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate(); // Clean up the worker on component unmount
        console.log('Web worker terminated.');
      }
    };
  }, [isWorkerReady]); // Depend only on isWorkerReady

  // 3. Initialize the simulator after the worker is set up
  useEffect(() => {
    if (isWorkerReady && workerRef.current && !isPaused) { // Start only if not paused
      simulatorRef.current = new ArchetypeSimulator(workerRef.current);
      simulatorRef.current.startSimulation('ModernMan');
      console.log('Archetype simulation started for Modern Man.');
    }

    // Cleanup on component unmount or when paused
    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stopSimulation();
        console.log('Archetype simulation stopped.');
      }
    };
  }, [isWorkerReady, isPaused]); // Added isPaused to dependencies

  // 4. Initialize the SVG with D3 and set up gradients, axes, and labels
  useEffect(() => {
    console.log('Initializing D3 SVG.');
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 850 400')
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

    console.log('D3 SVG initialized.');
  }, []);

  // 5. Update the graph each time `data` or `time` changes
  useEffect(() => {
    if (data.length === 0) {
      console.warn('Data array is empty. Skipping graph update.');
      return;
    }

    if (!isPageActive.current) {
      console.log('Page is inactive. Skipping graph update.');
      return;
    }

    if (isPaused) { console.log ('Script Paused.. Awaiting..') 
      return; }

    console.log('Updating graph with new data.');
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
      .text('Hara Hachi Bu')  
      .style('font-size', '10px')
      .style('fill', 'blue')
      .attr('text-anchor', 'start');

    console.log('Graph updated successfully.');
  }, [data, time, isPaused]);

  // 6. Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log(`Visibility changed to: ${document.visibilityState}`);
      if (document.visibilityState === 'visible') {
        isPageActive.current = true;
        console.log('Page is active. Reloading data from localStorage.');
        const storedData = localStorage.getItem('fullnessData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
          console.log('Data reloaded from localStorage:', parsedData);
        }
      } else {
        isPageActive.current = false;
        console.log('Page is inactive.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('Visibility change listener added.');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log('Visibility change listener removed.');
    };
  }, []);

  // 7. Handler to add a meal
  const handleEat = (amount) => {
    console.log(`handleEat called with amount: ${amount}`);
    if (workerRef.current && !isPaused) { // Prevent adding meals when paused
      workerRef.current.postMessage({ type: 'ADD_MEAL', amount });
      console.log('ADD_MEAL message sent to worker.');
    } else {
      console.warn('Cannot add meal. Worker is paused or not initialized.');
    }
  };

  // 8. Handler to reset the graph and worker state
  const handleReset = () => {
    console.log('handleReset called.');
    setData([{ time: 0, fullness: 0 }]);
    setFullness(0);
    setTime(0);
    localStorage.removeItem('fullnessData'); // Clear stored data on reset
    console.log('LocalStorage cleared.');

    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'RESET' }); // Send reset message to worker
      console.log('RESET message sent to worker.');
    } else {
      console.warn('Worker is not initialized.');
    }
  };

  // 9. Handler to toggle pause/resume
  const handlePauseResume = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (workerRef.current) {
      if (newPausedState) {
        workerRef.current.postMessage({ type: 'PAUSE' });
        console.log('PAUSE message sent to worker.');
      } else {
        workerRef.current.postMessage({ type: 'RESUME' });
        console.log('RESUME message sent to worker.');
      }
    }
  };

  // Render the UI with title and controls
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h2>Modern Man Simulation</h2>
      {/* Pause/Resume/Reset Buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handlePauseResume}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>
      <GraphUI 
        svgRef={svgRef} 
        fullness={fullness} 
        handleEat={handleEat} 
        handleReset={handleReset} 
        isPaused={isPaused} 
        setIsPaused={setIsPaused} 
      />
    </div>
  );
};

export default StomachFullnessGraph;
