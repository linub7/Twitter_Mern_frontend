import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import Signin from 'pages/auth/signin';

const LoggedInRoutes = () => {
  const { user } = useSelector((state) => state.user);
  return user?.token ? <Outlet /> : <Signin />;
};

export default LoggedInRoutes;
