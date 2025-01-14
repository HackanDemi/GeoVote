import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar'
// import PizzaPoll from '../components/PizzaPoll'
import PollCard from '../components/PollsCard';
import { getUserPolls } from '../utilities';

export default function PollPage() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const getPolls = async() => {
      const usersPolls = await getUserPolls();
      if(usersPolls) {
        setPolls(usersPolls);
      }
    };
    getPolls();
  }, []);

  return (
    <>
      <NavBar />
      <div style={{ width: '100vw' }}>
        {polls.map(poll => (
          <PollCard
            key={poll.id}
            edit
          />
        ))}
      </div>
    </>
  );
};