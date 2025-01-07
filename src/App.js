// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
  Header,
  Logo,
  NavLinks,
  NavLink,
} from './styles/HeaderStyles';
import {
  GraphsContainer,
  GraphWrapper,
} from './styles/GraphStyles';
import {
  AddButton,
  CloseButton,
  ArchetypeItem,
  ArchetypeList,
  ModalContent
} from './styles/ButtonStyles';
import StomachFullnessGraph from './Components/StomachFullness_Graph';
import AddArchetypeModal from './Components/AddArchetypeModal';
import DigestiveHealth from './Components/DigestiveHealth'; // Import the new component
import QuoteComponent from './Components/QuoteComponent';
import { archetypeConfig } from './Components/ArchetypeSimulator';
import InfoWithTooltip from './Components/ShortGuide';
import './styles/App.css';
import GlobalStyles from './styles/GlobalStyles';
import TopLeftDropdown from './styles/TopLeftDropdown';
import Modal from 'react-modal'; // Import Modal




function App() {
  const [archetypes, setArchetypes] = useState([
    archetypeConfig["ModernMan"],
    archetypeConfig["TheCentenarian"], // Append Here Archtypes added to Default Generation
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveArchetype = (newArchetype) => {
    console.log('New Archetype Data:', newArchetype);
    setArchetypes((prevArchetypes) => [...prevArchetypes, newArchetype]);
  };

  const handleRemoveArchetype = (indexToRemove) => {
    setArchetypes((prevArchetypes) =>
      prevArchetypes.filter((_, index) => index !== indexToRemove)
    );
  };


  const [isDefaultsModalOpen, setIsDefaultsModalOpen] = useState(false);

  const handleOpenDefaultsModal = () => setIsDefaultsModalOpen(true);
  const handleCloseDefaultsModal = () => setIsDefaultsModalOpen(false);

  const handleSelectDefault = (selectedArchetype) => {
    console.log('Selected default:', selectedArchetype);
    setArchetypes((prevArchetypes) => [...prevArchetypes, selectedArchetype]); // Add selected archetype to state
  };

  const DefaultsModal = ({ isOpen, onClose, onSelect }) => {
    const archetypes = Object.keys(archetypeConfig).map(key => archetypeConfig[key]);

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
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            backgroundColor: 'white',
          },
        }}
      >
        <ModalContent>
          <h2>Default Archetypes</h2>
          <p>Select a default archetype to pre-fill the simulator:</p>
          <ArchetypeList>
            {archetypes.map((archetype) => (
              <ArchetypeItem
                key={archetype.name}
                onClick={() => {
                  onSelect(archetype);
                  onClose();
                }}
              >
                {archetype.name}
              </ArchetypeItem>
            ))}
          </ArchetypeList>
          <button onClick={onClose}>Close</button>
        </ModalContent>
      </Modal>
    );
  };


  return (
    <Router basename="">
    <div className="AppContainer">
    <GlobalStyles />
        {/* Header with Navigation Links */}
        <Header>
          <TopLeftDropdown />
          <Logo>The Food Prophet</Logo>

          <NavLinks>
            <NavLink to="/food-prophet">Stomach Fullness Tracker</NavLink>
            <NavLink to="/digestive-health">Digestive System Health</NavLink>
         </NavLinks>
        </Header>
        
        {/* Quote Component */}
        <QuoteComponent />

        {/* Main Content */}
        <div className="ContentWrapper">
          <Routes>
            <Route
              path="/food-prophet"
              element={
                <>
                  <InfoWithTooltip />
                  <AddButton onClick={handleOpenModal}>Add Archetype</AddButton>
                  <AddButton onClick={handleOpenModal}>Defaults</AddButton>
                  <AddArchetypeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveArchetype}
                  />

                <GraphsContainer graphCount={archetypes.length}>
                    {archetypes.map((archetype, index) => (
                      <GraphWrapper key={index}>
                        <CloseButton
                          onClick={() => handleRemoveArchetype(index)}
                        >
                          &times;
                        </CloseButton>
                        <h2>Simulation #{index + 1}</h2>
                        <StomachFullnessGraph
                          archetype={
                            archetypeConfig[archetype?.name] // Step 1: Check for matching archetype configuration
                            || archetype // Step 2: Fall back to user-inputted archetype values
                            || archetypeConfig["ModernMan"] // Step 3: Fall back to "ModernMan" as default
                          }
                        />

                      </GraphWrapper>
                    ))}
                  </GraphsContainer>
                </>
              }
            />
            <Route
              path="/digestive-health"
              element={<DigestiveHealth />} // "Coming Soon" Page
            />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;