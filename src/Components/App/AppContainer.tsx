import React from "react";
import { graphql } from "react-apollo";
import { IS_LOGGED_IN } from "./AppQueries.local";
import AppPresenter from "./AppPresenter";
import { ThemeProvider } from "styled-components";
import theme from "../../theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const AppContainer: any = ({ data }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"top-right"} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
