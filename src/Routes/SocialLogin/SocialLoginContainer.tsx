import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation, MutationFn } from "react-apollo";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";
import { facebookConnect, facebookConnectVariables } from "../../types/api";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";

class LoginMutation extends Mutation<
  facebookConnect,
  facebookConnectVariables
> {}

interface IState {
  firstName: string;
  lastName: string;
  fbId: string;
  email?: string;
}

interface IProps extends RouteComponentProps<any> {}

class SocialLoginContainer extends React.Component<IProps, IState> {
  public state = {
    firstName: "",
    lastName: "",
    fbId: "",
    email: ""
  };
  public facebookMutation: MutationFn<
    facebookConnect,
    facebookConnectVariables
  >;
  public render() {
    const { firstName, lastName, email, fbId } = this.state;
    return (
      <LoginMutation mutation={FACEBOOK_CONNECT}>
        {(facebookMutation, { loading }) => {
          this.facebookMutation = facebookMutation;
          return <SocialLoginPresenter loginCallback={this.callBack} />;
        }}
      </LoginMutation>
    );
  }

  public callBack = response => {
    const { name, first_name, last_name, email, id, accessToken } = response;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      this.facebookMutation({
        variables: {
          email,
          fbId: id,
          firstName: first_name,
          lastName: last_name
        }
      });
    } else {
      toast.error("Could not log you in 😓");
    }
  };
}

export default SocialLoginContainer;
