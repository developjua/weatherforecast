import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import WeatherIcon from "./WeatherIcon";
import { useDarkMode } from "../contextstore/DarkModeContext";

const WeatherCard = ({ data, location }) => {
  // Access dark mode state from context
  const { isDarkMode } = useDarkMode();

  // Destructure data properties
  const temperature =
    data?.values?.temperatureMax !== undefined
      ? data?.values?.temperatureMax
      : data?.values?.temperature;

  const visibility =
    data?.values?.visibilityMax !== undefined
      ? data?.values?.visibilityMax
      : data?.values?.visibility;

  const locationName = location.name || "Unknown";
  const latitude = location?.lat;
  const longitude = location?.lon;
  const time = data.time;

  // Function to determine weather icon based on temperature and visibility
  const getWeatherIcon = () => {
    if (temperature >= 25) {
      return <WeatherIcon icon="WiDaySunny" color="#e8e16d" />;
    } else if (temperature < 25 && visibility <= 10) {
      return <WeatherIcon icon="WiFog" color="gray" />;
    } else {
      return <WeatherIcon icon="WiThermometer" color="blue" />;
    }
  };

  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={3}
        sx={{
          background: `linear-gradient(45deg, ${
            isDarkMode ? "#263238, #37474F" : "#FF8D00, #FFA100"
          })`,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: isDarkMode ? "#fff" : "#333",
            }}
          >
            Weather Information
          </Typography>
          <Divider />
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/* Display time, location, latitude, and longitude */}
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Time: <strong>{time}</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Location: <strong>{locationName}</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Latitude: <strong>{latitude}</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Longitude: <strong>{longitude}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {/* Display temperature, visibility, and weather icon */}
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Temperature: <strong>{temperature}°C</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Visibility: <strong>{visibility} km</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                  }}
                >
                  Weather Icon: {getWeatherIcon()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;
