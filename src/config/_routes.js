import Home from '../pages/Home';
import _SelectJob from '../pages/_SelectJob';
import Interview from '../pages/Interview';
import Result from '../pages/Result';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import profile from '../pages/Profile';
import ProfileModify from "../pages/_ProfileModify";
import _GenerationLoading from "../pages/_GenerationLoading";

export const _routes = [
  {
    path: '/',
    element: Home,
    name: 'Home'
  },
  {
    path: '/select-job',
    element: _SelectJob,
    name: 'SelectJob'
  },
  {
    path: '/GenerationLoading',
    element: _GenerationLoading,
    name: 'GenerationLoading'
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
    element: profile,
    name: 'Profile'
  },
      {
    path: '/profile/ProfileModify',
    element: ProfileModify,
    name: 'ProfileModify'

  },
];
