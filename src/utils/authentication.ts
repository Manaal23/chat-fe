const isAuthorised = (section: string) => {
  if (section === 'preference') {
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem('token') &&
        !localStorage.getItem('preferences')
      ) {
        return true;
      }
    }
  } else if (typeof window !== 'undefined') {
    if (localStorage.getItem('token') && localStorage.getItem('preferences')) {
      return true;
    }
  }
  return false;
};
export default isAuthorised;
