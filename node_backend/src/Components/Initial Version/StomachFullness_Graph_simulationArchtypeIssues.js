// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import GraphUI from './GraphUI';
import ArchetypeSimulator from './ArchetypeSimulator'; // Ensure this path is correct
import useWorker from '../hooks/useWorker';
import usePageActivity from '../hooks/usePageActivity';
import { clearFullnessData } from '../utils/storage';

const StomachFullnessGraph = () => {
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [isWorkerReady, setIsWorkerReady] = useState(false); // Worker readiness
  const svgRef = useRef();
  const simulatorRef = useRef(null);

  const isPageActive = usePageActivity(); // Custom hook to track page activity

  // Initialize the worker using the custom hook - Data point for receiving Data
  const { data, postMessageToWorker } = useWorker(isPaused, setIsWorkerReady, 2200); // 2200 as weeklyThreshold
  
  const simulationStartedRef = useRef(false); // Use useRef to persist simulation started state


  

  // Initialize the Archetype simulator after the worker is ready and the page is active
  useEffect(() => {
    if (isWorkerReady && !isPaused && isPageActive.current && 1 == 1 && !simulationStartedRef.current) { // Start only if not paused and page is active
      simulatorRef.current = new ArchetypeSimulator(postMessageToWorker);
      simulatorRef.current.startSimulation('ModernMan');
      simulationStartedRef.current = true; // Set the ref value to true after starting
      console.log('Archetype simulation started for Modern Man.');
    }

    // Cleanup on component unmount or when paused/page becomes inactive
    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stopSimulation();
        console.log('Archetype simulation stopped.');
      }
    };
  }, [isWorkerReady, isPaused, isPageActive, postMessageToWorker]);






  // Handler to add a meal
  const handleEat = (amount) => {
    console.log(`handleEat called with amount: ${amount}`);
    if (!isPaused) { // Prevent adding meals when paused
      postMessageToWorker({ type: 'ADD_MEAL', amount });
      console.log('ADD_MEAL message sent to worker.');
    } else {
      console.warn('Cannot add meal. Simulation is paused.');
    }
  };

  // Handler to reset the simulation
  const handleReset = () => {
    console.log('handleReset called.');
    setIsPaused(false); // Ensure simulation is not paused
    clearFullnessData(); // Clear localStorage
    postMessageToWorker({ type: 'RESET' });
    console.log('RESET message sent to worker.');
  };

  // Handler to toggle pause/resume
  const handlePauseResume = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (newPausedState) {
      postMessageToWorker({ type: 'PAUSE' });
      console.log('PAUSE message sent to worker.');
    } else {
      postMessageToWorker({ type: 'RESUME' });
      console.log('RESUME message sent to worker.');
    }
  };

  return (
    <>
      {isPageActive.current && (
        <GraphUI 
          svgRef={svgRef} 
          fullness={data[data.length - 1]?.fullness || 0} 
          handleEat={handleEat} 
          handleReset={handleReset} 
          isPaused={isPaused} 
          handlePauseResume={handlePauseResume} 
          data={data}
          time={data[data.length - 1]?.time || 0}
        />
      )}
    </>
  );
};

export default StomachFullnessGraph;