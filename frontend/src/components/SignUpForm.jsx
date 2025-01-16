import {Container, Box, Button, TextField, createTheme, ThemeProvider} from '@mui/material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link } from "react-router-dom";
import { userRegistration } from '../utilities';
import { useState } from 'react';
import Geovote from '../assets/GeoVote.png';


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


const SignUpForm = () => {
  const { setUser } = useOutletContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = {
      first_name: firstName, 
      last_name: lastName, 
      email: email,
      password: password,
    };
    console.log("Form data:", formData);
    const user = await userRegistration(formData);
    console.log(user);
  if (user) {
    setUser(user);
    navigate('/news', {state: {user: user}});
  } else {
    console.error('User registration failed.');
  }
  }
  

  return (
    <>
    <ThemeProvider theme={theme}>
      <Container className='signup-form' 
        sx={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2  }}>
          <img src={Geovote} alt="GeoVote" style={{ maxWidth: '75%' }} />
        </Box>
        <h1 style={nameStyles}>GeoVote</h1>
        <h1 style={titleStyles}>Sign Up</h1>
        <br></br>

        <Box component='form'
          onSubmit={handleSubmit}
          sx={{ width: '25ch', display: 'flex',
            flexDirection: 'column', gap: 2 }}>

          <TextField 
            required
            id='first-name'
            label='First Name'
            type='name'
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}
            sx={{ width: '100%' }}/>

          <TextField 
            required
            id='last-name'
            label='Last Name'
            type='name'
            value={lastName}
            onChange={(evt) => setLastName(evt.target.value)}
            sx={{ width: '100%' }}/>

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
          

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button type='submit'
            variant='outlined'>
              Sign Up
            </Button>
        </Box>   
        </Box>

        <div className='signup-back-button'>
          <Button component={Link} to='/login/'>←  Back to Log In</Button>
        </div>
      </Container>
    </ThemeProvider>
    </>
  )
}

export default SignUpForm; 