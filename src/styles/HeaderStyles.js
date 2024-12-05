// src/styles/HeaderStyles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Header = styled.header`
  background-color: #333333; /* Dark grey background */
  color: white; /* White text */
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Source Sans Pro', sans-serif; /* Clean font */
`;

export const Logo = styled.div`
  font-family: 'Pacifico', cursive; /* Handwriting-like font */
  font-size: 1.8rem;
  color: white; /* White text */
  margin-left: 10px;
`;

export const NavLinks = styled.div`
  display: flex;
  justify-content: center; /* Center-align the links */
  align-items: center;
  gap: 40px; /* Space between links */
  width: 100%; /* Take full width to align properly */
  margin-left: -250px;
`;

export const NavLink = styled(Link)`
  color: white; /* White text */
  text-decoration: none;
  font-size: 1.3rem; /* Slightly larger font */
  font-family: 'Source Sans Pro', sans-serif; /* Clean font */
  font-weight: 600; /* Bold text */
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #4caf50; /* Green hover */
    color: white; /* Keep text white on hover */
  }
`;
