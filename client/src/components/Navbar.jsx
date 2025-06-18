import React, { useState } from "react";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";

const NavbarWrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: rgba(17, 17, 17, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgb(135, 48, 212);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon {
    width: 2rem;
    height: 2rem;
    background-color: rgb(135, 48, 212);
    border-radius: 75%;
  }

   {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }
`;

const NavLinks = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    gap: 1.5rem;
  }

  a {
    cursor: pointer;
    color: #ccc;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
      color: #a855f7;
    }
  }
`;

const CTA = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }

  button {
    background: linear-gradient(to right, #6b21a8, #4c1d95);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 8px #6b21a8;
    }
  }
`;

const MenuToggle = styled.div`
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 75%;
  max-width: 300px;
  background-color: #222;
  padding: 1.5rem 1rem;
  border-radius: 0 0 0 1rem;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;

  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  a {
    display: block;
    color: #ccc;
    margin-bottom: 1rem;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: #a855f7;
    }
  }

  button {
    width: 100%;
    background: linear-gradient(to right, #6b21a8, #4c1d95);
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Codebase", link: "/" },
    { name: "Info", link: "/info" },
    { name: "Laws", link: "/laws" },
    { name: "Updates and News", link: "/updates" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <NavbarWrapper>
      <Container>
        <Logo>
          <div className="icon"></div>
          <span>Secure.ai</span>
        </Logo>

        <NavLinks>
          {navItems.map((item) => (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ))}
        </NavLinks>

        <CTA>
          <button>Profile</button>
        </CTA>

        <MenuToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? "✕" : "☰"}
        </MenuToggle>
      </Container>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <ArrowLeft
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            cursor: "pointer",
            color: "#ccc",
          }}
        />
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.name}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}
        <button>Profile</button>
      </MobileMenu>
    </NavbarWrapper>
  );
};

export default Navbar;
