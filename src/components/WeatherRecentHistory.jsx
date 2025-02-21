import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../contextstore/DarkModeContext";
import { useNavigate } from "react-router-dom";

const WeatherRecentHistory = () => {
  // State variables for managing weather history data and UI
  const [history, setHistory] = useState([]);
  const [location, setLocation] = useState({});
  const [manualLocation, setManualLocation] = useState("");
  const [isThrottled, setIsThrottled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState("hourly"); // Default to hourly data

  // Accessing dark mode state from context
  const { isDarkMode } = useDarkMode();

  // React router hook for navigation
  const navigate = useNavigate();

  // Function to handle navigation back to home
  const handleBackToHomeClick = () => {
    navigate("/");
  };

  // Toast style based on dark mode
  const getToastStyle = () => ({
    style: {
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#333",
    },
  });

  // Throttled function to handle manual location input
  const throttledHandleManualLocation = useCallback(
    async (location) => {
      if (isThrottled) return;

      // Check if location is empty
      if (!location.trim()) {
        toast.error("Please enter a location.", getToastStyle());
        return;
      }

      setIsThrottled(true);
      setLoading(true);
      setManualLocation(location);
      try {
        // Fetch weather history data from API
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/history/recent?location=${location}&apikey=${
            import.meta.env.VITE_API_KEY
          }`
        );

        // Update history and location state with API response data
        setHistory(response.data.timelines[dataType]); // Use selected data type (hourly/daily)
        setLocation(response.data.location);
      } catch (error) {
        console.error(
          "Error fetching weather history with this location:",
          error
        );
        // Notify user of error when fetching history data
        toast.error(
          "Failed to fetch weather history data for this location.",
          getToastStyle()
        );
      } finally {
        // Reset loading and throttling states
        setLoading(false);
        setIsThrottled(false);
      }
    },
    [isThrottled, dataType, isDarkMode] // Add isDarkMode as a dependency
  );

  // Function to handle data type change (hourly/daily)
  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        // Styling for background gradient based on dark mode
        background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`,
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      {/* Notification container for displaying toasts */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        toastStyle={getToastStyle().style} // Apply dynamic toast style
      />

      {/* Heading for weather history */}
      <Typography
        variant="h5"
        sx={{ marginTop: "20px", color: isDarkMode ? "#fff" : "#333" }}
      >
        Weather Recent History
      </Typography>

      {/* Text field for manual location input */}
      <TextField
        label="Enter Location (format (latitude, longitude) or location name)"
        value={manualLocation}
        variant="outlined"
        onChange={(e) => setManualLocation(e.target.value)}
        style={{
          marginBottom: "1rem",
          marginTop: "10px",
          width: "50%",
          color: isDarkMode ? "white" : "black",
        }}
      />

      {/* Dropdown to select data type (hourly/daily) */}
      <FormControl
        variant="outlined"
        sx={{ width: "50%", marginBottom: "1rem" }}
      >
        <InputLabel id="data-type-label">Data Type</InputLabel>
        <Select
          labelId="data-type-label"
          value={dataType}
          onChange={handleDataTypeChange}
          label="Data Type"
        >
          <MenuItem value="hourly">Hourly</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
        </Select>
      </FormControl>

      {/* Button to fetch history for manual location */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => throttledHandleManualLocation(manualLocation)}
      >
        Get History
      </Button>

      {/* Loading indicator */}
      {loading && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Grid to display weather history cards */}
      <Box mt={2}>
        <Grid container spacing={5}>
          {history.map((val) => (
            <Grid item key={val.time} xs={12} sm={6} md={4} lg={4}>
              {/* Render individual weather history card */}
              <WeatherCard data={val} location={location} dataType={dataType} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Button to navigate back to home */}
      <Button
        variant="contained"
        component="span"
        color="primary"
        onClick={handleBackToHomeClick}
        style={{ marginTop: "20px", marginLeft: "10px" }}
      >
        Back Home
      </Button>
    </Box>
  );
};

export default WeatherRecentHistory;
