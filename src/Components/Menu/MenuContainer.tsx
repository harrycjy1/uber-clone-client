import React from "react";
import MenuPresenter from "./MenuPresenter";
import { userProfile } from "../../types/api";
import { Query } from "react-apollo";
import { USER_PROFILE } from "../../sharedQueries";

class ProfileQuery extends Query<userProfile> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => {
          if (data) {
            return <MenuPresenter data={data} loading={loading} />;
          } else {
            return "Sorry there's an errors";
          }
        }}
      </ProfileQuery>
    );
  }
}

export default MenuContainer;
