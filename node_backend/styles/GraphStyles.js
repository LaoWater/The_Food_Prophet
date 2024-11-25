// src/styles/GraphStyles.js
import styled from 'styled-components';

export const GraphsContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ graphCount }) => (graphCount === 1 ? "1fr" : "1fr 1fr")}; // One or two columns
  gap: 20px;
  justify-items: center; // Center-align the graphs horizontally
  align-items: ${({ graphCount }) => (graphCount === 1 ? "center" : "start")}; // Center-align vertically if one graph
  margin-top: 20px;
  min-height: ${({ graphCount }) => (graphCount === 1 ? "60vh" : "auto")}; // Add height to vertically center the graph
  @media (max-width: 900px) {
    grid-template-columns: 1fr; // Stack graphs on smaller screens
  }
`;

export const GraphWrapper = styled.div`
  position: relative; /* Makes the container relative for absolute positioning */
  width: 100%;
  max-width: 900px; /* Limits the maximum width for each graph */
  border: 1px solid #ccc; /* Optional border for better visibility */
  padding: 20px; /* Padding around the graph */
  border-radius: 8px; /* Adds rounded corners */
  background-color: #ffffff; /* Background color for the graph */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for better visual effect */
`;
