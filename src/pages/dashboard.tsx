import PrivateRoute from '../common/privateRoutes';
import UserDashboard from '../components/Dashboard';

export default function Home() {
  return (
    <PrivateRoute>
      <UserDashboard />
    </PrivateRoute>
  );
}
