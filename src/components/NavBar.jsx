import React from "react";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import DarkModeSwitch from "./DarkModeSwitch";
import { useDarkMode } from "../contextstore/DarkModeContext";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <AppBar
      position="static"
      sx={{  background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`}}
    >
      <Toolbar>
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            width: "300px",
            background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`,
            color: isDarkMode ? "#fff" : "#333",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          Weather Forecasting
        </Typography>
        <Grid container justifyContent="flex-end" alignItems="center">
          <Typography variant="body2" style={{ color: "white" }}>
            Dark Mode
          </Typography>
          <DarkModeSwitch
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
