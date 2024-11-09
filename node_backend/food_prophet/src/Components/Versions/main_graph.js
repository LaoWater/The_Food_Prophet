// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphUI } from '../GraphUI';

class Meal {
  constructor(beta) {
    this.beta = beta; // Food quantity
    this.age = 0; // Age in hours since the meal was eaten
  }

  // Calculate decay contribution based on age, decaying faster initially
  decayContribution() {
    return this.beta / Math.max(this.age, 1);
  }

  // Increment the age of the meal over time
  updateAge() {
    this.age += 0.1; // Increment age by 0.1 hours (6 minutes)
  }
}

const StomachFullnessGraph = () => {
  // State variables for tracking fullness, time, pause status, and active meals
  const [data, setData] = useState([{ time: 0, fullness: 0.5 }]);
  const [fullness, setFullness] = useState(0.5);
  const svgRef = useRef();
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [meals, setMeals] = useState([]); // Track all meals

  // Initialize SVG with D3
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 800 400')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', '#f0f0f0')
      .style('border-radius', '10px');

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', 700)
      .attr('height', 300)
      .attr('transform', 'translate(50,50)');

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

  // Manage fullness over time with active meals and decay
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = +(prevTime + 0.1).toFixed(1);

        // Update meal ages and remove meals older than 12 hours
        setMeals(currentMeals => {
          const updatedMeals = currentMeals.map(meal => {
            meal.updateAge();
            return meal;
          }).filter(meal => meal.age <= 12);

          // Calculate total fullness (lambda) based on active meals
          const newFullness = updatedMeals.reduce(
            (total, meal) => total + meal.decayContribution(),
            0
          );

          // Add new data point and update fullness state
          setData(prevData => {
            const newData = [...prevData, { time: newTime, fullness: newFullness }];
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
          });

          setFullness(newFullness);
          return updatedMeals;
        });

        return newTime;
      });
    }, 300); // Update every 6 minutes (0.1 hours)

    return () => clearInterval(interval);
  }, [isPaused]);

  // Update D3 graph each time data or time changes
  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const xScale = d3.scaleLinear()
      .domain([Math.max(0, time - 50), time + 10])
      .range([50, 750]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
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
      .attr('clip-path', 'url(#clip)');

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

  // Handler to add a meal with given fullness value
  const handleEat = (amount) => {
    const newMeal = new Meal(amount);
    setMeals([...meals, newMeal]);
  };

  const handleReset = () => {
    setData([{ time: 0, fullness: 0.5 }]);
    setFullness(0.5);
    setTime(0);
    setMeals([]);
    setIsPaused(false);
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
