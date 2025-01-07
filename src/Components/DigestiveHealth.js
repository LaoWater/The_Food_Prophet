import React from 'react';
import styled from 'styled-components';

// Styled component for the container
const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(51, 51, 51, 0.45); /* Semi-transparent dark grey background */
  text-align: center;
  font-family: 'Source Sans Pro', sans-serif;
`;

// Styled heading
const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: #4caf50;
`;

// Styled paragraph
const SubText = styled.p`
  font-size: 1.5rem;
  max-width: 600px;
  line-height: 1.6;
`;

const DigestiveHealth = () => {
  return (
    <ComingSoonContainer>
      <Heading>Coming Soon</Heading>
      <SubText>
        We're working hard to bring you insightful data on your digestive health. Stay tuned for updates!
      </SubText>
    </ComingSoonContainer>
  );
};

export default DigestiveHealth;
