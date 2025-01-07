import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Quote Data
const quotes = [
  {
    text: "Everyone’s toil is for their mouth, yet their appetite is never satisfied.",
    reference: "Ecclesiastes 6:7",
  },
  {
    text: "If you find honey, eat just enough—too much of it, and you will vomit.",
    reference: "Proverbs 25:16",
  },
  {
    text: "Their destiny is destruction, their god is their stomach, and their glory is in their shame. Their mind is set on earthly things.",
    reference: "Philippians 3:19",
  },
  {
    text: "If you wish to be self-disciplined, abstain from the excess of food and drink, for gluttony leads to a loss of control.",
    reference: "Epictetus",
  },
  {
    text: "Eat in moderation, and you will avoid sickness. The wise care for their bodies as a potter cares for clay.",
    reference: "Dōgen Zenji",
  },
  { 
    text: "Yoga is not for the one who eats too much, nor for the one who fasts too much. The right way is found in balance.",
    reference: "Hindu Bhagavad Gita (6.16-17)",
  },
  {
    text: "Excess and deficiency alike are to be avoided; moderation is the true way.",
    reference: "Confucius (Analects 7.16)",
  },
];

// Styled Components
const QuoteContainer = styled.div`
  position: absolute;
  top: 5%;
  right: 11%;
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

  @media (max-width: 768px) {
    position: relative; /* Move to a relative position */
    top: 30px; /* Adjust top margin for spacing */
    right: auto; /* Remove right alignment */
    max-width: 90%; /* Allow the quote to take more width */
    margin: 0 auto; /* Center-align for mobile */
    text-align: center; /* Center the text */
    font-size: 1rem; /* Reduce font size for smaller screens */
    padding: 8px 12px; /* Adjust padding for compact look */
    
  }
`;

const VerseReference = styled.span`
  font-size: 1rem;
  font-style: normal;
  font-weight: bold;

  @media (max-width: 768px) {
  font-size: 0.9rem; /* Adjust size for smaller screens */
  }
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
    }, 8000);

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



