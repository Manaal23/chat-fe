import PrivateRoute from '../common/privateRoutes';
import Preferences from '../components/Preferences';

export default function Home() {
  return (
    <PrivateRoute>
      <Preferences />
    </PrivateRoute>
  );
}
