import React from "react";
import styled from "styled-components";
import { MenuButton } from "@headlessui/react";

const StyledWrapper = styled.div`
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #e3edf7;
    width: 48px;
    height: 48px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15),
      inset -2px -2px 5px rgba(255, 255, 255, 0.8),
      inset 2px 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    padding: 2px;
  }

  .btn:hover {
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1),
      inset -2px -2px 5px rgba(255, 255, 255, 0.6),
      0 8px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .btn img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Button = () => {
  return (
    <StyledWrapper>
      <MenuButton className="btn">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
        />
      </MenuButton>
    </StyledWrapper>
  );
};

export default Button;
