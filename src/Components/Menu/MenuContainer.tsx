import React from "react";
import MenuPresenter from "./MenuPresenter";
import { userProfile, toggleDriving } from "../../types/api";
import { Query, Mutation } from "react-apollo";
import { USER_PROFILE } from "../../sharedQueries";
import TOGGLE_DRIVING from "./MenuQueries";
import { toast } from "react-toastify";

class ProfileQuery extends Query<userProfile> {}

class ToggleDrivingMutation extends Mutation<toggleDriving> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ToggleDrivingMutation
        mutation={TOGGLE_DRIVING}
        // refetchQueries={[{ query: USER_PROFILE }]}
        update={(cache, { data }) => {
          if (data) {
            const { ToggleDrivingMode } = data;
            if (!ToggleDrivingMode.ok) {
              toast.error(ToggleDrivingMode.error);
            }
          }
          const query: userProfile | null = cache.readQuery({
            query: USER_PROFILE
          });
          if (query) {
            const {
              GetMyProfile: { user }
            } = query;
            if (user) {
              user.isDriving = !user.isDriving;
            }
            //변경된 전체 쿼리를 줘야함 isDriving을 주면 안됨
            cache.writeQuery({ query: USER_PROFILE, data: query });
          }
        }}
      >
        {toggleDrivingFn => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading }) => {
              return (
                <MenuPresenter
                  toggleDrivingFn={toggleDrivingFn}
                  data={data}
                  loading={loading}
                />
              );
            }}
          </ProfileQuery>
        )}
      </ToggleDrivingMutation>
    );
  }
}

export default MenuContainer;
