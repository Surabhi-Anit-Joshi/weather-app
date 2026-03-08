
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    
    if (email.trim() !== '' && password.trim() !== '') {
      setError(false);
      
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      navigate('/dashboard'); 
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <Box className="glass-card">
        <div className="login-logo">
          {/* Using the consistent weather icon */}
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1163/1163736.png" 
            alt="SkyCast Logo" 
            style={{ width: '45px', marginBottom: '10px' }} 
          />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            SkyCast Login
          </Typography>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please enter your credentials to continue.
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#38bdf8',
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1.2,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#0ea5e9',
              },
            }}
          >
            Log In
          </Button>

          
        </form>
      </Box>
    </div>
  );
};

export default Login;