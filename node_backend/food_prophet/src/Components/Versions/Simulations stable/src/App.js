// src/App.js

import React from 'react';
import StomachFullnessGraph from './Components/StomachFullness_Graph';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  padding: 20px;
  margin: 0 auto;
`;

const GraphsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // Two columns for graphs
  gap: 40px;
  justify-items: center; // Center-align the graphs horizontally
  margin-top: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr; // Stack graphs on smaller screens
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  max-width: 800px; // Limit maximum width for each graph
`;

function App() {
  return (
    <AppContainer>
      <h1>Welcome to the Stomach Fullness Tracker!</h1>
      <GraphsContainer>
        <GraphWrapper>
          <h2>Simulation 1</h2>
          <StomachFullnessGraph archetype="ModernMan" />
        </GraphWrapper>
        <GraphWrapper>
          <h2>Simulation 2</h2>
          <StomachFullnessGraph archetype="PonPon" />
        </GraphWrapper>
        <GraphWrapper>
          <h2>Simulation 3</h2>
          <StomachFullnessGraph archetype="Lao" />
        </GraphWrapper>
        <GraphWrapper>
          <h2>Simulation 4</h2>
          <StomachFullnessGraph archetype="Custom" />
        </GraphWrapper>
      </GraphsContainer>
    </AppContainer>
  );
}

export default App;
