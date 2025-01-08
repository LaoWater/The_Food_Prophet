import React from 'react';
import Modal from 'react-modal'; // Import if needed
import { archetypeConfig } from './ArchetypeSimulator';
import {
    ArchetypeItem,
    ArchetypeList,
    ModalContent,
  } from '../styles/ButtonStyles';

const DefaultsModal = ({ isOpen, onClose, onSelect }) => {
  const archetypes = Object.keys(archetypeConfig).map(key => archetypeConfig[key]);

    // Detect mobile environment using viewport width - adjust Modal height properly
    const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
    const getMobileScrollTop = () => Math.max(
      document.body.scrollTop,
      document.documentElement.scrollTop,
      window.pageYOffset || 0
  );
  const scrollY = window.scrollY;
  const topAdjustedY = isMobile 
    ? getMobileScrollTop + window.innerHeight// For mobile
    : scrollY + window.innerHeight/2; // Adjust for desktop (e.g., top padding)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        content: {
          top: `${topAdjustedY}px`,
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%)',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          backgroundColor: 'white',
        },
      }}
    >
      <ModalContent>
        <h2>Default Archetypes</h2>
        <p style={{ color: 'black' }}>Select a default archetype to pre-fill the simulator:</p>
        <ArchetypeList>
          {archetypes.map((archetype) => (
            <ArchetypeItem
              key={archetype.name}
              onClick={() => {
                onSelect(archetype);
                onClose();
              }}
            style={{ color: 'black' }}>
              {archetype.name}
            </ArchetypeItem>
          ))}
        </ArchetypeList>
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </Modal>
  );
};


export default DefaultsModal;
