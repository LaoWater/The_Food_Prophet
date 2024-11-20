// src/utils/dataProcessing.js

// Function to trim data based on a threshold
export const trimData = (data, threshold) => {
    if (data.length > threshold) {
      return data.slice(data.length - threshold);
    }
    return data;
  };
  