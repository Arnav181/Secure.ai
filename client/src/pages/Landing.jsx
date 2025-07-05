import React from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "../components/Navbar";

const moveBackground = keyframes`
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 40px 40px, 40px 40px;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #000000;
  background-image:
    linear-gradient(90deg, #0a1a2a 50%, #000000 50%),
    linear-gradient(#0a1a2a 50%, #000000 50%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
  animation: ${moveBackground} 20s linear infinite;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;
  padding: 0 1rem;
`;

const WelcomeText = styled.h1`
  color: #3b82f6;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: ${fadeIn} 2s ease forwards;
`;

const Description = styled.p`
  color: #93c5fd;
  font-size: 1.25rem;
  max-width: 600px;
  animation: ${fadeIn} 2.5s ease forwards;
`;

function LandingModule() {
  return (
    <Container>
      <Navbar />
      <ContentWrapper>
        <WelcomeText>Welcome to Secure.ai</WelcomeText>
        <Description>
          Your trusted platform for secure and intelligent solutions. Explore our
          codebase, learn about laws, get updates, and more.
        </Description>
      </ContentWrapper>
    </Container>
  );
}

export default LandingModule;
