import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import Signin from 'pages/auth/signin';
import Signup from 'pages/auth/signup';
import Home from 'pages/home';
import NotLoggedInRoutes from 'routes/NotLoggedInRoutes';
import LoggedInRoutes from 'routes/LoggedInRoutes';
import NotFound from 'pages/not-found';

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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
