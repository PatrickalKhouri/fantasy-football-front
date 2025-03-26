import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button } from "@mui/material";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Box sx={{ backgroundColor: "primary.main", padding: 20 }}>
          <Button sx={{ color: "white", bgcolor: "secondary.main" }}>
            Click Me
          </Button>
        </Box>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
