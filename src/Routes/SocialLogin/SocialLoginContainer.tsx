import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation } from "react-apollo";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";

class LoginMutation extends Mutation {}

interface IState {
  firstName: string;
  lastName: string;
  fbId: string;
  email?: string;
}
class SocialLoginContainer extends React.Component {
  public render() {
    return (
      <LoginMutation mutation={FACEBOOK_CONNECT}>
        <SocialLoginPresenter />;
      </LoginMutation>
    );
  }
}

export default SocialLoginContainer;
