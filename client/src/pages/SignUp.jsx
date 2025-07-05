import { useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #000814, #001d3d);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${slideInLeft} 1s ease forwards;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.9) contrast(1.05);
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05) rotate(1deg);
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }
`;

const RightSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #000814, #001d3d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  z-index: 2;
  animation: ${slideInRight} 1s ease forwards;

  @media (max-width: 768px) {
    position: relative;
    background: transparent;
    backdrop-filter: blur(6px);
    padding: 1.5rem;
    min-height: unset; /* <-- fix added */
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 30rem;
  background: #0a192f;
  border: 1px solid #1e3a8a;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(3, 102, 214, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 1.5s ease forwards;

  @media (max-width: 768px) {
    background: #0a192f;
    padding: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #3b82f6;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #cbd5e1;
  margin-bottom: 0.4rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #3b82f6;
  background: #1e293b;
  color: #e0f2fe;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.7);
    background: #273549;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.6);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
  }
`;

export default function SignupModule() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    try {
      axios
        .post("http://localhost:8080/user/signup", {
          username: name,
          email,
          password,
        })
        .then((response) => {
          if (response.status === 201) {
            console.log("Form Submitted Successfully");
          } else {
            console.log("Signup failed");
          }
        });
    } catch (err) {
      console.log(`Error in sign up : ${err}`);
    }
  };

  return (
    <Container>
      <LeftSection>
        <img
          src="https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D"
          alt="Signup Visual"
        />
      </LeftSection>

      <RightSection>
        <Form onSubmit={handleOnSubmit}>
          <Title>Sign Up</Title>

          <div>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Your Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <Button type="submit">Create Account</Button>
          <LogInLink to="/login">Already have an account? Log In</LogInLink>
        </Form>
      </RightSection>
    </Container>
  );
}

const LogInLink = styled(Link)`
  font-size: 0.9rem;
  color: #6a2bbb;
  text-align: right;
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-top: 0.25rem;
  transition: color 0.3s ease;

  &:hover {
    color: #8740d4;
  }
`;
