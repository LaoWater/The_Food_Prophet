// Test scenarios for enhanced fullness calculation
const fs = require('fs');

const calculateEnhancedFullness = (beta, timeDifference, simulationHour, fullSedentarismStartHour, fullSedentarismEndHour) => {
    const baseDecayConstant = 0.3;
    
    // Circadian rhythm factor (24-hour cycle)
    const circadianFactor = 1 + 0.2 * Math.sin((simulationHour - 6) * (2 * Math.PI / 24));
    
    // Sedentarism factor
    let sedentarismFactor = 1;
    if (simulationHour >= fullSedentarismStartHour && simulationHour <= fullSedentarismEndHour) {
        sedentarismFactor = 0.7; // Slower digestion during sedentary periods
    }
    
    // Combine all factors
    const effectiveDecayConstant = baseDecayConstant * circadianFactor * sedentarismFactor;
    
    return {
        result: beta * Math.exp(-effectiveDecayConstant * timeDifference),
        debug: {
            circadianFactor,
            sedentarismFactor,
            effectiveDecayConstant
        }
    };
};

// Initialize output string
let output = `FULLNESS CALCULATION TEST RESULTS
===============================
Testing Date: ${new Date().toLocaleString()}
Base Decay Constant: 0.3
Sedentary Factor: 0.7
Circadian Amplitude: 0.2

`;

// Test Scenario 1: Morning Breakfast (8 AM)
output += `\nSCENARIO 1: Morning Breakfast (8:00 AM)
----------------------------------------
Initial Fullness (beta): 100
Sedentary Period: 9:00 AM - 5:00 PM
Tracking Period: 4 hours\n\n`;

const breakfastScenario = {
    beta: 100,              // Initial fullness
    simulationHour: 8,      // 8 AM
    sedStart: 9,            // Office hours start
    sedEnd: 17              // Office hours end
};

[0, 1, 2, 4].forEach(hour => {
    const result = calculateEnhancedFullness(
        breakfastScenario.beta,
        hour,
        breakfastScenario.simulationHour + hour,
        breakfastScenario.sedStart,
        breakfastScenario.sedEnd
    );
    
    output += `Time: ${breakfastScenario.simulationHour + hour}:00 (${hour} hours elapsed)
Fullness Level: ${result.result.toFixed(2)}%
Circadian Factor: ${result.debug.circadianFactor.toFixed(3)}
Sedentary Factor: ${result.debug.sedentarismFactor}
Effective Decay Rate: ${result.debug.effectiveDecayConstant.toFixed(3)}
----------------------------------------\n\n`;
});

// Test Scenario 2: Late Night Snack (23:00)
output += `\nSCENARIO 2: Late Night Snack (11:00 PM)
----------------------------------------
Initial Fullness (beta): 80
Sedentary Period: 9:00 AM - 5:00 PM (not applicable)
Tracking Period: 2 hours\n\n`;

const lateNightScenario = {
    beta: 80,               // Smaller meal
    simulationHour: 23,     // 11 PM
    sedStart: 9,            // Office hours
    sedEnd: 17              // unchanged
};

[0, 1, 2].forEach(hour => {
    const result = calculateEnhancedFullness(
        lateNightScenario.beta,
        hour,
        (lateNightScenario.simulationHour + hour) % 24,
        lateNightScenario.sedStart,
        lateNightScenario.sedEnd
    );
    
    output += `Time: ${(lateNightScenario.simulationHour + hour) % 24}:00 (${hour} hours elapsed)
Fullness Level: ${result.result.toFixed(2)}%
Circadian Factor: ${result.debug.circadianFactor.toFixed(3)}
Sedentary Factor: ${result.debug.sedentarismFactor}
Effective Decay Rate: ${result.debug.effectiveDecayConstant.toFixed(3)}
----------------------------------------\n\n`;
});

// Test Scenario 3: Lunch During Sedentary Period (12:00)
output += `\nSCENARIO 3: Office Lunch (12:00 PM)
----------------------------------------
Initial Fullness (beta): 100
Sedentary Period: 9:00 AM - 5:00 PM
Tracking Period: 4 hours\n\n`;

const officeLunchScenario = {
    beta: 100,              // Full lunch
    simulationHour: 12,     // Noon
    sedStart: 9,            // Office hours
    sedEnd: 17              // unchanged
};

[0, 1, 2, 4].forEach(hour => {
    const result = calculateEnhancedFullness(
        officeLunchScenario.beta,
        hour,
        officeLunchScenario.simulationHour + hour,
        officeLunchScenario.sedStart,
        officeLunchScenario.sedEnd
    );
    
    output += `Time: ${officeLunchScenario.simulationHour + hour}:00 (${hour} hours elapsed)
Fullness Level: ${result.result.toFixed(2)}%
Circadian Factor: ${result.debug.circadianFactor.toFixed(3)}
Sedentary Factor: ${result.debug.sedentarismFactor}
Effective Decay Rate: ${result.debug.effectiveDecayConstant.toFixed(3)}
----------------------------------------\n\n`;
});

// Test Scenario 4: Compare Active vs Sedentary Digestion
output += `\nSCENARIO 4: Active vs Sedentary Comparison (2:00 PM)
----------------------------------------
Initial Fullness (beta): 100
Time Elapsed: 2 hours
Comparing same meal for active and sedentary person\n\n`;

const mealBeta = 100;
const mealHour = 14; // 2 PM
const timeElapsed = 2; // 2 hours later

// Active person (no sedentary period)
const activeResult = calculateEnhancedFullness(
    mealBeta,
    timeElapsed,
    mealHour,
    0, // No sedentary period
    0
);

// Sedentary person
const sedentaryResult = calculateEnhancedFullness(
    mealBeta,
    timeElapsed,
    mealHour,
    9, // Office hours
    17
);

output += `ACTIVE PERSON:
Fullness Level: ${activeResult.result.toFixed(2)}%
Circadian Factor: ${activeResult.debug.circadianFactor.toFixed(3)}
Sedentary Factor: ${activeResult.debug.sedentarismFactor}
Effective Decay Rate: ${activeResult.debug.effectiveDecayConstant.toFixed(3)}

SEDENTARY PERSON:
Fullness Level: ${sedentaryResult.result.toFixed(2)}%
Circadian Factor: ${sedentaryResult.debug.circadianFactor.toFixed(3)}
Sedentary Factor: ${sedentaryResult.debug.sedentarismFactor}
Effective Decay Rate: ${sedentaryResult.debug.effectiveDecayConstant.toFixed(3)}

Difference in Fullness: ${(sedentaryResult.result - activeResult.result).toFixed(2)}%
----------------------------------------\n`;

// Write results to file
fs.writeFileSync('fullness_test_results.txt', output);
console.log('Test results have been written to fullness_test_results.txt');
