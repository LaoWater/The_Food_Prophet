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
} from './styles/ButtonStyles';
import StomachFullnessGraph from './Components/StomachFullness_Graph';
import AddArchetypeModal from './Components/AddArchetypeModal';
import DigestiveHealth from './Components/DigestiveHealth'; // Import the new component
import QuoteComponent from './Components/QuoteComponent';
import { archetypeConfig } from './Components/ArchetypeSimulator';
import './styles/App.css';


function App() {
  const [archetypes, setArchetypes] = useState([archetypeConfig["ModernMan"]]);
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

  return (
    <Router>
    <div className="AppContainer">
      {/* Quote Component */}
        <QuoteComponent />
        {/* Header with Navigation Links */}
        <Header>
          <Logo>The Food Prophet</Logo>
          <NavLinks>
            <NavLink to="/">Stomach Fullness Tracker</NavLink>
            <NavLink to="/digestive-health">Digestive System Health</NavLink>
          </NavLinks>
        </Header>

        {/* Main Content */}
        <div className="ContentWrapper">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AddButton onClick={handleOpenModal}>Add Archetype</AddButton>
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