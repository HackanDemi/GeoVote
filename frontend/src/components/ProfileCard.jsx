import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';


const ProfileCard = () => {

  return ( 
    <>
    <Container>
      <Card sx={{ maxWidth: 900 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            (users name)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            (user display name)
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            (user email)
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            (user age)
          </Typography>

        </CardContent>
        <CardActions>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Container>
    </>
  )
}

export default ProfileCard;