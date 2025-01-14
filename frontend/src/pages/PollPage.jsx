import NavBar from '../components/NavBar'
import PollCard from '../components/PollsCard';
import { getUserPolls } from '../utilities';
import { useEffect, useState } from 'react';

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
    <div className="page-container">
      <PollCard />
    </div>
    </>
  )
}


