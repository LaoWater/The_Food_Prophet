// src/App.js

import React from 'react';
import StomachFullnessGraph from './Components/main_orion_simulator_wpause';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 900px;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
`;

function App() {
  return (
    <AppContainer>
      <h1>Welcome to the Stomach Fullness Tracker!</h1>
      <StomachFullnessGraph />
    </AppContainer>
  );
}

export default App;
