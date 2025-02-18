import React from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AnimatedBrain from './AnimatedBrain';
import { useNavigate } from 'react-router-dom';

const LandingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00ff87 0%, #60efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1s ease-in;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Description = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #ffffff80;
  animation: slideUp 1s ease-in-out;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #00ff87 0%, #60efff 100%);
  border: none;
  border-radius: 30px;
  color: #1a1a1a;
  cursor: pointer;
  transition: transform 0.3s ease;
  animation: scaleIn 1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <AnimatedBrain scale={1.5} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <ContentWrapper>
        <Title>Intent Classification</Title>
        <Description>
          Advanced ML-powered intent classification for customer service
        </Description>
        <Button onClick={() => navigate('/query')}>
          Ask a Question
        </Button>
      </ContentWrapper>
    </LandingContainer>
  );
};

export default LandingPage;
