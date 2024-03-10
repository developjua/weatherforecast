import React, { createContext, useContext, useState,useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// Create a context for managing dark mode state
const DarkModeContext = createContext(false);

// Custom hook to consume the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// DarkModeProvider component to provide dark mode state to its children
export const DarkModeProvider = ({ children }) => {
  // State to track whether dark mode is enabled or not
  const [isDarkMode, setIsDarkMode] = useState(false);
const theme = createTheme({
  palette: {
    mode: isDarkMode ? "dark" : "light",
  },
});


  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  // Function to toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Provide dark mode state and toggle function to children via context
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};
