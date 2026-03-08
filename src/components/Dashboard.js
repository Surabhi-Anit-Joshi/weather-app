import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, Grid, CircularProgress, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // States
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = '4f4b915f8097d3f62c8a3ff00ed9f0b1';

  // 1. Load History from LocalStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // 2. Listen for navigation state (from SearchCity.js)
  useEffect(() => {
    if (location.state && location.state.cityName) {
      getWeatherData(location.state.cityName);
    }
  }, [location.state]);

  const getWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Current Weather
      const currRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currData = await currRes.json();

      // Fetch 5-Day Forecast
      const foreRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const foreData = await foreRes.json();

      if (currData.cod === 200 && foreData.cod === "200") {
        setWeather(currData);
        // Filter to get roughly one reading per day (at 12:00 PM)
        setForecast(foreData.list.filter(reading => reading.dt_txt.includes("12:00:00")));

        // Update History
        updateSearchHistory(currData);
      } else {
        setError("City not found. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch weather data. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateSearchHistory = (data) => {
  const newEntry = {
    name: data.name,
    temp: Math.round(data.main.temp),
    icon: data.weather[0].icon
  };
  
  // Use the functional update (prevHistory) to get the true current state
  setHistory((prevHistory) => {
    // 1. Remove the city if it already exists (prevent duplicates)
    const filtered = prevHistory.filter(item => item.name !== data.name);
    
    // 2. Add the new entry to the top and limit to 6
    const updatedHistory = [newEntry, ...filtered].slice(0, 6);
    
    // 3. Save this specific updated list to LocalStorage
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    return updatedHistory;
  });
};

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <Box className="dashboard-container">
      {/* SIDEBAR */}
      <Box className="sidebar">
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', letterSpacing: 1 }}>
          SkyCast
        </Typography>

        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<SearchIcon />}
          onClick={() => navigate('/search')}
          sx={{ mb: 4, bgcolor: '#3949ab', py: 1.5, textTransform: 'none', borderRadius: '8px' }}
        >
          New Search
        </Button>

        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2, fontWeight: 500 }}>
          Search History
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {history.length === 0 ? (
            <Typography variant="caption" sx={{ opacity: 0.5 }}>No recent searches</Typography>
          ) : (
            history.map((item, i) => (
              <Box key={i} className="history-item" onClick={() => getWeatherData(item.name)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src={`http://openweathermap.org/img/wn/${item.icon}.png`} alt="w" width="30"/>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">{item.temp}°C</Typography>
              </Box>
            ))
          )}
        </Box>

        <Button 
          startIcon={<LogoutIcon />} 
          color="inherit" 
          onClick={handleLogout} 
          sx={{ mt: 2, textTransform: 'none', opacity: 0.8 }}
        >
          Logout
        </Button>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box className="main-content">
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!weather && !loading && !error && (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h5" color="textSecondary">
              Select "New Search" to find weather details.
            </Typography>
          </Box>
        )}

        {weather && !loading && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Current Weather</Typography>
            <Card sx={{ p: 4, borderRadius: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 500 }}>{weather.name}</Typography>
                <Typography variant="h1" sx={{ fontWeight: 'bold' }}>{Math.round(weather.main.temp)}°C</Typography>
                <Typography variant="h6" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {weather.weather[0].description}
                </Typography>
              </Box>
              <img 
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                alt="weather-icon" 
              />
            </Card>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>5-Day Forecast</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {forecast.map((day, i) => (
                <Grid item xs={12} sm={2.4} key={i}>
                  <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="f" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{Math.round(day.main.temp)}°C</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>{day.weather[0].main}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Weather Metrics</Typography>
            <Card sx={{ p: 3, borderRadius: 4, display: 'flex', justifyContent: 'space-around' }}>
              <Box textAlign="center">
                <Typography variant="caption" color="textSecondary">Humidity</Typography>
                <Typography variant="h6">{weather.main.humidity}%</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="caption" color="textSecondary">Wind Speed</Typography>
                <Typography variant="h6">{weather.wind.speed} km/h</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="caption" color="textSecondary">Pressure</Typography>
                <Typography variant="h6">{weather.main.pressure} hPa</Typography>
              </Box>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;