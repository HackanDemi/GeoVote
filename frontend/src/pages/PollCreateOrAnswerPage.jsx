import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, TextField, Typography, Box, createTheme, ThemeProvider } from '@mui/material';
import NavBar from '../components/NavBar';
import axios from 'axios';
import './PollCreateOrAnswerPage.css';

const PollCreateOrAnswer = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [addressId, setAddressId] = useState('');




  const theme = createTheme({
    palette: {
      background: {
        paper: '#1e1e2f',
      },
      text: {
        primary: "#d3d3d3",
        secondary: "#acacac",
      },
      primary: {
        main: '#7100AE',
      },
      secondary: {
        main: '#a64eff',
      },
    }
  });


  const textStyles = {
    fontSize: "32px", 
    fontWeight: "bold",
    marginTop: "8px",
    marginBottom: "8px",
  };

  const titleStyles = {
    fontSize: "50px",
    fontWeight: "bold",
  };


  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleCreatePoll = async () => {
    try {
      const payload = {
        question,
        options: choices.map(choice => ({ text: choice })),
        address_id: addressId,
      };
      // console.log(payload.options)
      const response = await axios.post('http://127.0.0.1:8000/api/v1/polls/create-poll/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // Increase timeout to 5 seconds
      });

      // console.log(response.data)

      if (response.status === 200) {
        console.log('Poll created successfully:', response.data);
        // Optionally, redirect or show a success message
      } else {
        console.error('Failed to create poll:');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <>
      <NavBar />
      <ThemeProvider theme={theme}>
      
      <div className="poll-create-or-answer-container">
        <div className='your-polls' style={titleStyles}>Create a Poll</div> 
        <Card className="poll-create-card"
          sx={{
            bgcolor: 'background.paper', 
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(128, 90, 213, 0.8)", 
            margin: "20px auto",
            padding: "20px",
          }}>
          <CardContent>
            <TextField
              label="Question"
              variant="outlined"
              fullWidth
              margin="normal"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
            />
            {choices.map((choice, index) => (
              <TextField
                key={index}
                label={`Choice ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
              />
            ))}
          </CardContent>
          <CardActions>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button variant="contained" color="secondary" onClick={handleCreatePoll} className="button-save">
                Create Poll
              </Button>
            </Box>
          </CardActions>
        </Card>
        <div className='your-polls' style={textStyles}>Or</div> 
        <div className="answer-polls-container">
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/poll"
            sx={{
              bgcolor: 'background.paper', 
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(128, 90, 213, 0.8)", 
              margin: "20px auto",
              padding: "20px",
            }}className="button-save">
            Answer Polls
          </Button>
        </div>
      </div>
    </ThemeProvider>
    </>
  );
};

export default PollCreateOrAnswer;
