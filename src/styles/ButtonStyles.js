// src/styles/ButtonStyles.js
import styled from 'styled-components';

export const AddButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #1976D2;
  }
`;


export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ff5c5c;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #ff0000;
  }

  
    /* Responsive styling for mobile */
  @media (max-width: 768px) {
  font-size: 2.55rem;
  }
`;




// Defaults Button

export const ArchetypeList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const ArchetypeItem = styled.li`
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

// Styled Components (moved outside the App component)
export const ModalContent = styled.div`
  padding: 20px;
`;
