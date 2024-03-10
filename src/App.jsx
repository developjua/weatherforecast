// Import statements for necessary dependencies and components
import React, { useEffect } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import { DarkModeProvider} from "./contextstore/DarkModeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RealTimeForecast from "./components/RealTimeForecast";
import Forecast from "./components/Forecast";

function App(){
  


  return (
   
      <DarkModeProvider>
        {/* Provides dark mode context */}
        <NavBar /> {/* Renders navigation bar component */}
        <Router>
          {/* Sets up React router */}
          <Routes>
            {/* Defines routes */}
            <Route path="/" element={<Home />} /> {/* Home route */}
            <Route path="/Realtime" element={<RealTimeForecast />} />
            {/* Real-time forecast route */}
            <Route path="/forecast" element={<Forecast />} />
            {/* Forecast route */}
            {/* Redirect to home if route is not specified */}
            <Route path="*" element={<Navigate to="/" />} />
            {/* Default redirect */}
          </Routes>
        </Router>
      </DarkModeProvider>
  
  );
}

export default App;
