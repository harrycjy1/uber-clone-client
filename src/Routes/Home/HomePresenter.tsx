import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import Menu from "../../Components/Menu";
import Sidebar from "react-sidebar";

const Container = styled.div``;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const HomePresenter: React.SFC<IProps> = ({ isMenuOpen, toggleMenu }) => (
  <Container>
    <Helmet>
      <title>Hi</title>
    </Helmet>
    <Sidebar
      sidebar={Menu}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          backgroundColor: "white",
          width: "80%",
          zIndex: "10"
        }
      }}
    >
      <button onClick={toggleMenu}>Open sidebar</button>
    </Sidebar>
  </Container>
);

export default HomePresenter;
