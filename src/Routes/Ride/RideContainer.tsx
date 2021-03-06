import React from "react";
import { RouteComponentProps } from "react-router-dom";
import RidePresenter from "./RidePresenter";
import {
  getRide,
  getRideVariables,
  userProfile,
  updateRide,
  updateRideVariables
} from "../../types/api";
import { Query, Mutation } from "react-apollo";
import { USER_PROFILE } from "../../sharedQueries";
import { UPDATE_RIDE_STATUS, GET_RIDE, RIDE_SUBSCRIPTION } from "./RideQueries";
import { SubscribeToMoreOptions } from "apollo-client";
import { toast } from "react-toastify";

class RideQuery extends Query<getRide, getRideVariables> {}
class PropfileQuery extends Query<userProfile> {}
class RideUpdateMutation extends Mutation<updateRide, updateRideVariables> {}

interface IProps extends RouteComponentProps<any> {}

class RideContainer extends React.Component<IProps> {
  constructor(props) {
    super(props);
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }

  public render() {
    const {
      match: {
        params: { rideId }
      }
    } = this.props;

    const _rideId = Number(rideId);

    return (
      <PropfileQuery query={USER_PROFILE}>
        {({ data: userData }) => {
          if (userData) {
            return (
              <RideQuery query={GET_RIDE} variables={{ rideId: _rideId }}>
                {({ data, loading, subscribeToMore }) => {
                  const subscriptionOptions: SubscribeToMoreOptions = {
                    document: RIDE_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) {
                        return prev;
                      }
                      const {
                        data: {
                          RideStatusSubscription: { status }
                        }
                      } = subscriptionData;
                      if (status === "FINISHED") {
                        window.location.href = "/";
                      }
                    }
                  };
                  subscribeToMore(subscriptionOptions);
                  if (data) {
                    return (
                      <RideUpdateMutation
                        mutation={UPDATE_RIDE_STATUS}
                        refetchQueries={[
                          { query: GET_RIDE, variables: { rideId: _rideId } }
                        ]}
                      >
                        {updateRideFn => (
                          <RidePresenter
                            userData={userData}
                            data={data}
                            loading={loading}
                            updateRideFn={updateRideFn}
                          />
                        )}
                      </RideUpdateMutation>
                    );
                  } else {
                    return toast.error("fuck it");
                  }
                }}
              </RideQuery>
            );
          } else {
            return toast.error("fuck you");
          }
        }}
      </PropfileQuery>
    );
  }
}

export default RideContainer;
