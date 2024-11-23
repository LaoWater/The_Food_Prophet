// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import styled from 'styled-components';
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


// Styled components
const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0px;
  text-align: center;
  position: relative; /* Required for pseudo-elements */
  overflow: hidden;

  /* Background handled by pseudo-element */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(to bottom, rgba(51, 51, 51, 1), rgba(51, 51, 51, 0.7), rgba(0, 0, 0, 0.7)), /* Dark gradient blending */
      url("/white_lotus.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* Parallax effect */
    filter: brightness(1) blur(0px); /* Optional brightness and blur */
    z-index: -1; /* Ensures it's behind all content */
  }
`;


const ContentWrapper = styled.div`
  margin-top: 70px; /* Add margin to compensate for the fixed header */
  text-align: center; /* Ensures children like buttons are centered */
`;


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
      <AppContainer>
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
        <ContentWrapper>
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
                          archetype={archetype || archetypeConfig["ModernMan"]}
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
        </ContentWrapper>
      </AppContainer>
    </Router>
  );
}

export default App;