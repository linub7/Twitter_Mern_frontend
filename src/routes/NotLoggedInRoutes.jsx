import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const NotLoggedInRoutes = () => {
  const { user } = useSelector((state) => state.user);
  return user?.token ? <Navigate to={'/'} /> : <Outlet />;
};

export default NotLoggedInRoutes;
