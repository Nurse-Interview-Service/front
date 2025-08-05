import Home from '../pages/Home';
import SelectJob from '../pages/SelectJob';
import Interview from '../pages/Interview';
import Result from '../pages/Result';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import _Profile from '../pages/_Profile';
import ProfileModify from "../pages/_ProfileModify";

export const _routes = [
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
    element: _Profile,
    name: 'Profile'
  },
      {
    path: '/profile/ProfileModify',
    element: ProfileModify,
    name: 'ProfileModify'

  },
];
