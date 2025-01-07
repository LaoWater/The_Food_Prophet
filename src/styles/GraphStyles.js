// src/styles/GraphStyles.js
import styled from 'styled-components';

export const GraphsContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ graphCount }) => (graphCount === 1 ? "1fr" : "1fr 1fr")}; // One or two columns
  gap: 20px;
  justify-items: center; // Center-align the graphs horizontally
  align-items: ${({ graphCount }) => (graphCount === 1 ? "center" : "start")}; // Center-align vertically if one graph
  margin-top: 30px;
  min-height: ${({ graphCount }) => (graphCount === 1 ? "60vh" : "auto")}; // Add height to vertically center the graph


  @media (max-width: 900px) {
    grid-template-columns: 1fr; // Stack graphs on smaller screens
    width: 100%; /* Take 95% of the screen width */
    margin-bottom: 33px; /* Center the graph */
    margin-top: 30px;
    gap: 40px;
  }
`;

export const GraphWrapper = styled.div`
  position: relative; /* Makes the container relative for absolute positioning */
  width: 100%;
  max-width: 900px; /* Limits the maximum width for each graph */
  border: 1px solid #ccc; /* Optional border for better visibility */
  padding: 0px; /* Padding around the graph */
  border-radius: 37px; /* Adds rounded corners */
  background-color: #ffffff; /* Background color for the graph */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for better visual effect */

  @media (max-width: 900px) {
  zoom: 0.58;

}
`;
