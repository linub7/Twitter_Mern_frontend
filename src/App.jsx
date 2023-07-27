import { Routes, Route } from 'react-router-dom';

import Signin from 'pages/auth/signin';
import Signup from 'pages/auth/signup';
import Home from 'pages/home';

function App() {
  return (
    <Routes>
      <Route path="/auth/signin" element={<Signin />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
