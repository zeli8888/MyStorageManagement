import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { sendPasswordReset } from '../service/firebase/auth';

function ResetPasswordComponent() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await sendPasswordReset(email);

        if (result.success) {
            setMessage('Password reset email sent. Check your inbox.');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.error || 'Failed to send reset email');
        }
    };

    return (
        <Box sx={{
            maxWidth: { xs: '100%', sm: 400 },
            px: { xs: 2, sm: 0 },
            mx: 'auto',
            mt: { xs: 2, sm: 4 }
        }}>
            <Typography variant="h5" gutterBottom>Reset Password</Typography>
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
                {message && <Typography color="success" sx={{ whiteSpace: 'normal' }}>{message}</Typography>}
                {error && <Typography color="error" sx={{ whiteSpace: 'normal' }}>{error}</Typography>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: { xs: 1, sm: 2 },
                        py: 1.5
                    }}
                >
                    Send Reset Email
                </Button>
                <Typography sx={{
                    mt: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                    Remember your password? <Link to="/login">Sign In</Link>
                </Typography>
            </form>
        </Box>
    );
}

export default ResetPasswordComponent;
