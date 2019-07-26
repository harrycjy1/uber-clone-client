import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import App from "./Components/App";
import GlobalStyle from "./global-styles";
import client from "./apollo";

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
      <GlobalStyle />
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
