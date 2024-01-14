import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function PrivateRoute({ children }) {
  const router = useRouter();
  const isAuthenticated = localStorage.getItem('token'); // Retrieve the 'isAuthenticated' cookie
  // const isAuthenticated = Cookies.get('jwt'); // Retrieve the 'isAuthenticated' cookie
  const hasCompletedCaptcha = localStorage.getItem('_grecaptcha');
  const hasPreferences = localStorage.getItem('preferences');
  const [loading, setLoading] = useState(true);
  const currentRoute = router.pathname;
  const [finalRoute, setFinalRoute] = useState('');

  //   cookies -> recaptcha
  //  cookies && recaptcha -> preference
  // cookies && recaptcha && preference -> dashboard

  const avoidAfterLoginRoutes = ['/', '/preferences', '/recaptcha'];

  useEffect(() => {
    switch (true) {
      case !isAuthenticated:
        router.replace('/');
        setFinalRoute('/');
        break;
      case isAuthenticated && !hasCompletedCaptcha:
        router.replace('/recaptcha');
        setFinalRoute('/recaptcha');

        break;
      case isAuthenticated && hasCompletedCaptcha && !hasPreferences:
        router.replace('/preferences');
        setFinalRoute('/preferences');

        break;
      case avoidAfterLoginRoutes.includes(currentRoute):
        router.replace('/dashboard');
        setFinalRoute('/dashboard');

        break;

      default:
        setLoading(false);
        break;
    }
  }, []);

  if (!loading || finalRoute === currentRoute) return children;
}

export default PrivateRoute;
