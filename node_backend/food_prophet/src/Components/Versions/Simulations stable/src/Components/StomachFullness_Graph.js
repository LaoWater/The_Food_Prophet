// src/components/StomachFullnessGraph.js

import React, { useState, useEffect, useRef } from 'react';
import GraphUI from './GraphUI';
import { ArchetypeSimulator } from './ArchetypeSimulator'; // Ensure this path is correct
import usePageActivity from '../hooks/usePageActivity';

const StomachFullnessGraph = ({ archetype = 'ModernMan' }) => {
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [isWorkerReady, setIsWorkerReady] = useState(false); // Worker readiness
  const [fullness, setFullness] = useState(0);
  const [time, setTime] = useState(0);
  const svgRef = useRef();
  const simulatorRef = useRef(null);
  const isPageActive = usePageActivity(); // Custom hook to track page activity
  const workerRef = useRef(null);
  const [data, setData] = useState([{ time: 0, fullness: 0 }]);
  
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
    workerRef.current = new Worker(new URL('../workers/fullnessWorker.js', import.meta.url));

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

  // 3. Initialize the Archetype simulator after the worker is set up
  useEffect(() => {
    if (isWorkerReady && workerRef.current && !isPaused && archetype !== "Free") { // Start only if not paused
      simulatorRef.current = new ArchetypeSimulator(workerRef.current);
      simulatorRef.current.startSimulation(archetype || 'ModernMan'); // Default to ModernMan if not provided
      console.log('Archetype simulation started for Modern Man.');
    }

    // Cleanup on component unmount or when paused
    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stopSimulation();
        console.log('Archetype simulation stopped.');
      }
    };
  }, [isWorkerReady, isPaused, archetype]);


  // 4. Handler to add a meal
  const handleEat = (amount) => {
    console.log(`handleEat called with amount: ${amount}`);
    if (workerRef.current && !isPaused) { // Prevent adding meals when paused
      workerRef.current.postMessage({ type: 'ADD_MEAL', amount });
      console.log('ADD_MEAL message sent to worker.');
    } else {
      console.warn('Cannot add meal. Worker is paused or not initialized.');
    }
  };

  // 5. Handler to reset the graph and worker state
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

  // 6. Handler to toggle pause/resume
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

  return (
    <>
      {isPageActive.current && (
        <GraphUI 
          svgRef={svgRef} 
          fullness={fullness} 
          handleEat={handleEat} 
          handleReset={handleReset} 
          isPaused={isPaused} 
          handlePauseResume={handlePauseResume} 
          data={data}
          time={time}
          archetype={archetype} // Pass archetype here
        />
      )}
    </>
  );
};

export default StomachFullnessGraph;