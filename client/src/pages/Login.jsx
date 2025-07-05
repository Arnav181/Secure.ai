import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
 position: relative;
 min-height: 100vh;
 display: flex;
 flex-direction: row;
 background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
 @media (max-width: 768px) {
   flex-direction: column;
 }
`;

const LeftSection = styled.div`
 flex: 1;
 position: relative;
 background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 197, 253, 0.3) 50%, rgba(219, 234, 254, 0.2) 100%);
 overflow: hidden;
 z-index: 1;

 &::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%);
   z-index: 1;
 }

 img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   filter: brightness(0.4) saturate(0.8) hue-rotate(200deg);
 }

 @media (max-width: 768px) {
   display: none;
 }
`;

const RightSection = styled.div`
 flex: 1;
 background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(51, 65, 85, 0.7) 100%);
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 2rem;
 min-height: 100vh;
 z-index: 2;

 @media (min-width: 768px) {
   position: relative;
   background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(51, 65, 85, 0.2) 100%);
   backdrop-filter: blur(12px);
   padding: 1.5rem;
   min-height: unset;
   width: max-content;
 }
`;

const Form = styled.form`
 width: 100%;
 max-width: 30rem;
 background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
 border: 1px solid rgba(147, 197, 253, 0.3);
 border-radius: 1.5rem;
 padding: 2.5rem;
 box-shadow: 
   0 25px 50px rgba(0, 0, 0, 0.3),
   0 0 0 1px rgba(147, 197, 253, 0.1),
   inset 0 1px 0 rgba(255, 255, 255, 0.6);
 display: flex;
 flex-direction: column;
 gap: 1.25rem;
 backdrop-filter: blur(10px);

 @media (max-width: 768px) {
   background: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.85) 100%);
   padding: 2rem;
 }
`;

const Title = styled.h2`
 font-size: 2rem;
 font-weight: 700;
 text-align: center;
 background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
 text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
 font-size: 0.95rem;
 background: linear-gradient(135deg, #475569 0%, #64748b 100%);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
 margin-bottom: 0.4rem;
 font-weight: 500;
`;

const Input = styled.input`
 width: 100%;
 padding: 0.75rem;
 font-size: 1rem;
 border: 1px solid rgba(147, 197, 253, 0.4);
 background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
 color: #1e293b;
 border-radius: 0.5rem;
 outline: none;
 transition: all 0.3s ease-in-out;
 box-shadow: 
   0 2px 4px rgba(0, 0, 0, 0.05),
   inset 0 1px 2px rgba(0, 0, 0, 0.05);

 &:focus {
   border-color: #3b82f6;
   background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
   box-shadow: 
     0 0 0 3px rgba(59, 130, 246, 0.2),
     0 4px 12px rgba(59, 130, 246, 0.15),
     inset 0 1px 2px rgba(0, 0, 0, 0.05);
   transform: translateY(-1px);
 }
`;

const Button = styled.button`
 padding: 0.75rem;
 font-size: 1rem;
 background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
 color: white;
 border: none;
 border-radius: 0.5rem;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.3s ease;
 box-shadow: 
   0 4px 12px rgba(59, 130, 246, 0.3),
   inset 0 1px 0 rgba(255, 255, 255, 0.2);
 text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

 &:hover {
   background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
   transform: translateY(-2px);
   box-shadow: 
     0 8px 20px rgba(59, 130, 246, 0.4),
     inset 0 1px 0 rgba(255, 255, 255, 0.2);
 }

 &:active {
   transform: translateY(0);
   box-shadow: 
     0 2px 8px rgba(59, 130, 246, 0.3),
     inset 0 1px 0 rgba(255, 255, 255, 0.2);
 }
`;

const ForgotPassword = styled.a`
 font-size: 0.9rem;
 background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
 cursor: pointer;
 text-align: right;
 margin-top: -0.5rem;
 margin-bottom: 1rem;
 text-decoration: underline;
 transition: all 0.3s ease;
 font-weight: 500;

 &:hover {
   background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   background-clip: text;
   transform: translateX(-2px);
 }
`;

export default function LoginModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    try {
      axios
        .post(
          "http://localhost:8080/user/login",
          { email, password },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 201) {
            console.log("Login Successfull");
          } else {
            console.log("Login Failed");
          }
        });
    } catch (err) {
      console.log("Error In Login", err);
    }
  };

  return (
    <Container>
      <LeftSection>
        <img
          src="https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D"
          alt="Login Visual"
        />
      </LeftSection>

      <RightSection>
        <Form onSubmit={handleOnSubmit}>
          <Title>Log In</Title>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <ForgotPassword href="#">Forgot password?</ForgotPassword>

          <Button type="submit">Log In</Button>
        </Form>
      </RightSection>
    </Container>
  );
}
