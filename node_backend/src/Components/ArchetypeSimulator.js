// src/simulate_archetype.js

const TIME_ACCELERATION = 1000; // 1000 ms = 1 simulated hour

// Configuration for different archetypes
const archetypeConfig = {
  ModernMan: {
    start_eating_hour: 6,
    end_eating_hour: 22,
    mealInterval: 1.5,
    fullSedentarismStartHour: 18,
    fullSedentarismEndHour: 7,
    mealDistribution: [0.15, 0.35, 0.44, 0.06], // Probability for small, medium, and big meals
  },
  PonPon: {
    start_eating_hour: 7,
    end_eating_hour: 18,
    mealInterval: 4,
    fullSedentarismStartHour: 15,
    fullSedentarismEndHour: 8,
    mealDistribution: [0.05, 0.31, 0.64, 0.02],
  },
  Lao: {
    start_eating_hour: 8,
    end_eating_hour: 22,
    mealInterval: 5,
    fullSedentarismStartHour: 18,
    fullSedentarismEndHour: 5,
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

  startSimulation(archetype) {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    console.log(`Start simulation received archetype: ${JSON.stringify(archetype, null, 2)}`);
    // Check if archetype configuration exists
    // Retrieve configuration by the archetype name
    const configName = archetypeConfig[archetype.name]; // This is just the name
    const config = null

    if (config) {
      // Use the correct archetype configuration
      const config = archetypeConfig[configName]; // Retrieve the full config object
      this.startEatingHour = config.startEatingHour;
      this.stopEatingHour = config.stopEatingHour;
      this.mealInterval = config.mealInterval;
      this.defaultMealDistribution = [...config.mealDistribution];
      this.mealDistribution = [...config.mealDistribution];
      this.fullSedentarismStartHour = config.fullSedentarismStartHour;
      this.fullSedentarismEndHour = config.fullSedentarismEndHour;

      console.log(`[${archetype.name}] Initialized values from config:`);
      console.log(`startEatingHour: ${this.startEatingHour}`);
      console.log(`stopEatingHour: ${this.stopEatingHour}`);
      console.log(`mealInterval: ${this.mealInterval}`);

    } else {
      // Initialize with user-received values if not in archetypeConfig
      console.log(`Archetype "${archetype.name}" is not defined in archetypeConfig. Initializing with user-provided values.`);
      this.currentArchetype = archetype;
      this.defaultMealDistribution = archetype.mealDistribution ? [...archetype.mealDistribution] : [0.25, 0.25, 0.25, 0.25]; // Default to equal distribution
      this.mealDistribution = [...this.defaultMealDistribution];
      this.startEatingHour = archetype.startEatingHour ?? 6; // Default to 6 AM
      this.stopEatingHour = archetype.stopEatingHour ?? 22; // Default to 10 PM
      this.mealInterval = archetype.mealInterval ?? 2; // Default to 2 hours
      this.fullSedentarismStartHour = archetype.fullSedentarismStartHour ?? 23; // Default to 11 PM
      this.fullSedentarismEndHour = archetype.fullSedentarismEndHour ?? 6; // Default to 6 AM
    }
  
    this.simulateArchetype(this.currentArchetype); // Pass config if it exists, otherwise pass archetype
  }
  
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('Simulation stopped.');
    }
  }

  simulateArchetype() {
    console.log(`Starting simulation for ${this.currentArchetype.name}.`);
  
    this.simulationStartTime = 6; // Always start at 6 AM
    this.simulationStartTimeReal = Date.now();

    console.log(`[${this.currentArchetype.name}] Initialized values:`);
    console.log(`startEatingHour: ${this.startEatingHour}`);
    console.log(`stopEatingHour: ${this.stopEatingHour}`);
    console.log(`mealInterval: ${this.mealInterval}`);
  
    const initialAdjustment = this.getRandomTimeAdjustment();
    this.nextMealTime = this.startEatingHour + this.mealInterval + initialAdjustment;
  
    // Ensure the first meal is within eating hours
    if (this.nextMealTime >= this.stopEatingHour) {
      console.log(`[${this.currentArchetype.name}] First meal time is outside eating hours. Setting to null.`);
      this.nextMealTime = null;
    } else {
      console.log(
        `[${this.currentArchetype.name}] First meal scheduled at ${this.formatTime(this.nextMealTime)}.`
      );
    }
  
    // Start the simulation interval
    this.simulateWithInterval();
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
      console.log(`[${this.currentArchetype.name}] A New Day has come: Cumulative offset: ${this.cumulativeOffset} \n Exceeded threshold! Resetting meal probability distribution.`);
      this.mealDistribution = [...this.defaultMealDistribution];
      this.cumulativeOffset = 0; // Reset cumulative offset after resetting distribution
    } else {
      console.log(`[${this.currentArchetype.name}] A New Day has come: Meal distribution continues from previous day. Current cumulative offset: ${this.cumulativeOffset.toFixed(2)}`);
    }
  }
  

  simulateWithInterval() {
    let newDayStarted = false;
  
    console.log(`Started simulating with interval for archetype: ${this.currentArchetype.name}`);
  
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  
    this.simulationInterval = setInterval(() => {
      const currentSimulatedTime = this.getCurrentSimulatedTime();
  
      if (currentSimulatedTime >= this.startEatingHour && !newDayStarted) {
        const initialAdjustment = this.getRandomTimeAdjustment();
        this.nextMealTime = this.startEatingHour + initialAdjustment;
        newDayStarted = true;
  
        console.log(
          `[${this.currentArchetype.name}] New day started: First meal scheduled at ${this.formatTime(this.nextMealTime)}.`
        );
  
        // Reset meal distribution for the new day
        console.log(`[${this.currentArchetype.name}] Checking if cumulative meal distribution offset needs resetting.`);
        this.checkAndResetMealDistribution();
      }
  
      if (currentSimulatedTime >= this.stopEatingHour) {
        newDayStarted = false;
      }
  
      if (currentSimulatedTime >= this.stopEatingHour || currentSimulatedTime < this.startEatingHour) {
        console.log(
          `[${this.currentArchetype.name}] Simulated Time: ${this.formatTime(currentSimulatedTime)} - Not eating hours.`
        );
        return;
      }
  
      if (this.nextMealTime && currentSimulatedTime >= this.nextMealTime) {
        const mealSize = this.chooseMealSize(this.mealDistribution);
        this.addMeal(mealSize);
        console.log(
          `[${this.currentArchetype.name}] Added meal at ${this.formatTime(currentSimulatedTime)}.`
        );
  
        // Adjust the distribution for the next meal
        this.adjustMealDistribution(mealSize);
  
        const adjustment = this.getRandomTimeAdjustment();
        this.nextMealTime = currentSimulatedTime + this.mealInterval + adjustment;
  
        if (this.nextMealTime >= this.stopEatingHour) {
          this.nextMealTime = null;
          console.log(`[${this.currentArchetype.name}] End of eating hours. Meals will resume tomorrow.`);
        } else {
          console.log(
            `[${this.currentArchetype.name}] Next meal scheduled at ${this.formatTime(this.nextMealTime)}.`
          );
        }
      }
  
      console.log(
        `[${this.currentArchetype.name}] Simulated Time: ${this.formatTime(currentSimulatedTime)} - Waiting for next meal at ${
          this.nextMealTime ? this.formatTime(this.nextMealTime) : 'N/A'
        }.`
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
  
    console.log(`[${this.currentArchetype.name}] Updated meal distribution for next meal: ${this.mealDistribution}`);
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
    console.log(`${this.currentArchetype.name}] Added a ${size} meal with amount: ${amount}`);
  }
}

export { ArchetypeSimulator, TIME_ACCELERATION };
