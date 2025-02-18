import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ResultContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  color: white;
`;

const IntentTitle = styled(motion.h3)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00ff87 0%, #60efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const IntentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IntentLabel = styled.span`
  font-size: 1.1rem;
  color: white;
`;

const ConfidenceBar = styled(motion.div)`
  width: ${props => props.confidence}%;
  height: 4px;
  background: linear-gradient(90deg, #00ff87 0%, #60efff 100%);
  border-radius: 2px;
  margin-top: 0.5rem;
`;

const IntentResult = ({ prediction }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Format the prediction result
  // Assuming prediction is an object with intent and confidence
  const { intent, confidence = 85 } = prediction;

  return (
    <ResultContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <IntentTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Intent Classification Result
      </IntentTitle>

      <IntentCard variants={itemVariants}>
        <div>
          <IntentLabel>{intent}</IntentLabel>
          <ConfidenceBar 
            confidence={confidence}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {confidence}%
        </motion.span>
      </IntentCard>
    </ResultContainer>
  );
};

export default IntentResult;
