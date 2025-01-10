import NavBar from '../components/NavBar'
import PollCard from '../components/PollsCard';
import ProfileCard from '../components/ProfileCard';


const ProfilePage = () => {


    return (
      <>
    <NavBar />
    <ProfileCard/>

    <div className='poll-cards'>
      <PollCard/>
    </div>
    </>
    )
  };
  
  export default ProfilePage;