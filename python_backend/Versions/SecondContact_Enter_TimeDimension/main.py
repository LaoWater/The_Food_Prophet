import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import time

# Initial stomach fullness value
fullness = 0.5

# Stomach digestion rate
digestion_rate = 0.01

# Time series data
x_data, y_data = [], []

fig, ax = plt.subplots()
line, = ax.plot([], [], lw=2)

ax.set_xlim(0, 10)
ax.set_ylim(0, 1)
ax.set_xlabel("Time")
ax.set_ylabel("Stomach Fullness")


def init():
    line.set_data([], [])
    return line,


def update(frame):
    global fullness
    fullness = max(fullness - digestion_rate, 0)  # Fullness decreases over time

    # Update time
    x_data.append(time.time() % 1000)
    y_data.append(fullness)

    line.set_data(x_data, y_data)

    ax.set_xlim(max(0, x_data[-1] - 10), x_data[-1] + 1)  # Keep moving the X-axis

    return line,


ani = FuncAnimation(fig, update, init_func=init, blit=True, interval=100)

plt.show()
