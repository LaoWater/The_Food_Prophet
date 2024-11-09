// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from '../GraphUI';

const StomachFullnessGraph = () => {
  const [data, setData] = useState([{ time: 0, fullness: 0 }]);
  const [fullness, setFullness] = useState(0.5);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const svgRef = useRef();
  const mealsRef = useRef([]); // Start with an empty array, no initial meal data

  // Initialize SVG element with D3 and set up gradients and axes
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 800 400')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', '#f0f0f0')
      .style('border-radius', '10px');

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

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,350)');

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50,0)');
  }, []);

  // Function to calculate the meal contribution using exponential decay
  const calculateMealContribution = (beta, timeDifference) => {
    const k = 0.3; // Decay constant; adjust this to control the decay rate
    return beta * Math.exp(-k * timeDifference);
  };

  // Updates data over time based on the new stomach fullness algorithm
  // Real World Simulation: 1 second = 1 hour 
  useEffect(() => {
    if (isPaused) return;

    const simulation_speed = 100 // Run simulation every X ms. Together with function_time_scale, it will give rise to simulation speed compared to Reality.

    const interval = setInterval(() => {
      let function_time_scale = 0.07 // Match Reality with 0.2s simulation run speed. 5.555555555555556e-5; Recommended simulation speed: 0.015
      setTime(prevTime => {
        const newTime = +(prevTime + function_time_scale).toFixed(5); // Eg. Advance time by 0.01*h(hours). Simulating per 0.2 seconds (current simulation time dimension), 5x Reality
                                                       // a 0.01*h increase = 36 secondds, 36x Reality
                                                       // To Match reality, no need to infere simulation speed, as this is kept for offering graph Flow, But can match it using function_time_scale variable. In this example, it would mean decreasing 0.01 by (5x36)
        console.log("Current Time (Current Hour in Simulation):", newTime);

        // Remove meals older than 12 hours
        mealsRef.current = mealsRef.current.filter(meal => {
          const isRecent = (newTime - meal.timeEaten) < 12;
          console.log(`Meal at time(hour) ${meal.timeEaten} is ${isRecent ? "stil contributing to Fullness" : "completely cleared from Digestive System"}`);
          return isRecent;
        });

        // Calculate fullness (lambda) as the sum of contributions from all meals
        let newFullness = 0;
        mealsRef.current.forEach((meal, index) => {
          const timeDifference = (newTime - meal.timeEaten) * 1; // Normalize N to simulate real time passing
          if (timeDifference > 0) {
            const contribution = calculateMealContribution(meal.beta, timeDifference);
            console.log(`Time difference = ${timeDifference}, meal beta = ${meal.beta}`);
            newFullness += contribution;
            console.log(`Meal ${index + 1} at ${meal.timeEaten} contributes ${contribution.toFixed(3)} to fullness.`);
          }
        });

        // Cap fullness at 1
        newFullness = Math.min(newFullness, 1);
        console.log("Calculated Fullness:", newFullness);

        setFullness(newFullness);
        setData(prevData => {
          const newData = [...prevData, { time: newTime, fullness: newFullness }];
          // console.log("Data Array Length:", newData.length);
          const weekly_threshold = 168 * simulation_speed // Construct a week's worth of data in time dimension
          return newData.length > weekly_threshold ? newData.slice(newData.length - weekly_threshold) : newData; // Keep track of last 840 points -> (at 0.2*reality speed) -> meaning 840 * 0.2 hours = 168 hours = 7 days
        });

        return newTime;
      }); 
    }, simulation_speed);

    return () => clearInterval(interval);
  }, [isPaused]);



  // Update the graph each time data or time changes
  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const xScale = d3.scaleLinear()
      .domain([0,time + 10]) // Show 24 hours continous graph
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
    const graphEnter = graph.enter().append('g')
      .attr('class', 'graph')

    const graphMerge = graphEnter.merge(graph);

    const path = graphMerge.selectAll('.line')
      .data([data]);

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
      .attr('d', line);

    path.exit().remove();
  }, [data, time]);

  // Handler to increase fullness when eating a meal
  const handleEat = (amount) => {
    mealsRef.current.push({
      beta: amount,       // Amount of food (0 to 1)
      timeEaten: time,    // Current time
    });
    // Fullness will update in the next interval
  };

  // Handler to reset the graph and variables to initial state
  const handleReset = () => {
    setData([{ time: 0, fullness: 0 }]);
    setFullness(0);
    setTime(0);
    setIsPaused(false);
    mealsRef.current = []; // Reset meals
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
