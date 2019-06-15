import React from "react";
import { Query, Mutation } from "react-apollo";
import { userProfile, getPlaces } from "../../types/api";
import { USER_PROFILE, GET_PLACES } from "../../sharedQueries";
import { LOG_USER_OUT } from "../../sharedQueries.local";
import SettingsPresenter from "./SettingsPresenter";

class MiniProfileQuery extends Query<userProfile> {}

class PlacesQuery extends Query<getPlaces> {}

class SettingsContatiner extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <MiniProfileQuery query={USER_PROFILE}>
            {({ data: userData, loading: userDataLoading }) => {
              if (userData) {
                return (
                  <PlacesQuery query={GET_PLACES}>
                    {({ data: placesData, loading: placesLoading }) => {
                      if (placesData) {
                        return (
                          <SettingsPresenter
                            logUserOut={logUserOut}
                            userData={userData}
                            userDataLoading={userDataLoading}
                            placesData={placesData}
                            placesLoading={placesLoading}
                          />
                        );
                      } else {
                        return;
                      }
                    }}
                  </PlacesQuery>
                );
              } else {
                return;
              }
            }}
          </MiniProfileQuery>
        )}
      </Mutation>
    );
  }
}

export default SettingsContatiner;
