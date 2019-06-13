import React, { useEffect } from "react";
import axios from "axios";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries";
import {
  updateProfile,
  updateProfileVariables,
  userProfile
} from "../../types/api";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_PROFILE } from "./EditAccountQueries";
import { useQuery } from "react-apollo-hooks";

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  didFetch: boolean;
  uploading: boolean;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

// class ProfileQuery extends Query<userProfile> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: "",
    didFetch: false,
    uploading: false
  };

  ProfileQuery = () => {
    const {
      email,
      firstName,
      lastName,
      profilePhoto,
      didFetch,
      uploading
    } = this.state;
    const { data, loading } = useQuery(USER_PROFILE, {
      fetchPolicy: "cache-and-network",
      skip: didFetch
    });

    useEffect(() => {
      const onCompleted = data => this.updateFields(data);
      if (onCompleted) {
        onCompleted(data);
      }
    }, [data, loading]);

    return (
      <UpdateProfileMutation
        mutation={UPDATE_PROFILE}
        refetchQueries={[{ query: USER_PROFILE }]}
        onCompleted={data => {
          const { UpdateMyProfile } = data;
          if (UpdateMyProfile.ok) {
            toast.success("Profile updated!");
          } else if (UpdateMyProfile.error) {
            toast.error(UpdateMyProfile.error);
          }
        }}
        variables={{
          email,
          firstName,
          lastName,
          profilePhoto
        }}
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
            uploading={uploading}
          />
        )}
      </UpdateProfileMutation>
    );
  };
  public render() {
    return (
      // <ProfileQuery
      //   query={USER_PROFILE}
      //   fetchPolicy={"cache-and-network"}
      //   onCompleted={this.updateFields}
      // >
      <this.ProfileQuery />
      // </ProfileQuery>
    );
  }
  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value, files }
    } = event;
    if (files) {
      this.setState({ uploading: true });

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", "879246383158587");
      formData.append("upload_preset", "ml_default");
      formData.append("timestamp", String(Date.now() / 1000));

      const {
        data: { secure_url }
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/choddolcloud/image/upload",
        formData
      );
      if (secure_url)
        this.setState({ profilePhoto: secure_url, uploading: false });
    }

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: userProfile) => {
    if (data) {
      const { GetMyProfile } = data;
      if (GetMyProfile) {
        const { user } = GetMyProfile;
        if (user) {
          const { firstName, lastName, email, profilePhoto } = user;
          this.setState({
            firstName,
            lastName,
            email,
            profilePhoto,
            didFetch: true
          } as any);
        }
      }
    }
  };
}

export default EditAccountContainer;
