import {Container, Box, Button, TextField, Typography, Link, createTheme, ThemeProvider} from '@mui/material';
import { logIn } from '../utilities';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import GeoVote from '../assets/GeoVote.png';


const theme = createTheme({
  palette: {
    background: {
      paper: '#1e1e2f',
    },
    text: {
      primary: "#d3d3d3",
      secondary: "#acacac",
    },
  }
});

const textStyles = {
  color: "text.primary",
  marginBottom: "8px",
};

const nameStyles = {
  ...textStyles,
  fontSize: "75px", 
  fontWeight: "bold",
};

const titleStyles = {
  ...textStyles,
  fontSize: "45px", 
};


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
      navigate('/profile', {state: {user: user}})
    };
  };


  return (
    <>
    <ThemeProvider theme={theme}>
      <Container className='login-form' 
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={GeoVote} alt="GeoVote" style={{ maxWidth: '75%' }} />
          </Box>
        <h1 style={nameStyles}>GeoVote</h1>
        <h1 style={titleStyles}>Log In</h1>
        <br></br>

        <Box component='form'
          onSubmit={handleSubmit}
          sx={{ width: '25ch', display: 'flex',
            flexDirection: 'column', gap: 2 }}>
              
          <TextField 
            required
            id='email'
            label='Email'
            type='email'
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            sx={{ width: '100%' }}/>
          <TextField 
            required
            id='password'
            label='Password'
            type='password'
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            sx={{ width: '100%' }}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant='outlined' onClick={handleSubmit}>
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
    </ThemeProvider>
    </>
  )
}

export default LogInForm; 