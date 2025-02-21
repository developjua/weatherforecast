import React from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDarkMode } from "../contextstore/DarkModeContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleRealTimeClick = () => {
    navigate("/Realtime");
  };

  const handleForecastClick = () => {
    navigate("/forecast");
  };
    const handleweatherhistorytClick = () => {
      navigate("/WeatherRecentHistory");
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`,
        minHeight: "100vh",
        padding: "64px 16px",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: isDarkMode ? "#37474F" : "#FFA000",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Grid
            container
            direction={isSmallScreen ? "column" : "row"}
            alignItems="center"
            justifyContent="space-between"
            spacing={isSmallScreen ? 2 : 0}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                gutterBottom
                style={{ color: isDarkMode ? "#FFFFFF" : "#263238" }}
              >
                Weather Forecasting
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                paragraph
                style={{ color: isDarkMode ? "#FFFFFF" : "#263238" }}
              >
                See Realtime and weather forecasting by clicking the respective
                buttons
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                color="primary"
                onClick={handleRealTimeClick}
              >
                Real-Time Forecasting
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                color="primary"
                onClick={handleweatherhistorytClick}
                style={{ marginLeft: isSmallScreen ? "0" : "1px" }}
              >
                Weather Recent History
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                color="primary"
                onClick={handleForecastClick}
                style={{ marginLeft: isSmallScreen ? "0" : "1px" }}
              >
                Weather Forecasting
              </Button>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </motion.div>
  );
}
