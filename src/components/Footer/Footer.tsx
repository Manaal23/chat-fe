import Link from 'next/link';
import styled from 'styled-components';

function Footer() {
  return (
    <FooterContainer>
      <FooterWrapper>
        <LogoWrapper>
          <img src="/logo.jpg" alt="logo" />
        </LogoWrapper>
        <OtherLinks>
          <LinkRow>
            <span>Chat with Stranger</span>
            <span>Contact Us</span>
            <span>Feedback</span>
          </LinkRow>
          <LinkRow>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </LinkRow>
        </OtherLinks>
      </FooterWrapper>
      <CopyWriteText>
        <Link href="/">© 2023 Stranger.us</Link>
      </CopyWriteText>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  width: 100%;
  background-color: whitesmoke;
  // position: absolute;
  // bottom: 0;
  // left: 0;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    background-color: whitesmoke;
  }
`;

const FooterWrapper = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LogoWrapper = styled.div`
  width: 400px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 320px;
  }
  @media screen and (max-width: 720px) {
    width: 270px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 300px;
  }
  img {
    width: 70%;
    // height: 30%;
    vertical-align: middle;
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      // width: 70%;
      display: none;
    }
  }
`;
const OtherLinks = styled.div`
  display: flex;
  flex: 1;
  gap: 15%;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    padding-left: 12px;
  }
`;

const LinkRow = styled.div`
  width: 154px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  span {
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 28px;
    margin: 0;
    color: #475965 !important;
    cursor: pointer;
    text-transform: uppercase;
  }
`;

const CopyWriteText = styled.div`
  background-color: whitesmoke;
  width: 100%;
  padding: 25px 0;
  text-align: center;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-top: 1px solid white;
  }
  a {
    font-family: 'Noto Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    color: #475965;
    font-size: 12px;
    text-transform: uppercase;
  }
`;
export default Footer;
