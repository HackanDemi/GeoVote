import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import PollCard from '../components/PollsCard';
import ProfileCard from '../components/ProfileCard';
import { getUserPolls, deletePoll } from '../utilities';

const textStyles = {
  color: "text.primary",
  marginBottom: "8px",
  fontSize:'50px',
  fontWeight: "bold",
};

const secondaryStyles = {
  fontSize: '24px',
  marginTop: '115px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}


const ProfilePage = () => {
  const [polls, setPolls] = useState([]);


  useEffect(() => {
    const getPolls = async() => {
      const usersPolls = await getUserPolls();
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
        <ProfileCard />
        <div className='your-polls' style={textStyles}>Your Polls:</div>
        {polls.length > 0 ? (
          polls.map(poll => (
            <PollCard
              key={poll.id}
              readOnly
              onDelete={() => handleDeletePoll(poll.id)}
            />
          ))
        ) : (
          <div style={secondaryStyles}>You haven't created any polls yet!</div>
        )}
      </div>
    </>
    )
  };
  
  export default ProfilePage;
