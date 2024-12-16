import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingComponent = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}>
      
      <Spinner animation="border"  role="status" size="lg"></Spinner>
    </Container>
  );
};

export default LoadingComponent;
