import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

import { logIn } from '../utilities';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async(evt) => {
    evt.preventDefault();
    const formData = {
      email: email, 
      password: password,
    };
    const user = await logIn (formData);
    console.log(user);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home', {state: {user: user}})
    };
  };

  const handleLogInClick = () => {
    navigate('/home');
  }

  return (
    <>
      <Container className='login-form'>
        <h1>Log In</h1>
        <Box component='form'
          onSubmit={handleSubmit}
          sx={{ width: '25ch' }}>
          <TextField 
            required
            id='email'
            label='Email'
            type='email'
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}/>
          <TextField 
            required
            id='password'
            label='Password'
            type='password'
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}>
            Sign in with Google
          </Button>

          <Button variant='outlined' onClick={handleLogInClick}>
              Log In
            </Button>

          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup/"
              variant="body2"
              sx={{ alignSelf: 'center' }}>
              Sign up
            </Link>
            </Typography>
        </Box>
      </Container>  
    </>
  )
}

export default LogInForm; 