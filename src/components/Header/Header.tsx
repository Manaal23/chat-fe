import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  flexbox,
  FlexProps,
  space,
  SpaceProps,
} from 'styled-system';
import { useRouter } from 'next/router';
import Menu from './Menu';
import Burger from './Burger';
import isAuthorised from '../../utils/authentication';
import useAxiosFetch from '../../common/useApiCall';
import { EndPoints } from '../../constants/endpoints';

type Props = ColorProps & SpaceProps & FlexProps;

function Header() {
  const [open, setOpen] = useState(false);
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
    localStorage.removeItem('token');
    localStorage.removeItem('preferences');
    router.push('/');
  };

  return (
    <Box>
      <Container>
        <Items m={2}>ChatApp</Items>
        <Items className="header-logo">ChatApp Logo</Items>
        <AuthOptions>
          <Items className="nav-auth">
            {!isAuthorised('preference') ? (
              <>
                <NavLink pl="8px" onClick={() => router.push('/login')}>
                  Login
                </NavLink>
                <NavLink onClick={() => router.push('/login')}>Signup</NavLink>
              </>
            ) : (
              <Logout style={{ color: 'white' }} onClick={handleLogout}>
                Logout
              </Logout>
            )}
          </Items>
        </AuthOptions>
        <HamBurger>
          <Burger open={open} setOpen={setOpen} />
          <Menu open={open} setOpen={setOpen} />
        </HamBurger>
      </Container>
    </Box>
  );
}

const Box = styled.div<Props>`
  ${color}
  ${space}
  ${flexbox}
  z-index: 9;
  background: #008fe9;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
`;
const Container = styled.div<SpaceProps>`
  padding: 16px;
  // width: inherit
  margin: 0 32px 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-logo {
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      width: 48%;
      text-align: right;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 16px 0 16px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: normal;
    margin: 0;
  }
`;
const HamBurger = styled.div`
  margin-right: 12px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
const AuthOptions = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
const Logout = styled.span`
  color: white;
`;
const Items = styled.div<Props>`
  ${space}
  ${flexbox}
  ${color}
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes[4]};
  font-family: 'Noto Sans', sans-serif;
  color: white;
  display: flex;
  gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes[4]};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes[3]};
    display: inline-block;
  }
`;
const NavLink = styled.span<SpaceProps>`
  color: white;
  text-decoration: none;
`;

export default Header;
