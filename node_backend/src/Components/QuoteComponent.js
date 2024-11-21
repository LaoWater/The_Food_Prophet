import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Quote Data
const quotes = [
  {
    text: "Everyone’s toil is for their mouth, yet their appetite is never satisfied.",
    reference: "Ecclesiastes 6:7",
    writer: "Traditionally attributed to King Solomon, the author of Ecclesiastes.",
  },
  {
    text: "If you find honey, eat just enough—too much of it, and you will vomit.",
    reference: "Proverbs 25:16",
    writer: "King Solomon is traditionally credited as the primary author of Proverbs.",
  },
  {
    text: "Their destiny is destruction, their god is their stomach, and their glory is in their shame. Their mind is set on earthly things.",
    reference: "Philippians 3:19",
    writer: "The Apostle Paul, in his letters to the Philippians.",
  },
];

// Styled Components
const QuoteContainer = styled.div`
  position: absolute;
  top: 100px;
  right: 20px;
  max-width: 400px;
  font-family: 'Georgia', serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  font-style: italic;
  transition: opacity 2.2s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;

const VerseReference = styled.span`
  font-size: 1rem;
  font-style: normal;
  font-weight: bold;
`;

// Quote Component
const QuoteComponent = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setIsVisible(true);
      }, 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <QuoteContainer isVisible={isVisible}>
      {currentQuote.text}
      <br />
      <VerseReference>- {currentQuote.reference}</VerseReference>
    </QuoteContainer>
  );
};

export default QuoteComponent;
