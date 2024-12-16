import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const NftLoadingfetch = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center "
      style={{ height: '10vh' }}>
      
      <Spinner animation="border"  role="status" size="lg"></Spinner>
    </Container>
  );
};

export default NftLoadingfetch;
