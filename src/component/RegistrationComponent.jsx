import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { signUpWithCredentials } from '../service/firebase/auth';
import SessionContext from './UserProvider';

function RegistrationComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setSession } = React.useContext(SessionContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUpWithCredentials(email, password);

    if (result?.success && result?.user) {
      setSession({
        user: {
          name: result.user.displayName || '',
          email: result.user.email || '',
          image: result.user.photoURL || '',
        }
      });
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Box sx={{
      maxWidth: { xs: '100%', sm: 400 },
      px: { xs: 2, sm: 0 },
      mx: 'auto',
      mt: { xs: 2, sm: 4 },
    }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: { xs: 1, sm: 2 },
            py: 1.5,
          }}
        >
          Create Account
        </Button>
        <Typography sx={{
          mt: { xs: 1, sm: 2 },
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </Typography>
      </form>
    </Box>
  );
}

export default RegistrationComponent;
