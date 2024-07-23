import matplotlib.pyplot as plt
import numpy as np
from user_input_dictionary import user_input


def sigmoid(x, L, k, x0):
    """Sigmoid function for non-linear growth of Karmic Balance."""
    return L / (1 + np.exp(-k * (x - x0)))


def calculate_initial_slope(quality, timing, logistics):
    """Calculate the initial slope of the KS2 Karmic Balance up until Hara Hachi Bu"""
    # Normalize factors from 0 to 1 (where 0.5 is neutral)
    normalized_quality = (quality + 1) / 2
    normalized_timing = (timing + 1) / 2
    normalized_logistics = (logistics + 1) / 2

    # Apply weights (example weights, adjust as needed)
    weight_quality = 0.6
    weight_timing = 0.2
    weight_logistics = 0.2

    # Calculate weighted average
    weighted_average = (weight_quality * normalized_quality +
                        weight_timing * normalized_timing +
                        weight_logistics * normalized_logistics)

    # Convert back to range of -1 to 1 (subtract 0.5 and multiply by 2)
    final_value = (weighted_average - 0.5) * 2

    return final_value


###################
### Graph Setup ###
###################

# Create a figure and an axes.
fig, ax = plt.subplots(figsize=(10, 6))

# Set the title of the graph
ax.set_title('Sanatatea Sistemului Digestiv - Echilibru Karmic \n (The Body Conditioner)')

# Setting the labels for x and y axes
ax.set_xlabel('Cantitate Mancare (0 = Deloc, 2 = Mare Exces)', labelpad=10, x=0.83, fontsize=9)
ax.set_ylabel('Sistem Digestiv Karma (Nivel Sanatate-Functionalitate)')

# Set the range for the x-axis and y-axis
ax.set_xlim(0, 2)  # Quantity of food from 0 to 2
ax.set_ylim(-1, 1)  # KS2 Karmic Balance from -1 to 1

# Center the x-axis at y=0
ax.spines['left'].set_position('zero')  # Moves the left spine to x=0
ax.spines['right'].set_color('none')  # Hides the right spine
ax.spines['bottom'].set_position(('data', 0))  # Centers the bottom spine at y=0
ax.spines['top'].set_color('none')  # Hides the top spine

# Ensure ticks appear on both sides and at the bottom
ax.xaxis.set_ticks_position('bottom')
ax.yaxis.set_ticks_position('both')

# Adding grid lines for better readability
ax.grid(True)

# Draw a fixed dotted blue line at x = 1 for Hara Hachi Bu
ax.axvline(x=1, color='blue', linestyle='--', linewidth=1, label='Hara Hachi Bu - Pragul de Aur')

#######################
### Data Processing ###
#######################

# Retrieve user inputs
initial_ks2_balance = user_input["Initial_KS2_Karmic_Balance"]
quality = user_input["Quality"]
timing = user_input["Timing"]
logistics = user_input["Logistics"]
quantity = user_input["Quantity"]

# Mark the initial KS2 Karmic Balance at the beginning of the meal to be analyzed
ax.plot(0, initial_ks2_balance, 'ro', label='Punct Start')  # 'ro' for red circle

# Calculate the maximum level and use it to set the sigmoid's L
L = initial_ks2_balance + calculate_initial_slope(quality, timing, logistics)
k = 1.2  # Steepness of the curve
x0 = 0.4  # Midpoint of the sigmoid

# Generate values for the curve up to the maximum quantity specified
x_values = np.linspace(0, quantity, 100)
y_values = sigmoid(x_values, L, k, x0)

# Plot the curve on the same axis
# ax.plot(x_values, y_values, label="KS2 Karmic Balance up to Specified Quantity")

# Adding text labels for Logistics and Timing
logistics_label = "Logistics = " # + str(logistics)
timing_label = "Timing = " # + str(timing)
# Ovewr-writing the red dot starting point to allow full user modification
ax.plot(0, 0, 'wo', label=logistics_label)
ax.plot(-1, -1, 'wo', label=timing_label)

# Adding a legend to explain the lines and points
ax.legend(fontsize=8)

# Display the plot
plt.show()
