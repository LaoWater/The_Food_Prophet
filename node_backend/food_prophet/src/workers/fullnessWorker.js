// src/workers/fullnessWorker.js
// Run simulation every simulationSpeed ms. Together with function_time_scale, it will give rise to simulation speed compared to Reality.
// Eg. Match Reality with 0.2s simulation run speed. 5.555555555555556e-5;
// Eg. Advance time by 0.01*h(hours). Simulating per 0.1 seconds (current simulation time dimension), 5x Reality
// a 0.01*h increase = 36 secondds, 36x Reality
// To Match reality, no need to infere simulation speed, as this is kept for offering graph Flow, But can match it using function_time_scale variable. In this example, it would mean decreasing 0.01 by (5x36)
// Function to calculate meal contribution using exponential decay

// src/workers/fullnessWorker.js

let time = 0;
let fullness = 0;
let meals = []; // Store meal data
const simulationSpeed = 100; // Interval in ms for simulation updates
let functionTimeScale = 0.1; // Initial time scale for simulation (controls speed relative to reality)
let speedMultiplier = 1; // Default speed multiplier
let currentArchetype = {
  name: 'ModernMan',
  decayRate: 0.3,
  mealSizeMultiplier: 1
};

let isPaused = false;
let intervalId = null; // To store the interval ID

// Function to calculate meal contribution using exponential decay
const calculateMealContribution = (beta, timeDifference) => {
  return beta * Math.exp(-currentArchetype.decayRate * timeDifference);
};

// Function to update fullness and time
function updateFullness() {
  if (isPaused) {
    return; // Do not proceed if paused
  }

  // Scale time increment based on functionTimeScale and speedMultiplier
  time = +(time + functionTimeScale).toFixed(5); // Advance time based on the scaled time
  console.log("Current Time (Worker Simulation Hour):", time);

  // Remove meals older than 12 simulated hours
  meals = meals.filter(meal => (time - meal.timeEaten) < 12);

  // Calculate fullness as the sum of all meal contributions
  let newFullness = 0;
  meals.forEach((meal, index) => {
    const timeDifference = (time - meal.timeEaten);
    if (timeDifference > 0) {
      const contribution = calculateMealContribution(meal.beta, timeDifference);
      newFullness += contribution;
      console.log(`Meal ${index + 1} at time (hour) ${meal.timeEaten} contributes ${contribution.toFixed(3)} to fullness.`);
    }
  });

  // Cap fullness at 1
  fullness = Math.min(newFullness, 1);
  console.log("Calculated Fullness:", fullness);

  // Send the updated time and fullness back to the main thread
  postMessage({ type: 'UPDATE_DATA', time, fullness, data: meals });
}

// Function to start the simulation interval
function startSimulation() {
  if (!intervalId) { // Prevent multiple intervals
    intervalId = setInterval(updateFullness, simulationSpeed);
    console.log('Worker simulation started.');
  }
}

// Function to stop the simulation interval
function stopSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Worker simulation stopped.');
  }
}

// Start the simulation initially
startSimulation();

// Listen for messages from the main thread (e.g., to add meals, reset, pause, resume, set speed)
onmessage = function(e) {
  const { type, amount, multiplier, archetype } = e.data;

  if (type === 'CONFIGURE_ARCHETYPE') {
    currentArchetype = archetype;
    console.log('Worker configured for archetype:', archetype);
  } else if (type === 'ADD_MEAL') {
    const adjustedAmount = amount * currentArchetype.mealSizeMultiplier;
    meals.push({ beta: adjustedAmount, timeEaten: time });
    console.log(`Meal added for ${currentArchetype.name}: beta=${adjustedAmount}, timeEaten=${time}`);
  } else if (type === 'RESET') {
    time = 0;
    fullness = 0;
    meals = [];
    postMessage({ type: 'RESET_COMPLETE' });
    console.log('Worker reset for archetype:', currentArchetype.name);
  } else if (type === 'PAUSE') {
    isPaused = true;
    stopSimulation();
    console.log('Worker PAUSED for archetype:', currentArchetype.name);
  } else if (type === 'RESUME') {
    isPaused = false;
    startSimulation();
    console.log('Worker resumed for archetype:', currentArchetype.name);
  } else if (type === 'SET_SPEED') {
    // Adjust functionTimeScale based on the new multiplier
    speedMultiplier = multiplier / 3600; // Normalize value
    functionTimeScale = 0.07 / speedMultiplier; // Update time scale based on speed multiplier
    console.log(`Updated simulation speed: multiplier=${speedMultiplier}, functionTimeScale=${functionTimeScale}`);
  }
};