import { createBrowserRouter } from 'react-router-dom'; 
import { Navigate } from 'react-router-dom';
import App from "./App";
import HomePage from './pages/HomePage'; 
import LogInPage from './pages/LogInPage'; 
import SignUpPage from './pages/SignUpPage';
import PollPage from './pages/PollPage';
import ProfilePage from './pages/ProfilePage';


const router = createBrowserRouter([
    {
        path: "/", 
        element: <App/>,
        loader: getInfo,
        children:[
            {
                index:true, 
                element:<Navigate to='/login' replace/>
            },
            {
                path:'signup/',
                element: <SignUpPage/>
            },
            {
                path: 'login/', 
                element: <LogInPage/>
            },
            {
                path: 'home/:first_name/',
                element:<HomePage/>
            },
            {
                path: 'home/',
                element: <HomePage/>
            },
            {
                path: 'poll/',
                element: <PollPage/>
            },
            {
                path: 'profile/',
                element: <ProfilePage/>
            },
        ]
    }
]);

export default router;