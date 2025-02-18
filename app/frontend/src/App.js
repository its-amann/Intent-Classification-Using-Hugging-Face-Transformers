import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './components/LandingPage';
import QueryPage from './components/QueryPage';

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  color: #00ff87;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #ffffff20;
  border-top: 5px solid #00ff87;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function App() {
  return (
    <Router>
      <Suspense fallback={
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/query" element={<QueryPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
