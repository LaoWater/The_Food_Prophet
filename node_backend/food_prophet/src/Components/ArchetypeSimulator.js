// src/simulate_archetype.js

const TIME_ACCELERATION = 1000; // 1000 ms = 1 simulated hour

// Configuration for different archetypes
const archetypeConfig = {
  ModernMan: {
    start_eating_hour: 6,
    end_eating_hour: 22,
    mealInterval: 1.5,
    mealDistribution: [0.15, 0.35, 0.44, 0.06], // Probability for small, medium, and big meals
  },
  PonPon: {
    start_eating_hour: 7,
    end_eating_hour: 18,
    mealInterval: 4,
    mealDistribution: [0.05, 0.31, 0.64, 0.02],
  },
  Lao: {
    start_eating_hour: 8,
    end_eating_hour: 22,
    mealInterval: 5,
    mealDistribution: [0.05, 0.21, 0.58, 0.16],
  },
};

// Meal Time adjustment distribution
const timeAdjustmentDistribution = [
  { adjustment: -1, probability: 0.05 },
  { adjustment: -0.5, probability: 0.18 },
  { adjustment: 0, probability: 0.55 },
  { adjustment: 0.5, probability: 0.17 },
  { adjustment: 1, probability: 0.05 },
];

class ArchetypeSimulator {
  constructor(worker) {
    this.worker = worker;
    this.currentArchetype = null;
    this.simulationInterval = null;
    this.simulationStartTimeReal = Date.now();
    this.simulationStartTime = 6; // Simulation always starts at 6 AM
    this.nextMealTime = null;
    this.defaultMealDistribution = null; // To hold default probabilities for reset
    this.mealDistribution = null; // To hold current probabilities during the day
  }

  // Method to set the simulation speed dynamically
  setSpeedMultiplier(multiplier) {
    this.timeAcceleration = 1000 * (multiplier / 3600); // Adjust time acceleration based on multiplier
    console.log(
      `Updated TIME_ACCELERATION to: ${this.timeAcceleration} ms per simulated hour, received multiplier: ${multiplier}`
    );

    // Restart the interval with the new time acceleration
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.startSimulation(this.currentArchetype); // Restart with updated speed
    }
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
    this.defaultMealDistribution = [...config.mealDistribution]; // Save default distribution
    this.mealDistribution = [...config.mealDistribution]; // Initialize daily distribution
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
    this.simulationStartTime = 6; // Simulation always starts at 6 AM
    this.simulationStartTimeReal = Date.now();

    // Schedule the first meal time
    const initialAdjustment = this.getRandomTimeAdjustment();
    this.nextMealTime =
      config.start_eating_hour + config.mealInterval + initialAdjustment;

    // Ensure the next meal time is within eating hours
    if (this.nextMealTime >= config.end_eating_hour) {
      this.nextMealTime = null; // No meals today
    }

