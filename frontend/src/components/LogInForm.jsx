import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const LogInForm = () => {
  const navigate = useNavigate();

  const handleLogInClick = () => {
    navigate('/home');
  }

  return (
    <>
      <Container className='login-form'>
        <h1>Log In</h1>
        <Box component='form'
          sx={{ width: '25ch' }}>
          <TextField 
            required
            id='outline-required'
            label='Email'/>
          <TextField 
            required
            id='outline-required'
            label='Password'/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}>
            Sign in with Google
          </Button>

          <Button variant='outlined'
            onClick={handleLogInClick}>
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