import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, TextField, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import axios from 'axios';
import './PollCreateOrAnswerPage.css';

const PollCreateOrAnswer = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [addressId, setAddressId] = useState('');

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
      <div className="poll-create-or-answer-container">
        <Card className="poll-card">
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#7100AE',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              <Typography variant="h5" component="div">
                Create a Poll
              </Typography>
            </Box>
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
              <Button variant="contained" color="secondary" onClick={handleCreatePoll}>
                Create Poll
              </Button>
            </Box>
          </CardActions>
        </Card>
        <div className="answer-polls-container">
          <Typography variant="h5" component="div">
            OR
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/poll"
            sx={{ mt: 2 }} // Add margin-top to the button
          >
            Answer Polls
          </Button>
        </div>
      </div>
    </>
  );
};

export default PollCreateOrAnswer;
