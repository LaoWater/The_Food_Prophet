// src/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';


const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {

  }

  /* Base Styles */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-image: 
      linear-gradient(to bottom, rgba(51, 51, 51, 1), rgba(51, 51, 51, 0.7), rgba(0, 0, 0, 0.7)),
      url('/static/ReactPage_FoodProphet/white_lotus.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    filter: brightness(1) blur(0px);
    color: #333;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    zoom: 0.73;
  }


  button {
    cursor: pointer;
    padding: 10px 20px;
    border: none;
    background-color: #4CAF50;
    color: white;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #45a049;
  }

  button:focus {
    outline: none;
  }
`;

export default GlobalStyles;
