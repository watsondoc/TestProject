import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import UserTable from './UserTable';
import PostTable from './PostTable';

const App: React.FC = () => {
  return (
    <Router>
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<UserTable />} />
          <Route path="/posts/:userId" element={<PostTable />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
