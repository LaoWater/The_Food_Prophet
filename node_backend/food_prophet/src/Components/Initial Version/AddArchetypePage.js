// src/components/AddArchetypePage.js

import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ProbabilityInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AddArchetypePage = ({ onSave }) => {
  const [newArchetype, setNewArchetype] = useState({
    startEatingHour: 6,
    stopEatingHour: 22,
    mealInterval: 2,
    mealDistribution: [0.25, 0.25, 0.25, 0.25], // Initial equal distribution
  });

  const handleInputChange = (field, value) => {
    setNewArchetype((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProbabilityChange = (index, value) => {
    const newDistribution = [...newArchetype.mealDistribution];
    newDistribution[index] = parseFloat(value);
    setNewArchetype((prev) => ({
      ...prev,
      mealDistribution: newDistribution,
    }));
  };

  const handleSubmit = () => {
    onSave(newArchetype);
  };

  return (
    <Container>
      <h2>Add New Archetype</h2>
      <Label>Start Eating Hour (avg):</Label>
      <Input
        type="number"
        value={newArchetype.startEatingHour}
        onChange={(e) => handleInputChange('startEatingHour', parseInt(e.target.value))}
        min="0"
        max="23"
      />
      <Label>Stop Eating Hour (avg):</Label>
      <Input
        type="number"
        value={newArchetype.stopEatingHour}
        onChange={(e) => handleInputChange('stopEatingHour', parseInt(e.target.value))}
        min="0"
        max="23"
      />
      <Label>Meal Interval (avg hours):</Label>
      <Input
        type="number"
        value={newArchetype.mealInterval}
        onChange={(e) => handleInputChange('mealInterval', parseFloat(e.target.value))}
        min="0.5"
        step="0.5"
      />
      <Label>Meal Distribution Probabilities (must sum to 1):</Label>
      {['Small Meal', 'Medium Meal', 'Big Meal', 'Absolute Max Meal'].map((label, index) => (
        <div key={index}>
          <Label>{label}:</Label>
          <ProbabilityInput
            type="number"
            value={newArchetype.mealDistribution[index]}
            onChange={(e) => handleProbabilityChange(index, e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      ))}
      <Button onClick={handleSubmit}>Save Archetype</Button>
    </Container>
  );
};

export default AddArchetypePage;
