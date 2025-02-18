import React, { useState } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AnimatedBrain from './AnimatedBrain';
import IntentResult from './IntentResult';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  overflow: hidden;
`;

const QueryContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: white;
  z-index: 10;
  width: 600px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #00ff87 0%, #60efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const QueryInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ff87;
    background: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
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
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid #ffffff20;
  border-top: 3px solid #00ff87;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: query.trim()
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setPrediction(result.prediction);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <AnimatedBrain isProcessing={isLoading} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <QueryContainer>
        <Title>What can I help you with?</Title>
        <QueryInput
          placeholder="Type your question here... (e.g., 'How do I create an account?' or 'I need help with my billing')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        
        <Button onClick={handleSubmit} disabled={!query.trim() || isLoading}>
          {isLoading ? 'Processing...' : 'Analyze Intent'}
        </Button>

        {isLoading && <LoadingSpinner />}
        
        {prediction && <IntentResult prediction={prediction} />}
      </QueryContainer>
    </PageContainer>
  );
};

export default QueryPage;
