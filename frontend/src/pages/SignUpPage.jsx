import SignUpForm from "../components/SignUpForm";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const SignUpPage = () => {


  return (
    <>
      <Button as={Link} to='/login/'>Back</Button>
      <h1>Sign up Page</h1>
      <SignUpForm/>
    </>
  )
};

export default SignUpPage;