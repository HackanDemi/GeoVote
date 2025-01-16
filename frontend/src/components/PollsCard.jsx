import {Card, CardActions, CardContent, Box, Button, Container, createTheme, ThemeProvider} from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import './Poll.css';

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
    fontSize: "32px", 
    fontWeight: "bold",
  };



const PollsCard = ({ edit, readOnly, onDelete }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonText, setButtonText] = useState('Vote');
  const [pollId, setPollId] = useState("678182af1cc542001017358f"); // It should start with the first poll ID 
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchPollData(pollId);
  }, [pollId]);

  const fetchPollData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/polls/random/`);
      const data = response.data;
      console.log(data);
      setQuestion(data.question_text);
      setOptions(data.options || []);
      console.log(data.options)
      setSelectedOption(null);
      setButtonText('Vote');
    } catch (error) {
      console.error('Error fetching poll data:', error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Set the entire option object
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (buttonText === 'Vote') {
      if (selectedOption) {
        console.log('User voted for:', selectedOption.text);
        setButtonText('Next question');
      } else {
        alert('Please select an option before voting.');
      }
    } else {
      setPollId(pollId + 1); // Move to the next poll
      setSelectedOption(null); // Reset the selection for the next question
      setButtonText('Vote');  // Reset the button text
    }
  };

  return ( 
    <>
      <ThemeProvider theme={theme}>
        <Container>
          <Card className='poll-card'
              sx={{
                bgcolor: 'background.paper', 
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(128, 90, 213, 0.8)", 
                margin: "20px auto",
                padding: "20px",
              }}>
            
            <CardContent className='poll-card-content'>
              <div style={nameStyles}>
                {question}
              </div>
              <div style={textStyles}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`poll-option w-full p-2 mt-2 text-white rounded ${selectedOption === option ? 'bg-[#7100AE]' : 'bg-gray-700'} hover:bg-[#7100AE]`} 
                    onClick={() => handleOptionClick(option)}
                    style={{ 
                      color: 'white',
                      border: selectedOption === option ? '2px solid #7100AE' : '1px solid transparent',
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </CardContent>
            <CardActions>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Button
                    type="submit"
                    className={`button-save gap-2.5 px-4 py-2 mt-6 max-w-full text-3xl text-center whitespace-nowrap rounded-3xl bg-neutral-500 min-h-[51px] tracking-[3.6px] w-[196px] ${buttonText === 'Next question' ? 'text-xl' : ''} hover:bg-[#7100AE]`}
                    onClick={handleSubmit}>
                      {buttonText}
                  </Button>
                </Box>
                {edit && (
                  <Button size='small' className="button-edit">Edit</Button>
                )}
                {readOnly && (
                  <Button size='small' className="button-cancel" onClick={onDelete}>Delete</Button>
                )}
            </CardActions>
          </Card>
          <div className='signup-back-button'>
          <Button component={Link} to='/pollcreateoranswer/'>←  Back to Creating a Poll</Button>
        </div>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default PollsCard;
