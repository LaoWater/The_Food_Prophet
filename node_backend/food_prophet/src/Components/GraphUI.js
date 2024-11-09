// src/components/GraphUI.js

import React from 'react';
import styled from 'styled-components';

// Styled components
export const GraphContainer = styled.div`
  text-align: center;
  margin: 20px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  button {
    margin: 5px;
    padding: 10px 20px;
    background-color: ${(props) => props.bgColor || '#4CAF50'};
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background-color: ${(props) => props.hoverColor || '#45a049'};
    }

    &:focus {
      outline: none;
    }
  }
`;

export const FullnessDisplay = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
`;

// Separate UI component to use in the main component
export const GraphUI = ({ svgRef, fullness, handleEat, handleReset, isPaused, setIsPaused }) => (
  <GraphContainer>
    <h2>Stomach Fullness Over Time</h2>
    <svg ref={svgRef} width="800" height="400" style={{ background: '#f0f0f0', borderRadius: '10px' }}></svg>
    <Controls>
      <button onClick={() => handleEat(0.1)} bgColor="#2196F3" hoverColor="#1976D2">Eat Small Meal (+0.1)</button>
      <button onClick={() => handleEat(0.3)} bgColor="#FF5722" hoverColor="#E64A19">Eat Medium Meal (+0.3)</button>
      <button onClick={() => handleEat(0.7)} bgColor="#FF5722" hoverColor="#E64A19">Eat Big Meal (+0.7)</button>
      <button onClick={() => setIsPaused(!isPaused)} bgColor="#9E9E9E" hoverColor="#757575">
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={handleReset} bgColor="#f44336" hoverColor="#d32f2f">Reset</button>
    </Controls>
    <FullnessDisplay>
      <strong>Current Fullness:</strong> {(fullness * 100).toFixed(1)}%
    </FullnessDisplay>
  </GraphContainer>
);
