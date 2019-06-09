import React from "react";
import { RouteComponentProps } from "react-router";
import { Mutation, Query } from "react-apollo";
import {
  updateProfile,
  updateProfileVariables,
  userProfile
} from "../../types/api";
import { UPDATE_PROFILE } from "./EditAccountQueries";
import EditAccountPresenter from "./EditAccountPresenter";
import { USER_PROFILE } from "../../sharedQueries";
import { toast } from "react-toastify";

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  initValue: boolean;
}
interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class ProfileQuery extends Query<userProfile> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: "",
    initValue: false
  };

  public render() {
    const { email, firstName, lastName, profilePhoto } = this.state;
    return (
      <ProfileQuery
        query={USER_PROFILE}
        fetchPolicy={"no-cache"}
        onCompleted={this.updateFields}
      >
        {() => (
          <UpdateProfileMutation
            mutation={UPDATE_PROFILE}
            refetchQueries={[{ query: USER_PROFILE }]}
            onCompleted={data => {
              if (!this.state.initValue) {
                const { UpdateMyProfile } = data;
                if (UpdateMyProfile.ok) {
                  toast.success("profile updated!");
                } else if (UpdateMyProfile.error) {
                  toast.error(UpdateMyProfile.error);
                }
              }
            }}
            variables={{ email, firstName, lastName, profilePhoto }}
          >
            {(updateProfileFn, { loading }) => (
              <EditAccountPresenter
                email={email}
                firstName={firstName}
                lastName={lastName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={loading}
                onSubmit={updateProfileFn}
              />
            )}
          </UpdateProfileMutation>
        )}
      </ProfileQuery>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: userProfile) => {
    console.log(data.GetMyProfile.ok);
    if (data.GetMyProfile) {
      const { user } = data.GetMyProfile;
      if (user) {
        const { firstName, lastName, email, profilePhoto } = user;

        this.setState({
          firstName,
          lastName,
          email,
          profilePhoto,
          initValue: true
        } as any);
      }
    }
  };
}

export default EditAccountContainer;
