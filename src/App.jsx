import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
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
import UserMessages from 'pages/messages/[userId]';
import UserProfileFollowing from 'pages/profile/[username]/following';
import UserProfileFollowers from 'pages/profile/[username]/followers';
import UserProfileReplies from 'pages/profile/[username]/replies';
import SearchUsers from 'pages/search/users';
import NewMessage from 'pages/messages/new';
import ChatMessages from 'pages/messages/chat/[chatId]';
import SocketContext from 'context/SocketContext';

const socket = io(
  import.meta.env.VITE_REACT_APP_DEVELOPMENT
    ? import.meta.env.VITE_REACT_APP_BACKEND_DEVELOPMENT_URL?.split(
        '/api/v1'
      )[0]
    : import.meta.env.VITE_REACT_APP_BACKEND_PRODUCTION_URL?.split('/api/v1')[0]
);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Toaster />
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/auth/signin" element={<Signin />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/users" element={<SearchUsers />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/new" element={<NewMessage />} />
          <Route path="/messages/chat/:chatId" element={<ChatMessages />} />
          <Route path="/messages/:userId" element={<UserMessages />} />
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
    </SocketContext.Provider>
  );
}

export default App;
