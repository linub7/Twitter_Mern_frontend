import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import Signin from 'pages/auth/signin';
import Signup from 'pages/auth/signup';
import Home from 'pages/home';
import NotLoggedInRoutes from 'routes/NotLoggedInRoutes';
import LoggedInRoutes from 'routes/LoggedInRoutes';
import NotFound from 'pages/not-found';
import Search from 'pages/search';
import Notifications from 'pages/notifications';
import Messages from 'pages/messages';
import Profile from 'pages/profile';
import UserProfile from 'pages/profile/[username]';
import Post from 'pages/posts/[id]';
import UserMessages from 'pages/messages/[id]';
import UserProfileFollowing from 'pages/profile/[username]/following';
import UserProfileFollowers from 'pages/profile/[username]/followers';
import UserProfileReplies from 'pages/profile/[username]/replies';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/auth/signin" element={<Signin />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<UserMessages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route
            path="/profile/:username/following"
            element={<UserProfileFollowing />}
          />
          <Route
            path="/profile/:username/followers"
            element={<UserProfileFollowers />}
          />
          <Route
            path="/profile/:username/replies"
            element={<UserProfileReplies />}
          />
          <Route path="/posts/:id" element={<Post />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
