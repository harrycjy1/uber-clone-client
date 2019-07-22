import React from "react";
import styled from "../../typed-components";
import Button from "../../Components/Button";
import { Link } from "react-router-dom";
import { MutationFn } from "react-apollo";
import {
  updateRide,
  updateRideVariables,
  getRide,
  userProfile
} from "../../types/api";
import { StatusOptions } from "../../sharedQueries.local";

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${props => props.theme.blueColor};
`;

const Img = styled.img`
  border-radius: 50%;
  margin-right: 20px;
  max-width: 50px;
  height: 50px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0px;
`;

const ExtendedButton = styled(Button)`
  margin-bottom: 30px;
`;

interface IProps {
  data: getRide;
  userData: userProfile;
  loading: boolean;
  updateRideFn: MutationFn<updateRide, updateRideVariables>;
}

const RidePresenter: React.SFC<IProps> = ({
  data,
  userData,
  updateRideFn,
  loading
}) => {
  const ONROUTE = StatusOptions.ONROUTE;
  const FINISHED = StatusOptions.FINISHED;
  const { GetRide } = data;
  const { GetMyProfile } = userData;
  return (
    <Container>
      {!loading && GetRide.ride && GetMyProfile.user && (
        <React.Fragment>
          <Title>Passenger</Title>
          <Passenger>
            <Img src={GetRide.ride.passenger!.profilePhoto!} />
            <Data>{GetRide.ride.passenger!.fullName!}</Data>
          </Passenger>
          {GetRide.ride.driver && (
            <React.Fragment>
              <Title>Driver</Title>
              <Passenger>
                <Img src={GetRide.ride.driver.profilePhoto!} />
                <Data>{GetRide.ride.driver.fullName!}</Data>
              </Passenger>
            </React.Fragment>
          )}
          <Title>From</Title>
          <Data>{GetRide.ride.pickUpAddress}</Data>
          <Title>To</Title>
          <Data>{GetRide.ride.dropOffAddress}</Data>
          <Title>Price</Title>
          <Data>{GetRide.ride.price}</Data>
          <Title>Distance</Title>
          <Data>{GetRide.ride.distance}</Data>
          <Title>Duration</Title>
          <Data>{GetRide.ride.duration}</Data>
          <Title>Status</Title>
          <Data>{GetRide.ride.status}</Data>
          <Buttons>
            {GetRide.ride.driver &&
              GetRide.ride.driver.id === GetMyProfile.user.id &&
              GetRide.ride.status === "ACCEPTED" && (
                <ExtendedButton
                  value={"Picked Up"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: Number(GetRide.ride!.id),
                        status: ONROUTE
                      }
                    })
                  }
                />
              )}
            {GetRide.ride.driver &&
              GetRide.ride.driver.id === GetMyProfile.user.id &&
              GetRide.ride.status === "ONROUTE" && (
                <ExtendedButton
                  value={"Finished"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: Number(GetRide.ride!.id),
                        status: FINISHED
                      }
                    })
                  }
                />
              )}

            {GetRide.ride.status !== "REQUESTING" && (
              <Link to={`/chat/${GetRide.ride.chatId}`}>
                <ExtendedButton value={"Chat"} onClick={null} />
              </Link>
            )}
          </Buttons>
        </React.Fragment>
      )}
    </Container>
  );
};

export default RidePresenter;
