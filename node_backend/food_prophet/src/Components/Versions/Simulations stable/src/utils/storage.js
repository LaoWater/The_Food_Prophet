// src/utils/storage.js

// Function to load data from localStorage
export const loadFullnessData = () => {
  try {
    const storedData = localStorage.getItem('fullnessData');
    return storedData ? JSON.parse(storedData) : [{ time: 0, fullness: 0 }];
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return [{ time: 0, fullness: 0 }];
  }
};

// Function to save data to localStorage
export const saveFullnessData = (data) => {
  try {
    localStorage.setItem('fullnessData', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

// Function to clear data from localStorage
export const clearFullnessData = () => {
  try {
    localStorage.removeItem('fullnessData');
  } catch (error) {
    console.error('Failed to clear data from localStorage:', error);
  }
};
