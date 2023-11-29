import { useDispatch } from 'react-redux';
import Cookie from 'js-cookie';

import { logoutAction } from 'redux-store/slices/user';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    Cookie.remove('token');
    dispatch(logoutAction());
    window.location.pathname = '/auth/signin';
  };
  return (
    <div>
      Home
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Home;
