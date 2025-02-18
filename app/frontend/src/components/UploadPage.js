import React, { useState, useRef } from 'react';
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

const UploadContainer = styled(motion.div)`
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
  width: 400px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #00ff87 0%, #60efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UploadBox = styled.div`
  border: 2px dashed #ffffff40;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #00ff87;
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

const FileName = styled.p`
  margin: 1rem 0;
  color: #ffffff80;
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

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setPrediction(result.prediction);
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
      <UploadContainer>
        <Title>Upload Your File</Title>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <UploadBox onClick={() => fileInputRef.current.click()}>
          <p>Click or drag file to upload</p>
          {file && <FileName>{file.name}</FileName>}
        </UploadBox>
        
        <Button onClick={handleUpload} disabled={!file || isLoading}>
          {isLoading ? 'Processing...' : 'Predict Intent'}
        </Button>

        {isLoading && <LoadingSpinner />}
        
        {prediction && <IntentResult prediction={prediction} />}
      </UploadContainer>
    </PageContainer>
  );
};

export default UploadPage;
