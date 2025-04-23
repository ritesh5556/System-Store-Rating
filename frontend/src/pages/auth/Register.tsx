import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store';
import { register, clearError } from '../../store/slices/authSlice';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'store_owner':
          navigate('/store-owner/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }

    // Clear any previous errors
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const validateForm = (): boolean => {
    let valid = true;
    const errors = {
      name: '',
      email: '',
      address: '',
      password: '',
    };

    // Name validation (min 10 chars, max 60 chars)
    if (!formData.name) {
      errors.name = 'Name is required';
      valid = false;
    } else if (formData.name.length < 10) {
      errors.name = 'Name must be at least 10 characters';
      valid = false;
    } else if (formData.name.length > 60) {
      errors.name = 'Name must be at most 60 characters';
      valid = false;
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }

    // Address validation (max 400 chars)
    if (formData.address && formData.address.length > 400) {
      errors.address = 'Address must be at most 400 characters';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (formData.password.length > 16) {
      errors.password = 'Password must be at most 16 characters';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific field error when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }

    // Clear API errors when typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(register(formData));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
        error={!!formErrors.name}
        helperText={formErrors.name}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <TextField
        margin="normal"
        fullWidth
        id="address"
        label="Address"
        name="address"
        autoComplete="address"
        multiline
        rows={3}
        value={formData.address}
        onChange={handleChange}
        error={!!formErrors.address}
        helperText={formErrors.address}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!formErrors.password}
        helperText={formErrors.password}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register; 