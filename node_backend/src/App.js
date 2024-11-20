// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import StomachFullnessGraph from './Components/StomachFullness_Graph';
import AddArchetypeModal from './Components/AddArchetypeModal'; // Import the modal component

// Styled components
const AppContainer = styled.div`
  width: 58%;
  padding: 20px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.header`
  background-color: #0a2540; /* Dark shade of blue */
  color: #f5f5f5; /* Light white color */
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px; /* Space between links */
`;

const NavLink = styled(Link)`
  color: #f5f5f5;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 8px 12px;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
`;

const GraphsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // Two columns for graphs
  gap: 10px;
  justify-items: center; // Center-align the graphs horizontally
  margin-top: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr; // Stack graphs on smaller screens
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  max-width: 900px; // Limit maximum width for each graph
`;

const AddButton = styled.button`
  margin: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
`;

function App() {
  const [archetypes, setArchetypes] = useState([{ name: "ModernMan" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveArchetype = (newArchetype) => {
    console.log("New Archetype Data:", newArchetype);
    setArchetypes((prevArchetypes) => [...prevArchetypes, newArchetype]);
  };

  return (
    <Router>
      <AppContainer>
        {/* Header with Navigation Links */}
        <Header>
          <NavLinks>
            <NavLink to="/">Stomach Fullness Tracker</NavLink>
            <NavLink to="/digestive-health">Digestive System Health</NavLink>
          </NavLinks>
        </Header>

        {/* Main Content */}
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
                <GraphsContainer>
                  {archetypes.map((archetype, index) => (
                    <GraphWrapper key={index}>
                      <h2>Simulation #{index + 1}</h2>
                      <StomachFullnessGraph archetype={archetype || "ModernMan"} />
                    </GraphWrapper>
                ))
                /* <GraphWrapper>
                  <h2>Simulation #2</h2>
                  <StomachFullnessGraph archetype="PonPon" />
                </GraphWrapper>
                <GraphWrapper>
                  <h2>Simulation #3</h2>
                  <StomachFullnessGraph archetype="Lao" />
                </GraphWrapper>
                <GraphWrapper>
                  <h2>Simulation #4</h2>
                  <StomachFullnessGraph archetype="Custom" />
                </GraphWrapper> */
              }
              </GraphsContainer>
              </>
            }
          />
          <Route path="/digestive-health" element={<div>Coming Soon: Digestive System Health</div>} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;