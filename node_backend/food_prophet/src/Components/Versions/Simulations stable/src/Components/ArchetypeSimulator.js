// src/simulate_archetype.js

const TIME_ACCELERATION = 1000; // 1000 ms = 1 simulated hour

// Configuration for different archetypes
const archetypeConfig = {
  ModernMan: {
    wakeUpHour: 6,
    sleepHour: 22,
    mealInterval: 1.5,
    mealDistribution: [0.17, 0.39, 0.43], // Probability for small, medium, and big meals
  },
  PonPon: {
    wakeUpHour: 7,
    sleepHour: 18,
    mealInterval: 4,
    mealDistribution: [0.05, 0.31, 0.64],
  },
  Lao: {
    wakeUpHour: 9,
    sleepHour: 21,
    mealInterval: 7,
    mealDistribution: [0.05, 0.25, 0.70],
  },
};

// Time adjustment distribution: -2, -1, 0, +1, +2 hours
const timeAdjustmentDistribution = [
  { adjustment: -1, probability: 0.08 },
  { adjustment: -0.5, probability: 0.20 },
  { adjustment: 0, probability: 0.47 },
  { adjustment: 0.5, probability: 0.18 },
  { adjustment: 1, probability: 0.07 },
];

class ArchetypeSimulator {
  constructor(worker) {
    this.worker = worker;
    this.currentArchetype = null;
    this.simulationInterval = null;
    this.simulationStartTimeReal = Date.now();
    this.simulationStartTime = 0;
    this.lastMealHour = this.simulationStartTime - 2;
    this.currentDay = 0;
  }

  startSimulation(archetypeName) {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    const config = archetypeConfig[archetypeName];
    if (!config) {
      console.warn(`Archetype "${archetypeName}" is not defined.`);
      return;
    }

    this.currentArchetype = archetypeName;
    this.simulateArchetype(config);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('Simulation stopped.');
    }
  }

  simulateArchetype(config) {
    console.log(`Starting simulation for ${this.currentArchetype}.`);
    this.simulationStartTime = config.wakeUpHour || 6;
    this.simulationStartTimeReal = Date.now();

    if (config.schedule) {
      this.simulateWithSchedule(config);
    } else {
      this.lastMealHour = this.simulationStartTime - (config.mealInterval || 2);
      this.simulateWithInterval(config);
    }
  }

  simulateWithSchedule(config) {
    this.currentDay = 0;

    this.simulationInterval = setInterval(() => {
      const currentSimulatedHour = this.getCurrentSimulatedHour();
      const daySchedule = config.schedule[this.currentDay % config.schedule.length];

      const meal = daySchedule.find((meal) => meal.hour <= currentSimulatedHour);
      if (meal) {
        const adjustedHour = meal.hour + this.getRandomTimeAdjustment();
        if (Math.abs(currentSimulatedHour - adjustedHour) < 0.5) { // Allow slight difference
          this.addMeal(meal.size);
          daySchedule.splice(daySchedule.indexOf(meal), 1);
        }
      }

      if (daySchedule.length === 0) {
        this.currentDay += 1;
      }

      console.log(`Simulated Time: ${this.formatHour(currentSimulatedHour)} - Scheduled Day ${this.currentDay + 1}`);
    }, TIME_ACCELERATION);
  }

  simulateWithInterval(config) {
    const { wakeUpHour, sleepHour, mealInterval, mealDistribution } = config;

    this.simulationInterval = setInterval(() => {
      const currentSimulatedHour = this.getCurrentSimulatedHour();

      if (currentSimulatedHour >= sleepHour || currentSimulatedHour < wakeUpHour) {
        console.log(`Simulated Time: ${this.formatHour(currentSimulatedHour)} - Sleeping.`);
        return;
      }

      const hoursSinceLastMeal = (currentSimulatedHour - this.lastMealHour + 24) % 24;
      if (hoursSinceLastMeal >= mealInterval) {
        const adjustedHour = currentSimulatedHour + this.getRandomTimeAdjustment();
        if (Math.abs(adjustedHour - currentSimulatedHour) < 0.5) {
          this.addMeal(this.chooseMealSize(mealDistribution));
          this.lastMealHour = currentSimulatedHour;
        }
      }

      console.log(`Simulated Time: ${this.formatHour(currentSimulatedHour)} - Awake.`);
    }, TIME_ACCELERATION);
  }

  chooseMealSize(distribution) {
    const randomValue = Math.random();
    if (randomValue < distribution[0]) return 'Small';
    if (randomValue < distribution[0] + distribution[1]) return 'Medium';
    return 'Big';
  }

  getRandomTimeAdjustment() {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    for (const { adjustment, probability } of timeAdjustmentDistribution) {
      cumulativeProbability += probability;
      if (randomValue < cumulativeProbability) {
        return adjustment;
      }
    }
    return 0; // Fallback if probabilities don’t sum to exactly 1
  }

  getCurrentSimulatedHour() {
    const elapsedRealTime = Date.now() - this.simulationStartTimeReal;
    const elapsedSimulatedHours = parseFloat((elapsedRealTime / TIME_ACCELERATION).toFixed(2));
    return (this.simulationStartTime + elapsedSimulatedHours) % 24;
  }

  formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12 + 1);
    return `${formattedHour} ${period}`;
  }

  addMeal(size) {
    let amount;
    switch (size) {
      case 'Small':
        amount = 0.1;
        break;
      case 'Medium':
        amount = 0.3;
        break;
      case 'Big':
        amount = 0.7;
        break;
      case 'MediumOrBig':
        amount = Math.random() < 0.7 ? 0.3 : 0.5;
        break;
      default:
        amount = 0.3;
    }

    this.worker.postMessage({ type: 'ADD_MEAL', amount });
    console.log(`Added a ${size} meal with amount: ${amount}`);
  }
}

export { ArchetypeSimulator, TIME_ACCELERATION };
