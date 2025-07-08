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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ParallaxSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;
  padding: 0 1rem;
  position: relative;
`;

const ContentSection = styled.section`
  min-height: 100vh;
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  color: #3b82f6;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${fadeIn} 1s ease forwards;
`;

const SectionSubtitle = styled.h3`
  color: #60a5fa;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: ${slideInLeft} 1s ease forwards;
`;

const SectionText = styled.p`
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${fadeIn} 1.2s ease forwards;
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1200px;
  width: 100%;
`;

const ServiceCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: ${slideInRight} 1s ease forwards;
  
  &:hover {
    transform: translateY(-10px);
    border-color: #3b82f6;
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
  }
`;

const ServiceIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ServiceTitle = styled.h4`
  color: #60a5fa;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
  max-width: 1000px;
  width: 100%;
`;

const AboutCard = styled.div`
  text-align: center;
  animation: ${fadeIn} 1.5s ease forwards;
`;

const AboutIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
`;

const AboutTitle = styled.h4`
  color: #60a5fa;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const AboutDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
`;

const Footer = styled.footer`
  background: #0f172a;
  border-top: 1px solid #334155;
  padding: 3rem 2rem 1rem;
  text-align: center;
  z-index: 2;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  text-align: left;
`;

const FooterTitle = styled.h4`
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #60a5fa;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #334155;
  padding-top: 1rem;
  color: #64748b;
  font-size: 0.9rem;
`;

function LandingModule() {
  return (
    <>
      <Container>
        <Navbar />
        <ParallaxSection>
          <WelcomeText>Welcome to Secure.ai</WelcomeText>
          <Description>
            Your trusted platform for secure and intelligent solutions. Explore our
            codebase, learn about laws, get updates, and more.
          </Description>
        </ParallaxSection>
      </Container>

      <ContentSection>
        <SectionTitle>Our Services</SectionTitle>
        <SectionText>
          We provide cutting-edge AI solutions with security at the forefront. Our comprehensive suite of services 
          ensures your data remains protected while delivering powerful intelligent capabilities.
        </SectionText>
        <ServicesGrid>
          <ServiceCard>
            <ServiceIcon>⚖️</ServiceIcon>
            <ServiceTitle>Legal Compliance</ServiceTitle>
            <ServiceDescription>
              Stay compliant with evolving regulations and laws. Our platform helps you navigate complex 
              legal requirements in the AI space.
            </ServiceDescription>
          </ServiceCard>
          
          <ServiceCard>
            <ServiceIcon>🔍</ServiceIcon>
            <ServiceTitle>Code Analysis</ServiceTitle>
            <ServiceDescription>
              Comprehensive code review and security analysis tools to ensure your applications 
              meet the highest standards.
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard>
            <ServiceIcon>📊</ServiceIcon>
            <ServiceTitle>Real-time Updates</ServiceTitle>
            <ServiceDescription>
              Stay informed with real-time updates on security threats, legal changes, and 
              technology developments.
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ContentSection>

      <ContentSection style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <SectionTitle>About Us</SectionTitle>
        <SectionText>
          At Secure.ai, we believe that artificial intelligence should be both powerful and secure. 
          Our mission is to bridge the gap between cutting-edge AI technology and enterprise security, 
          providing solutions that don't compromise on either front.
        </SectionText>
        <AboutGrid>
          <AboutCard>
            <AboutIcon>🎯</AboutIcon>
            <AboutTitle>Our Mission</AboutTitle>
            <AboutDescription>
              To democratize secure AI solutions and make advanced artificial intelligence accessible 
              to businesses of all sizes while maintaining the highest security standards.
            </AboutDescription>
          </AboutCard>
          <AboutCard>
            <AboutIcon>👥</AboutIcon>
            <AboutTitle>Our Team</AboutTitle>
            <AboutDescription>
              A diverse group of AI researchers, security experts, and legal professionals working 
              together to create the most secure and intelligent platform.
            </AboutDescription>
          </AboutCard>
          <AboutCard>
            <AboutIcon>🔮</AboutIcon>
            <AboutTitle>Our Vision</AboutTitle>
            <AboutDescription>
              To become the leading platform for secure AI solutions, setting new standards for 
              privacy, security, and intelligent automation in the digital age.
            </AboutDescription>
          </AboutCard>
          <AboutCard>
            <AboutIcon>💡</AboutIcon>
            <AboutTitle>Innovation</AboutTitle>
            <AboutDescription>
              Constantly pushing the boundaries of what's possible with AI while ensuring every 
              solution meets rigorous security and compliance requirements.
            </AboutDescription>
          </AboutCard>
        </AboutGrid>
      </ContentSection>

      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>Company</FooterTitle>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#services">Services</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Products</FooterTitle>
            <FooterLink href="#ai-solutions">AI Solutions</FooterLink>
            <FooterLink href="#security">Security Tools</FooterLink>
            <FooterLink href="#compliance">Compliance</FooterLink>
            <FooterLink href="#analytics">Analytics</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLink href="#docs">Documentation</FooterLink>
            <FooterLink href="#blog">Blog</FooterLink>
            <FooterLink href="#support">Support</FooterLink>
            <FooterLink href="#api">API</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#cookies">Cookie Policy</FooterLink>
            <FooterLink href="#security">Security</FooterLink>
          </FooterSection>
        </FooterContent>
        <FooterBottom>
          <p>&copy; 2025 Secure.ai. All rights reserved. | Empowering secure AI solutions worldwide.</p>
        </FooterBottom>
      </Footer>
    </>
  );
}

export default LandingModule;