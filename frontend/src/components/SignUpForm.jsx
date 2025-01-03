import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";



const SignUpForm = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/home');
  }


  return (
    <>
      <Container className='signup-form'>
      <h1>Sign Up</h1>
        <Box component='form'
          sx={{ width: '25ch' }}>
          <TextField 
            required
            id='outline-required'
            label='First Name'/>
          <TextField 
            required
            id='outline-required'
            label='Last Name'/>
          <TextField 
            required
            id='outline-required'
            label='Email'/>
          <TextField 
            required
            id='outline-required'
            label='Password'/>
          </Box>
          <br></br>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
              variant="outlined"
              onClick={() => alert('Sign in with Google')}>
                Sign up with Google
          </Button>
          <Button 
            variant='outlined'
            onClick={handleSignUpClick}>
              Sign Up
            </Button>
        </Box>
        <div className='signup-back-button'>
          <Button as={Link} to='/login/'>Back to Log In</Button>
        </div>
        
      </Container>
    </>
  )
}

export default SignUpForm; 