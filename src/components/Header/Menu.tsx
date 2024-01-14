import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import isAuthorised from '../../utils/authentication';
import useAxiosFetch from '../../common/useApiCall';
import { EndPoints } from '../../constants/endpoints';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function Menu(props: Props) {
  const { open, setOpen } = props;
  const router = useRouter();
  const [data, error, loading, fetchData] = useAxiosFetch();

  const handleLogout = async () => {
    await fetchData({
      method: 'POST',
      url: EndPoints.auth.LOGOUT,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setOpen(false);
    localStorage.clear();
    router.push('/');
  };

  const handleRoutes = (route: string) => {
    router.push(route);
    setOpen(false);
  };

  return (
    <MenuWrapper open={open}>
      <StyledMenu>
        <span onClick={() => handleRoutes('/about')}>
          <i className="fa fa-user" aria-hidden="true" />
          About us
        </span>
        <span onClick={() => handleRoutes('/contact-us')}>
          <i className="fa fa-address-book" aria-hidden="true" />
          Contact
        </span>
        {!isAuthorised('preference') ? (
          <>
            <span onClick={() => handleRoutes('/')}>
              <i className="fa fa-sign-in" aria-hidden="true" />
              Login
            </span>
            <span
              onClick={() => handleRoutes('/signup')}
              style={{ borderBottom: 'none' }}
            >
              <i className="fa fa-user-plus" aria-hidden="true" />
              Signup
            </span>
          </>
        ) : (
          <Logout onClick={handleLogout}>
            <i className="fa fa-sign-out" aria-hidden="true" />
            Logout
          </Logout>
        )}
      </StyledMenu>
    </MenuWrapper>
  );
}

const MenuWrapper = styled.div<Props>`
  height: 100vh;
  background: ${({ theme }) => theme.colors.ambienceGrey[11]};
  position: absolute;
  top: 0;
  box-sizing: border-box;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  left: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 2rem;
  margin-top: 30px;
  gap: 1rem;

  span {
    margin-top: 12px;
    font-size: 20px;
    font-family: 'Noto Sans', sans-serif;
    padding-bottom: 10px;
    border-bottom: 1px solid whitesmoke;
    cursor: pointer;
  }
  i {
    margin-right: 10px;
  }
`;
const Logout = styled.div`
  border-bottom: none;
  margin-top: 12px;
  font-size: 20px;
  font-family: 'Noto Sans', sans-serif;
  padding-bottom: 10px;
  cursor: pointer;
`;
export default Menu;
