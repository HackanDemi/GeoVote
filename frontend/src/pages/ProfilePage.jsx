import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import PollCar from '../components/PollCard';
import ProfileCard from '../components/ProfileCard';
import { getAllPolls, deletePoll } from '../utilities';

const textStyles = {
  color: "text.primary",
  marginBottom: "8px",
  fontSize:'50px',
  fontWeight: "bold",
};


const ProfilePage = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const getPolls = async() => {
      const usersPolls = await getAllPolls();
      if (usersPolls) {
        setPolls(usersPolls);
      }
    };
    getPolls();
  }, []);

  const handleDeletePoll = async(pollId) => {
    const response = await deletePoll(pollId);
      if(response) {
        setPolls(polls.filter(poll => poll.id !== pollId));
        console.log('Poll deleted')
      } else {
        console.error('Error deleting poll');
      }
    } 

    return (
      <>
    <NavBar />
      <div style={{ width: '100vw' }}>
      <ProfileCard/>
      <div className='your-polls' style={textStyles}>Your Polls:</div>
      {polls.map(poll => (
        <PollCard 
          key={poll.id}
          readOnly 
          onDelete={() => handleDeletePoll(poll.id)}/>
      ))}
      </div>

    </>
    )
  };
  
  export default ProfilePage;
