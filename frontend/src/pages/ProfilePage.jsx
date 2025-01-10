import NavBar from '../components/NavBar'
import PollCard from '../components/PollsCard';
import ProfileCard from '../components/ProfileCard';

const textStyles = {
  color: "text.primary",
  marginBottom: "8px",
  fontSize:'50px',
  fontWeight: "bold",
};

const ProfilePage = () => {


    return (
      <>
    <NavBar />
    <ProfileCard/>

    <div style={textStyles}>Your Polls:</div>

    <PollCard/>
    </>
    )
  };
  
  export default ProfilePage;