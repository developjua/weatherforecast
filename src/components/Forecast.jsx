import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../contextstore/DarkModeContext";
import { useNavigate } from "react-router-dom";

const WeatherForecast = () => {
  // State variables for managing weather forecast data and UI
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({});
  const [manualLocation, setManualLocation] = useState("");
  const [isThrottled, setIsThrottled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);

  // Accessing dark mode state from context
  const { isDarkMode } = useDarkMode();

  // React router hook for navigation
  const navigate = useNavigate();

  // Function to handle navigation back to home
  const handleBackToHomeClick = () => {
    navigate("/");
  };

  // Dynamic toast style based on dark mode
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
        // Fetch weather forecast data from API
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${import.meta.env.VITE_API_KEY}`
        );

        // Update forecast and location state with API response data
        setForecast(response.data.timelines.daily);
        setLocation(response.data.location);
      } catch (error) {
        console.error(
          "Error fetching weather forecast with this location:",
          error
        );
        // Notify user of error when fetching forecast data
        toast.error(
          "Failed to fetch weather forecast data for this location.",
          getToastStyle()
        );
      } finally {
        // Reset loading and throttling states
        setLoading(false);
        setIsThrottled(false);
      }
    },
    [isThrottled, getToastStyle] // Include getToastStyle in dependencies
  );

  // Fetch forecast based on current geolocation
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        // Flag to track if the error toast has been shown
        let errorToastShown = false;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              setLoading(true);
              const response = await axios.get(
                `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=${import.meta.env.VITE_API_KEY}`
              );
              setForecast(response.data.timelines.daily);
              setLocation(response.data.location);
            } catch (error) {
              console.error("Error fetching weather forecast:", error);
              toast.error("Failed to fetch weather forecast data.", getToastStyle());
            } finally {
              setLoading(false);
            }
            setIsGeolocationAvailable(true);
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Show the error toast only once
            if (!errorToastShown) {
              toast.error("Geolocation is disabled or denied.", getToastStyle());
              errorToastShown = true;
            }
            setIsGeolocationAvailable(false);
          }
        );
      } else {
        toast.error("Geolocation is not available.", getToastStyle());
        setIsGeolocationAvailable(false);
      }
    };

    fetchLocation();
  }, []);

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

      {/* Heading for weather forecast */}
      <Typography
        variant="h5"
        sx={{ marginTop: "20px", color: isDarkMode ? "#fff" : "#333" }}
      >
        Weather Forecast
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

      {/* Button to fetch forecast for manual location */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => throttledHandleManualLocation(manualLocation)}
      >
        Get Forecast
      </Button>

      {/* Loading indicator */}
      {loading && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Grid to display weather forecast cards */}
      <Box mt={2}>
        <Grid container spacing={5}>
          {forecast.map((val) => (
            <Grid item key={val.time} xs={12} sm={6} md={4} lg={4}>
              {/* Render individual weather forecast card */}
              <WeatherCard data={val} location={location} />
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

export default WeatherForecast;