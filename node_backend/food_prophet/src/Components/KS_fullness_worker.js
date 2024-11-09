// stomachWorker.js
let time = 0;
let fullness = 0;
let meals = []; // Store meal data
const simulationSpeed = 100; // Interval in ms for simulation updates
const functionTimeScale = 0.07; // Scales time increments for simulation

// Function to calculate meal contribution using exponential decay
const calculateMealContribution = (beta, timeDifference) => {
  const k = 0.3; // Decay constant
  return beta * Math.exp(-k * timeDifference);
};


// Function to update fullness and time
function updateFullness() {
  time = +(time + functionTimeScale).toFixed(5); // Advance time based on scale
  console.log("Current Time (Simulated Hour):", time);

  // Remove meals older than 12 simulated hours
  meals = meals.filter(meal => {
    const isRecent = (time - meal.timeEaten) < 12;
    console.log(`Meal at time(hour) ${meal.timeEaten} is ${isRecent ? "still contributing" : "cleared from digestive system"}`);
    return isRecent;
  });

  // Calculate fullness as the sum of all meal contributions
  let newFullness = 0;
  meals.forEach((meal, index) => {
    const timeDifference = (time - meal.timeEaten) * 1;
    if (timeDifference > 0) {
      const contribution = calculateMealContribution(meal.beta, timeDifference);
      newFullness += contribution;
      console.log(`Meal ${index + 1} at ${meal.timeEaten} contributes ${contribution.toFixed(3)} to fullness.`);
    }
  });

  // Cap fullness at 1
  fullness = Math.min(newFullness, 1);
  console.log("Calculated Fullness:", fullness);

  // Send the updated time and fullness back to the main thread
  postMessage({ time, fullness });
}


// Run the update every `simulationSpeed` ms
setInterval(updateFullness, simulationSpeed);

// Listen for messages from the main thread (e.g., to add meals or reset)
onmessage = function(e) {
  if (e.data.type === 'ADD_MEAL') {
    meals.push({ beta: e.data.amount, timeEaten: time });
  } else if (e.data.type === 'RESET') {
    time = 0;
    fullness = 0;
    meals = [];
    postMessage({ time, fullness }); // Send reset state to the main thread
  }
};
