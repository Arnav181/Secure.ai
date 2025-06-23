import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  position: relative;
  background: rgba(135, 48, 212, 0.3);
  overflow: hidden;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6);
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
  background: rgba(17, 17, 17, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  z-index: 2;

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
  background: #ffffffee;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #2d3748;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #cbd5e0;
  color: rgb(0, 0, 0);
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #8740d4;
    box-shadow: 0 0 0 3px rgba(135, 64, 212, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #8740d4;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6a2bbb;
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
          src="https://images.unsplash.com/photo-1743397015934-3aa9c6199baf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
        </Form>
      </RightSection>
    </Container>
  );
}
