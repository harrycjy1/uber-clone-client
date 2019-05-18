import React from "react";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { Mutation, MutationUpdaterFn } from "react-apollo";
import { PHONE_SIGN_IN } from "./PhoneLogin.queries";
import {
  startPhoneVerificationVariables,
  startPhoneVerification
} from "../../types/api";

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}
class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  state = {
    countryCode: "+82",
    phoneNumber: ""
  };
  public render() {
    const { countryCode, phoneNumber } = this.state;
    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{ phoneNumber: `${countryCode}${phoneNumber}` }}
        update={this.afterSubmit}
      >
        {(mutation, { loading }) => {
          const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
            const { countryCode, phoneNumber } = this.state;
            //폰번호 검사 정규식
            const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(
              `${countryCode}${phoneNumber}`
            );
            if (isValid) {
              mutation();
            } else {
              toast.error("Please write a valid phone number");
            }
          };
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value }
    } = event;

    // ?????? as any가 뭔지 찾자
    this.setState({
      [name]: value
    } as any);
  };

  public afterSubmit: MutationUpdaterFn = (cache, data) => {
    console.log(data);
  };
}

export default PhoneLoginContainer;
