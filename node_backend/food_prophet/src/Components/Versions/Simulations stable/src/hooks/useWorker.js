// src/hooks/useWorker.js

import { useEffect, useRef, useState } from 'react';
import { saveFullnessData, loadFullnessData } from '../utils/storage';
import { trimData } from '../utils/dataProcessing';

const useWorker = (isPaused, setIsWorkerReady, dataThreshold = 168) => {
  const workerRef = useRef(null);
  const [data, setData] = useState(loadFullnessData());

  useEffect(() => {
    // Initialize the worker
    workerRef.current = new Worker(new URL('../workers/fullnessWorker.js', import.meta.url));

    // Handle messages from the worker
    workerRef.current.onmessage = (event) => {
      const { type, time, fullness, data: workerData } = event.data;

      if (type === 'STORE_DATA') {
        saveFullnessData(workerData);
        console.log('Data stored to localStorage by worker:', workerData);
      } else if (type === 'RESET_COMPLETE') {
        setData([{ time: 0, fullness: 0 }]);
        console.log('Data and state reset complete.');
      } else {
        setData((prevData) => {
          const newData = [...prevData, { time, fullness }];
          const trimmedData = trimData(newData, dataThreshold);
          saveFullnessData(trimmedData);
          return trimmedData;
        });
        setIsWorkerReady(true);
        console.log(`Received update from worker: time=${time}, fullness=${fullness}`);
      }
    };

    // Handle worker errors
    workerRef.current.onerror = (error) => {
      console.error('Error in web worker:', error);
    };

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        console.log('Web worker terminated.');
      }
    };
  }, [dataThreshold, setIsWorkerReady]);

  // Function to send messages to the worker
  const postMessageToWorker = (message) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
    }
  };

  return { data, postMessageToWorker };

};

export default useWorker;
