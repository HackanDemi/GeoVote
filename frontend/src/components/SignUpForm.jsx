import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { userRegistrtion } from '../utilities';



const SignUpForm = () => {
  const { setUser } = useOutletContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(evt) => {
    evt.preventDefault();
    const formData = {
      first_name: firstName, 
      last_name: lastName, 
      email: email, 
      password: password,
    };

    const user = await userRegistrtion(formData); 
    console.log(user); 
    if (user) {
      setUser(user); 
      localStorage.setItem('user', JSON.stringify(user)); 
      navigate('/home', { state: {user: user}});
    } else { 
      console.error('User registration failed.');
    };
  };


  return (
    <>
      <Container className='signup-form'>
      <h1>Sign Up</h1>
        <Box component='form'
          onSubmit={handleSubmit}
          sx={{ width: '25ch' }}>
          <TextField 
            required
            id='first_name'
            label='First Name'
            type='name'
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}/>
          <TextField 
            required
            id='last_name'
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
          </Box>
          <br></br>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
              variant="outlined"
              onClick={() => alert('Sign in with Google')}>
                Sign up with Google
          </Button>
          <Button 
            variant='outlined' type='submit'>
              Sign Up
            </Button>
        </Box>
        <div className='signup-back-button'>
          <Button component={Link} to='/login/'>Back to Log In</Button>
        </div>
        
      </Container>
    </>
  )
}

export default SignUpForm; 