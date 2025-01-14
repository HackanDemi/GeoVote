import NavBar from '../components/NavBar'
// import PizzaPoll from '../components/PizzaPoll'
import PollCard from '../components/PollsCard';
import { getAllPolls } from '../utilities';

export default function PollPage() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const getPolls = async() => {
      const usersPolls = await getAllPolls();
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
      <Poll />
    </div>
    </>
  )
}


