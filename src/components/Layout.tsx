import React from 'react';
import styled from 'styled-components';
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout({ children }) {
  return (
    <LayoutBox>
      <Header />
      {children}
      <Footer />
    </LayoutBox>
  );
}

const LayoutBox = styled.div`
  display: flex;
  flex-direction: column;
  background: whitesmoke;
  // height: 100vh;
  // width: 100vw;
`;
export default Layout;
