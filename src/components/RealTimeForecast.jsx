import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../contextstore/DarkModeContext";
import { useNavigate } from "react-router-dom";

const RealTimeForecast = () => {
  // State variables
  const [forecast, setForecast] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [isThrottled, setIsThrottled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);

  // Context
  const { isDarkMode } = useDarkMode();

  // Router navigation
  const navigate = useNavigate();
    const ToastStyle = {
      style: {
        background: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
      },
    };

  // Fetch forecast based on current geolocation
  useEffect(() => {
    const fetchLocation = () => {
      // Add a flag to track whether geolocation retrieval has been attempted
      let geolocationRetrieved = false;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Set the flag to true once geolocation is successfully retrieved
            geolocationRetrieved = true;

            const { latitude, longitude } = position.coords;
            try {
              setLoading(true);
              const response = await axios.get(
                `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=${process.env.REACT_APP_API_KEY}`
              );
              setForecast(response.data);
              setLocation(response.data.location);
            } catch (error) {
              console.error("Error fetching real-time forecast:", error);
              toast.error("Failed to fetch real-time forecast data.");
            } finally {
              setLoading(false);
            }
            setIsGeolocationAvailable(true);
          },
          () => {
            // Check the flag before showing the error message
            if (!geolocationRetrieved) {
              toast.error("Geolocation is disabled.", ToastStyle);
              setIsGeolocationAvailable(false);
            }
          }
        );
      } else {
        toast.error("Geolocation is not available.", ToastStyle);
        setIsGeolocationAvailable(false);
      }
    };

    fetchLocation();
  }, []);


  // Handle back to home button click
  const handleBackToHomeClick = () => {
    navigate("/");
  };
  

  // Throttled function for fetching forecast based on manual location input
  const throttledHandleManualLocation = useCallback(
    async (location) => {
      if (isThrottled) return;
      setIsThrottled(true);
      setLoading(true);
      setManualLocation(location);
      try {
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${process.env.REACT_APP_API_KEY}`
        );
        setForecast(response.data);
        setLocation(response.data.location);
      } catch (error) {
        console.error(
          "Error fetching real-time forecast with manual location:",
          error
        );
        toast.error(
          "Failed to fetch real-time forecast data for manual location.",
          ToastStyle
        );
      } finally {
        setLoading(false);
        setIsThrottled(false);
      }
    },
    [isThrottled]
  );

  // Render
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`,
        minHeight: "100vh",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <Typography
        variant="h5"
        sx={{ marginTop: "20px", color: isDarkMode ? "#fff" : "#333" }}
      >
        Real-Time Forecast
      </Typography>

      {/* Display manual location input if geolocation is not available */}
      {!isGeolocationAvailable && (
        <>
          <TextField
            label="Enter Location (latitude, longitude or location name)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            style={{
              marginBottom: "1rem",
              marginTop: "10px",
              color: isDarkMode ? "white" : "black",
              width: "50%",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => throttledHandleManualLocation(manualLocation)}
          >
            Get Forecast
          </Button>
        </>
      )}

      {/* Loading spinner */}
      {loading && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Display forecast */}
      {forecast && !loading && (
        <Box mt={2}>
          <WeatherCard data={forecast.data} location={location} />
        </Box>
      )}

      {/* Back to home button */}
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

export default RealTimeForecast;
