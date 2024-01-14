import PrivateRoute from '../common/privateRoutes';
import GuestLogin from '../components/Login/GuestLogin';

export default function Home() {
  return (
    <PrivateRoute>
      <GuestLogin />
    </PrivateRoute>
  );
}
