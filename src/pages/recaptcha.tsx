import PrivateRoute from '../common/privateRoutes';
import Recaptcha from '../components/Recapcha';

function Recapchta() {
  return (
    <PrivateRoute>
      <Recaptcha />
    </PrivateRoute>
  );
}
export default Recapchta;