    this.simulateWithInterval(config);
  }

  checkAndResetMealDistribution() {
    // Calculate cumulative offset by summing the absolute differences
    this.cumulativeOffset = this.defaultMealDistribution.reduce(
      (sum, defaultValue, index) => sum + Math.abs(defaultValue - this.mealDistribution[index]),
      0
    );
  
    // Define a reset threshold based on the cumulative offset
    const resetThreshold = 0.13;
    if (this.cumulativeOffset >= resetThreshold) {
      console.log(`A New Day has come: Cumulative offset: ${this.cumulativeOffset} \n Exceeded threshold! Resetting meal probability distribution.`);
      this.mealDistribution = [...this.defaultMealDistribution];
      this.cumulativeOffset = 0; // Reset cumulative offset after resetting distribution
    } else {
      console.log(`A New Day has come: Meal distribution continues from previous day. Current cumulative offset: ${this.cumulativeOffset.toFixed(2)}`);
    }
  }
  

  simulateWithInterval(config) {
    const { start_eating_hour, end_eating_hour, mealInterval } = config;
    let newDayStarted = false;

    this.simulationInterval = setInterval(() => {
      const currentSimulatedTime = this.getCurrentSimulatedTime();

      if (currentSimulatedTime >= start_eating_hour && !newDayStarted) {
        const initialAdjustment = this.getRandomTimeAdjustment();
        this.nextMealTime = start_eating_hour + initialAdjustment;
        newDayStarted = true;
        console.log(`New day: First meal scheduled at ${this.formatTime(this.nextMealTime)}.`);

        // Reset meal distribution for the new day
        console.log(`A New Day has come: Checking If cumulative meal distribution offset needs resetting`)
        this.checkAndResetMealDistribution();
      }

      if (currentSimulatedTime >= end_eating_hour) {
        newDayStarted = false;
      }

      if (currentSimulatedTime >= end_eating_hour || currentSimulatedTime < start_eating_hour) {
        console.log(
          `Simulated Time: ${this.formatTime(currentSimulatedTime)} - Not eating hours.`
        );
        return;
      }

      if (this.nextMealTime && currentSimulatedTime >= this.nextMealTime) {
        const mealSize = this.chooseMealSize(this.mealDistribution);
        this.addMeal(mealSize);
        console.log(`Added meal at ${this.formatTime(currentSimulatedTime)}.`);

        // Adjust the distribution for the next meal
        this.adjustMealDistribution(mealSize);

        // Calculate the next meal time by adding mealInterval and a random adjustment
        let adjustment = this.getRandomTimeAdjustment();
        this.nextMealTime = currentSimulatedTime + mealInterval + adjustment;

        if (this.nextMealTime >= end_eating_hour) {
          this.nextMealTime = null;
          console.log(`End of eating hours. Meals will resume tomorrow.`);
        } else {
          console.log(`Next meal scheduled at ${this.formatTime(this.nextMealTime)}.`);
        }
      }

      console.log(
        `Current Archetype Simulated Time: ${this.formatTime(currentSimulatedTime)} - Waiting for next meal at ${this.nextMealTime ? this.formatTime(this.nextMealTime) : 'N/A'}.`
      );
    }, this.timeAcceleration);
  }

  chooseMealSize(distribution) {
    const randomValue = Math.random();
    if (randomValue < distribution[0]) return 'Small';
    if (randomValue < distribution[0] + distribution[1]) return 'Medium';
    if (randomValue < distribution[0] + distribution[1] + distribution[2]) return 'Big';
    return 'Absolute Max Limit';
  }

  adjustMealDistribution(lastMealSize) {
    const adjustmentFactor = 0.025; // Amount to increase or decrease the probability in meal distribution
  
    if (lastMealSize === 'Small') {
      this.mealDistribution[0] = Math.max(this.mealDistribution[0] - adjustmentFactor, 0);
      this.redistributeProbability(0, adjustmentFactor);
    } else if (lastMealSize === 'Medium') {
      this.mealDistribution[1] = Math.max(this.mealDistribution[1] - adjustmentFactor, 0);
      this.redistributeProbability(1, adjustmentFactor);
    } else if (lastMealSize === 'Big') {
      this.mealDistribution[2] = Math.max(this.mealDistribution[2] - adjustmentFactor, 0);
      this.redistributeProbability(2, adjustmentFactor);
    } else if (lastMealSize === 'Absolute Max Limit') {
      this.mealDistribution[3] = Math.max(this.mealDistribution[3] - adjustmentFactor, 0);
      this.redistributeProbability(3, adjustmentFactor);
    }
  
    console.log(`Updated meal distribution for next meal: ${this.mealDistribution}`);
  }
  
  redistributeProbability(excludeIndex, adjustmentFactor) {
    // Redistribute adjustmentFactor across other meal sizes
    const remainingIndices = [0, 1, 2, 3].filter(i => i !== excludeIndex);
    const remainingTotal = remainingIndices.reduce((sum, i) => sum + this.mealDistribution[i], 0);
  
    // Adjust remaining meal probabilities proportionally
    remainingIndices.forEach(i => {
      const increment = (adjustmentFactor * this.mealDistribution[i]) / remainingTotal;
      this.mealDistribution[i] = Math.min(this.mealDistribution[i] + increment, 1);
    });
  
    // Normalize to ensure probabilities sum to 1
    const total = this.mealDistribution.reduce((sum, value) => sum + value, 0);
    this.mealDistribution = this.mealDistribution.map(value => value / total);
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

  getCurrentSimulatedTime() {
    const elapsedRealTime = Date.now() - this.simulationStartTimeReal; // in ms
    const elapsedSimulatedHours = elapsedRealTime / this.timeAcceleration;
    return (this.simulationStartTime + elapsedSimulatedHours) % 24;
  }

  formatTime(time) {
    const hour = Math.floor(time);
    const minutes = Math.floor((time - hour) * 60);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12) + 1;
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  addMeal(size) {
    const mealAmount = {
      'Small': 0.1,
      'Medium': 0.3,
      'Big': 0.7,
      'Absolute Max Limit': 1.0,
    };
    const amount = mealAmount[size];
    this.worker.postMessage({ type: 'ADD_MEAL', amount });
    console.log(`Added a ${size} meal with amount: ${amount}`);
  }
}

export { ArchetypeSimulator, TIME_ACCELERATION };
