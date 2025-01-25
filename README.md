# Food Prophet

## Overview
**Food Prophet** is a **stand-alone React application** built and deployed within the **Django framework** of Project Re-Connect.

***Project Re-Connect Repository Link***  
[![GitHub Repository](https://img.shields.io/badge/Repository-Visit-blue?logo=github)](https://github.com/LaoWater/reconnectv2)

It leverages advanced **probabilistic modeling** to simulate digestion patterns for various archetypes (e.g., "Modern Man") while allowing users to interactively visualize and manipulate time, meals, and simulated digestion on a responsive graph.

---

## Key Features
1. **Probabilistic Archetype Simulation**
   - Models digestion patterns based on archetypes, using datasets and probabilistic distributions.
   - Users can simulate custom archetypes or empty archetypes for manual adjustments.

2. **Interactive Graph**
   - Real-time updates of digestion (stomach fullness) on a dynamic graph.
   - Users can asynchronously manipulate:
     - **Time Dimensions**: Adjust simulation speed (e.g., 3600x real-time).
     - **Custom Meals**: Add meals with varying fullness levels.

3. **Web Workers for Asynchronous Computation**
   - Handles digestion simulations in the background for a smooth, non-blocking user experience.
   - Tasks include:
     - Real-time graph updates.
     - Simulation adjustments (pausing, resetting, adding meals).

4. **Responsive Design**
   - User-friendly UI optimized for both desktop and mobile.
   - Utilizes synchronized web workers for scalability.

5. **Data Persistence**
   - Saves and loads simulation data via `localStorage`.
   - Enables users to continue simulations seamlessly.

---

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)

### Steps

```bash
# Clone the Repository
git clone https://github.com/LaoWater/The_Food_Prophet.git
```

```bash
# Install Dependencies
npm install
# Start the Development Server
npm start
```

---

## Contributions are welcome!
**Please fork the repository, make your changes, and submit a pull request.**  
***For major changes, please open an issue to discuss proposed changes.***

## This project is licensed under the MIT License.
**See the LICENSE file for details.**


