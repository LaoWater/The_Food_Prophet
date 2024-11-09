// src/simulate_archtype.js

const TIME_ACCELERATION = 1000; // 1000 ms = 1 simulated hour

class ArchetypeSimulator {
  constructor(worker) {
    this.worker = worker;
    this.currentArchetype = null;
    this.simulationInterval = null;
    this.simulationStartTimeReal = Date.now();
    this.simulationStartTime = 6; // Starting at 6 AM for Modern Man
    this.lastMealHour = this.simulationStartTime - 2; // Initialize to allow immediate meal
  }

  // Start simulation for a given archetype
  startSimulation(archetypeName) {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    switch (archetypeName) {
      case 'ModernMan':
        this.simulateModernMan();
        break;
      // Future archetypes can be added here
      default:
        console.warn(`Archetype "${archetypeName}" is not defined.`);
    }

    this.currentArchetype = archetypeName;
  }

  // Stop the current simulation
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('Simulation stopped.');
    }
  }

  // Simulate the Modern Man archetype
  simulateModernMan() {
    console.log('Starting simulation for Modern Man.');

    // Define the eating schedule
    // Example: Eats every 2 simulated hours from 6 AM to 10 PM, sleeps from 10 PM to 6 AM
    const wakeUpHour = 6;  // 6 AM
    const sleepHour = 22;  // 10 PM
    const mealInterval = 2; // Every 2 simulated hours

    this.simulationStartTime = wakeUpHour;
    this.lastMealHour = wakeUpHour - mealInterval; // Initialize to allow immediate meal

    this.simulationStartTimeReal = Date.now(); // Reset simulation start time

    this.simulationInterval = setInterval(() => {
      const currentSimulatedHour = this.getCurrentSimulatedHour();

      // Check if it's time to sleep
      if (currentSimulatedHour >= sleepHour || currentSimulatedHour < wakeUpHour) {
        console.log(`Simulated Time: ${this.formatHour(currentSimulatedHour)} - Sleeping.`);
        // During sleep, no meals are added
        return;
      }

      // Determine if it's time to eat a meal
      const hoursSinceLastMeal = (currentSimulatedHour - this.lastMealHour + 24) % 24;
      if (hoursSinceLastMeal >= mealInterval) {
        this.addMeal('MediumOrBig');
        this.lastMealHour = currentSimulatedHour;
      }

      console.log(`Simulated Time: ${this.formatHour(currentSimulatedHour)} - Awake.`);
    }, TIME_ACCELERATION);
  }

  // Helper to get the current simulated hour
  getCurrentSimulatedHour() {
    const elapsedRealTime = Date.now() - this.simulationStartTimeReal;
    const elapsedSimulatedHours = parseFloat((elapsedRealTime / TIME_ACCELERATION).toFixed(2));
    return (this.simulationStartTime + elapsedSimulatedHours) % 24;
  }

  // Helper to format hour in AM/PM
  formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12 + 1);
    return `${formattedHour} ${period}`;
  }

  // Add a meal with specified size
  addMeal(size) {
    let amount;
    switch (size) {
      case 'Little':
        amount = 0.1;
        break;
      case 'Medium':
        amount = 0.3;
        break;
      case 'Big':
        amount = 0.5;
        break;
      case 'MediumOrBig':
        // Randomly choose between medium and big
        amount = Math.random() < 0.5 ? 0.3 : 0.5;
        break;
      default:
        amount = 0.3;
    }

    this.worker.postMessage({ type: 'ADD_MEAL', amount });
    console.log(`Added a ${size} meal with amount: ${amount}`);
  }
}

export { ArchetypeSimulator, TIME_ACCELERATION };
