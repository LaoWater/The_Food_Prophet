import matplotlib.pyplot as plt
import numpy as np
import io


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


def generate_plot(user_input):
    initial_ks2_balance = user_input["Initial_KS2_Karmic_Balance"]
    quality = user_input["Quality"]
    timing = user_input["Timing"]
    logistics = user_input["Logistics"]
    quantity = user_input["Quantity"]

    # Create a figure and an axes.
    fig, ax = plt.subplots(figsize=(10, 6))

    # Set the title of the graph
    ax.set_title('Digestive System Health\n (The Second Body Conditioner - Kaya Sankhara 2)')

    # Setting the labels for x and y axes
    ax.set_xlabel('Quantity of Food (0 = None, 2 = Excess)')
    ax.set_ylabel('KS2 Karma (Health)')

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
    ax.axvline(x=1, color='blue', linestyle='--', linewidth=1, label='Hara Hachi Bu')

    # Mark the initial KS2 Karmic Balance at the beginning of the meal to be analyzed
    ax.plot(0, initial_ks2_balance, 'ro', label='Starting Point')  # 'ro' for red circle

    # Calculate the maximum level and use it to set the sigmoid's L
    slope_value = calculate_initial_slope(quality, timing, logistics)
    L = initial_ks2_balance + slope_value
    k = 1.2  # Steepness of the curve
    x0 = 0.4  # Midpoint of the sigmoid

    # Generate values for the curve up to the maximum quantity specified
    x_values = np.linspace(0, quantity, 100)  # Increase the number of points for smoother curve
    x_values = x_values.tolist()  # Convert to list to avoid any potential tuple issues
    y_values = [0] * len(x_values)  # Initializes a list of zeros with the same length as x_values

    for i, x in enumerate(x_values):
        if x <= 1:
            y_values[i] = sigmoid(x, L, k, x0)  # 20 and 0.5 are arbitrary, tune these
        else:
            y_values[i] = y_values[i - 1] - 0.1 * (x - 1)  # Decrease value beyond x=1

    # Set the first y-value to the initial KS2 balance
    y_values[0] = initial_ks2_balance

    # Plot the curve on the same axis
    ax.plot(x_values, y_values, label="KS2 Karmic Balance up to Specified Quantity")

    # Adding a legend to explain the lines and points
    ax.legend()

    # Save plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')  # Use bbox_inches to ensure everything is included

    # Display the plot for debugging
    plt.show()

    img.seek(0)
    plt.close()

    return img


if __name__ == '__main__':
    # Test/Default values when ran outside Web Application
    user_input_main = {
        "Initial_KS2_Karmic_Balance": -0.2,
        "Quality": 0.9,
        "Timing": 0.8,
        "Logistics": 0.7,
        "Quantity": 2
    }
    ks2_graph = generate_plot(user_input_main)




    # Saving file to output
    exit()
    with open('test_plot.png', 'wb') as f:
        f.write(ks2_graph.read())
    print("Plot saved as test_plot.png")
