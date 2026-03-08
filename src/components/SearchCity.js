
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const SearchCity = () => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (city.trim()) {
      navigate('/dashboard', { state: { cityName: city } });
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      
      background: 'linear-gradient(180deg, #1424d8 0%, #449ba7 100%)', 
      px: 2
    }}>
      
      
      <Paper elevation={0} sx={{ 
        p: 5, 
        borderRadius: 8, 
        bgcolor: 'rgba(255, 255, 255, 0.2)', 
        backdropFilter: 'blur(15px)', 
        border: '1px solid rgba(255, 255, 255, 0.3)',
        textAlign: 'center',
        width: '100%',
        maxWidth: 550
      }}>
        
        <Typography variant="h3" sx={{ 
          mb: 1, 
          fontWeight: 'bold', 
          color: 'white',
          textShadow: '0px 4px 10px rgba(0,0,0,0.1)'
        }}>
          SkyCast
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
          Enter a city to explore the weather
        </Typography>

        <TextField
          fullWidth
          placeholder="Search city (e.g. Bengaluru)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            bgcolor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  onClick={handleSearch} 
                  sx={{ 
                    bgcolor: '#1a237e', 
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#0d1763' }
                  }}
                >
                  <SearchIcon />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        
      </Paper>

      
      <Typography sx={{ mt: 4, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
        Powered by OpenWeather API
      </Typography>
    </Box>
  );
};

export default SearchCity;