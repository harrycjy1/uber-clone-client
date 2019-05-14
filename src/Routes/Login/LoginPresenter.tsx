import React from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {}

const Container = styled.div``;
const Header = styled.header``;
const Logo = styled.div``;
const Title = styled.h1``;
const Footer = styled.div``;
const Subtitle = styled.h2``;
const PhoneLogin = styled.div``;
const SocialLogin = styled.div``;
const Fakeinput = styled.div``;
const Grey = styled.span``;
const SocialLink = styled.span``;

const LoginPresenter: React.SFC<IProps> = () => (
  <Container>
    <Header>
      <Logo>
        <Title>Nuber</Title>
      </Logo>
    </Header>
    <Footer>
      <PhoneLogin>
        <Subtitle>Get Moving with Nuber</Subtitle>
        <Fakeinput>
          🇰🇷 +82 <Grey>Enter your mobile number</Grey>
        </Fakeinput>
      </PhoneLogin>
      <SocialLogin>
        <SocialLink>Or connect with social</SocialLink>
      </SocialLogin>
    </Footer>
  </Container>
);
export default LoginPresenter;
