import React, { useState } from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';


// Styled Info Icon
const InfoIcon = styled.div`
  position: absolute;
  top: 7rem; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: #00bcd4;
  cursor: pointer;
  animation: pulse 2s infinite;
  transition: color 0.3s;

  &:hover {
    color: #0288d1;
  }

  @keyframes pulse {
    0% {
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) scale(1.1);
    }
    100% {
      transform: translateX(-50%) scale(1);
    }
  }

    /* Responsive styling for mobile */
  @media (max-width: 768px) {
  top: 1.44rem; /* Adjust as needed */
  left: 7%;
  }
`;


// Styled Tooltip
const Tooltip = styled.div`
  position: absolute;
  top: 7.5rem; /* Position tooltip above the icon */
  left: 50%;
  transform: translateX(-50%);
  max-width: 300px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.9); /* Slightly darker for visibility */
  color: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: Arial, sans-serif;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.6);
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: visibility 0.3s, opacity 0.3s;
  z-index: 9999; /* Ensures it shows above everything else */
  pointer-events: none; /* Prevent interference with hover detection */

/* Add styles for <strong> */
  strong-green {
    font-weight: bold;
    color: #00e676; /* Optional: Add a color to emphasize strong text */
  }

    strong-white {
    font-weight: bold;
    color: white; /* Optional: Add a color to emphasize strong text */
  }
    /* Responsive styling for mobile */
  @media (max-width: 768px) {
    min-width: 70%;
}
`;

const InfoWithTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Info Icon */}
      <InfoIcon
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaInfoCircle />
      </InfoIcon>

      {/* Tooltip */}
      <Tooltip isVisible={showTooltip}>
        <p>
        <strong-white>
          We are showcasing by default the Modern Man & Centenarian Archetypes. 
          <br />
          <br />*Centenarian is built upon observing the eating patterns on Earth's</strong-white>
          <strong-green> "Blue Zones"</strong-green><strong-white>, the few places where life expectancy
          is striving towards 100 years. </strong-white>
        </p>
        <p> <strong-white>
          Feel free to create your own, play around, explore, and reflect. 
          </strong-white>
        </p>
        <p> 
          <strong-white>
          For a completely manual simulation, use the Archetype Name <strong>"Manual"</strong>.
          The Web Workers will be turned off.
          </strong-white>
        </p>
      </Tooltip>
    </div>
  );
};

export default InfoWithTooltip;
