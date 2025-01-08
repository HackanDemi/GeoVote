import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link } from "react-router-dom";
import { userRegistration } from '../utilities';
import { useState } from 'react';



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
    navigate('/home', {state: {user: user}});
  } else {
    console.error('User registration failed.');
  }
  }
  

  return (
    <>
      <Container className='signup-form'>
      <h1>Sign Up</h1>
        <Box component='form'
        onSubmit={handleSubmit}
          sx={{ width: '25ch' }}>
          <TextField 
            required
            id='first-name'
            label='First Name'
            type='name'
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}/>

          <TextField 
            required
            id='last-name'
            label='Last Name'
            type='name'
            value={lastName}
            onChange={(evt) => setLastName(evt.target.value)}/>

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
          
          <br></br>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
              variant="outlined"
              onClick={() => alert('Sign in with Google')}>
                Sign up with Google
          </Button>
          <Button type='submit'
            variant='outlined'>
              Sign Up
            </Button>
         </Box>   
        </Box>
        <div className='signup-back-button'>
          <Button component={Link} to='/login/'>Back to Log In</Button>
        </div>
        
      </Container>
    </>
  )
}

export default SignUpForm; 