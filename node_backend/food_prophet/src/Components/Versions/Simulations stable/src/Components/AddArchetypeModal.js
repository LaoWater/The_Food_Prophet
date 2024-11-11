// src/components/AddArchetypeModal.js

import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  text-align: left;
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

const SliderContainer = styled.div`
  margin-bottom: 15px;
`;

const SliderLabel = styled.div`
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const Slider = styled.input`
  width: 100%;
  margin-bottom: 5px;
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

const AddArchetypeModal = ({ isOpen, onClose, onSave }) => {
  const [newArchetype, setNewArchetype] = useState({
    name: '',
    startEatingHour: 6,
    stopEatingHour: 22,
    mealInterval: 2,
    mealDistribution: [0.25, 0.25, 0.25, 0.25], // Initial equal distribution
  });

  if (!isOpen) return null; // Return null if modal is not open

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

  const normalizeProbabilities = () => {
    const total = newArchetype.mealDistribution.reduce((acc, val) => acc + val, 0);
    if (total === 0) return;

    const normalizedDistribution = newArchetype.mealDistribution.map(val => (val / total));
    setNewArchetype(prev => ({
      ...prev,
      mealDistribution: normalizedDistribution,
    }));
  };

  const handleSubmit = () => {
    onSave(newArchetype);
    onClose();
  };

  return (
    <ModalBackground>
      <ModalContent>
        <h3>Add New Archetype</h3>
        <Label>Archetype Name:</Label>
        <Input
          type="text"
          value={newArchetype.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter Archetype Name"
        />
        <Label>Start Eating Hour:</Label>
        <Input
          type="number"
          value={newArchetype.startEatingHour}
          onChange={(e) => handleInputChange('startEatingHour', parseInt(e.target.value))}
          min="0"
          max="23"
        />
        <Label>Stop Eating Hour:</Label>
        <Input
          type="number"
          value={newArchetype.stopEatingHour}
          onChange={(e) => handleInputChange('stopEatingHour', parseInt(e.target.value))}
          min="0"
          max="23"
        />
        <Label>
          Meal Interval:<br />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            *Average time between meals
          </span>
        </Label>
        <Input
          type="number"
          value={newArchetype.mealInterval}
          onChange={(e) => handleInputChange('mealInterval', parseFloat(e.target.value))}
          min="0.5"
          step="0.5"
        />

        <Label>
          Meal Distribution Probabilities:<br />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            *The probability of a specific meal quantity<br />
            Probabilities must sum to 1. <br />Use Equalize & Normalize to balance distribution.
          </span>
        </Label>

        {/* Volume bars for each meal type */}
        {['Small Meal', 'Medium Meal', 'Big Meal', 'Absolute Max Meal'].map((label, index) => (
          <SliderContainer key={index}>
            <SliderLabel>{label} ({(newArchetype.mealDistribution[index] * 100).toFixed(0)}%)</SliderLabel>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={newArchetype.mealDistribution[index]}
              onChange={(e) => handleProbabilityChange(index, e.target.value)}
            />
          </SliderContainer>
        ))}

        <Button onClick={normalizeProbabilities}>Equalize & Normalize Probabilities</Button>
        <Button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Save Archetype</Button>
        <Button onClick={onClose} style={{ backgroundColor: '#f44336', marginLeft: '10px' }}>Cancel</Button>
      </ModalContent>
    </ModalBackground>
  );
};

export default AddArchetypeModal;
