import { Container } from '@chakra-ui/react';
import React from 'react';
import { FC } from 'react';
import DrawCanvas from './components/draw-canvas';

const App: FC = () => {
  return (
    <Container>
      <DrawCanvas />
    </Container>
  );
};

export default App;
