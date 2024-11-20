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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
`;

const HalfWidthInput = styled(Input)`
  width: 48%;
`;

const Slider = styled.input`
  width: 100%;
  margin-bottom: 5px;
  height: 8px;
  border-radius: 5px;
  appearance: none;
  background: linear-gradient(
    to right,
    #2196F3 ${(props) => props.value * 100}%,
    #ddd ${(props) => props.value * 100}%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    background: #2196F3; /* Changed to blue */
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
  }
`;


const Button = styled.button`
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
`;

const AddArchetypeModal = ({ isOpen, onClose, onSave }) => {
  const [newArchetype, setNewArchetype] = useState({
    name: '',
    startEatingHour: 6,
    stopEatingHour: 22,
    mealInterval: 2,
    mealDistribution: [0.25, 0.25, 0.25, 0.25],
    fullSedentarismStartHour: 0,
    fullSedentarismEndHour: 23,
  });

  if (!isOpen) return null;

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

    const normalizedDistribution = newArchetype.mealDistribution.map((val) => val / total);
    setNewArchetype((prev) => ({
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

        <Label>Eating Hours:</Label>
        <Row>
          <HalfWidthInput
            type="number"
            value={newArchetype.startEatingHour}
            onChange={(e) => handleInputChange('startEatingHour', parseInt(e.target.value))}
            min="0"
            max="23"
            placeholder="Start Hour"
          />
          <HalfWidthInput
            type="number"
            value={newArchetype.stopEatingHour}
            onChange={(e) => handleInputChange('stopEatingHour', parseInt(e.target.value))}
            min="0"
            max="23"
            placeholder="Stop Hour"
          />
        </Row>

        <Label>Meal Interval:</Label>
        <Input
          type="number"
          value={newArchetype.mealInterval}
          onChange={(e) => handleInputChange('mealInterval', parseFloat(e.target.value))}
          min="0.5"
          step="0.5"
        />

        <Label>
          Full Sedentarism Hours:
          <br />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            *Define the time range during which the individual gruadually becomes fully sedentary.
          </span>
        </Label>
        <Row>
          <HalfWidthInput
            type="number"
            value={newArchetype.fullSedentarismStartHour}
            onChange={(e) => handleInputChange('fullSedentarismStartHour', parseInt(e.target.value))}
            min="0"
            max="23"
            placeholder="Start Hour"
          />
          <HalfWidthInput
            type="number"
            value={newArchetype.fullSedentarismEndHour}
            onChange={(e) => handleInputChange('fullSedentarismEndHour', parseInt(e.target.value))}
            min="0"
            max="23"
            placeholder="End Hour"
          />
        </Row>

        <Label>
          Meal Distribution Probabilities:
          <br />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            *The probability of a specific meal quantity<br />
            Probabilities must sum to 1. Use Equalize & Normalize to balance distribution.
          </span>
        </Label>

        {['Small Meal', 'Medium Meal', 'Big Meal', 'Absolute Max Meal'].map((label, index) => (
          <div key={index}>
            <Label>
              {label} ({(newArchetype.mealDistribution[index] * 100).toFixed(0)}%)
            </Label>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={newArchetype.mealDistribution[index]}
              onChange={(e) => handleProbabilityChange(index, e.target.value)}
            />
          </div>
        ))}

        <Button onClick={normalizeProbabilities}>Equalize & Normalize Probabilities</Button>
        <Button onClick={handleSubmit}>Save Archetype</Button>
        <Button onClick={onClose} style={{ backgroundColor: '#f44336' }}>
          Cancel
        </Button>
      </ModalContent>
    </ModalBackground>
  );
};

export default AddArchetypeModal;
