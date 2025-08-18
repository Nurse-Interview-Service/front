import Home from '../pages/Home';
import SelectJob from '../pages/SelectJob';
import Interview from '../pages/Interview';
import Result from '../pages/Result';
import SelectedResult from '../pages/SelectedResult';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';

export const routes = [
  {
    path: '/',
    element: Home,
    name: 'Home'
  },
  {
    path: '/select-job',
    element: SelectJob,
    name: 'SelectJob'
  },
  {
    path: '/interview',
    element: Interview,
    name: 'Interview'
  },
  {
    path: '/result',
    element: Result,
    name: 'Result'
  },
  {
    path: '/selectedresult',
    element: SelectedResult,
    name: 'SelectedResult'
  },
  {
    path: '/signin',
    element: SignIn,
    name: 'SignIn'
  },
  {
    path: '/signup',
    element: SignUp,
    name: 'SignUp'
  },
  {
    path: '/profile',
    element: Profile,
    name: 'Profile'
  }
];
