import {Card, CardActions, CardContent, Button, Container, createTheme, ThemeProvider} from '@mui/material';


const PollCard = () => {

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




  return ( 
    <>
    <ThemeProvider theme={theme}>
    <Container classname='poll-card-container'>
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
            Poll name
          </div>
          <div style={textStyles}>
            poll option
          </div>
          <div style={textStyles}>
            poll options
          </div>


        </CardContent>
        <CardActions>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Container>
    </ThemeProvider>
    </>
  )
}

export default PollCard;