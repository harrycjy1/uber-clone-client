import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import Menu from "../../Components/Menu";
import Sidebar from "react-sidebar";
import Button from "../../Components/Button";
import AddressBar from "../../Components/AddressBar";
import {
  userProfile,
  requestRide,
  requestRideVariables,
  getRides,
  acceptRide,
  acceptRideVariables
} from "../../types/api";
import { MutationFn } from "react-apollo";
import RidePopUp from "../../Components/RidePopUp";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 400px;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  mapRef: any;
  onAddressSubmit: () => void;
  toAddress: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  price?: string;
  data?: userProfile;
  requestRideFn?: MutationFn<requestRide, requestRideVariables>;
  nearbyRide?: getRides;
  acceptRideFn?: MutationFn<acceptRide, acceptRideVariables>;
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  mapRef,
  onAddressSubmit,
  toAddress,
  onInputChange,
  onKeyPress,
  price,
  data,
  requestRideFn,
  nearbyRide,
  acceptRideFn
}) => {
  const GetMyProfile = data!.GetMyProfile;

  return (
    <Container>
      <Helmet>
        <title>Hi</title>
      </Helmet>
      <Sidebar
        sidebar={<Menu />}
        open={isMenuOpen}
        onSetOpen={toggleMenu}
        styles={{
          sidebar: {
            backgroundColor: "white",
            width: "80%",
            zIndex: "10"
          }
        }}
      >
        {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
        {GetMyProfile && GetMyProfile.user && !GetMyProfile.user.isDriving && (
          <React.Fragment>
            <AddressBar
              name={"toAddress"}
              onChange={onInputChange}
              value={toAddress}
              onKeyPress={onKeyPress}
              onBlur={() => {}}
            />
            <ExtendedButton
              value={"Pick this place"}
              onClick={onAddressSubmit}
            />
          </React.Fragment>
        )}

        {price && (
          <RequestButton
            value={`Request Ride ($${price})`}
            onClick={requestRideFn}
          />
        )}
        {nearbyRide &&
          nearbyRide.GetNearByRide &&
          nearbyRide.GetNearByRide.ride && (
            <RidePopUp
              id={nearbyRide.GetNearByRide.ride.id}
              pickUpAddress={nearbyRide.GetNearByRide.ride.pickUpAddress}
              dropOffAddress={nearbyRide.GetNearByRide.ride.dropOffAddress}
              price={nearbyRide.GetNearByRide.ride.price}
              distance={nearbyRide.GetNearByRide.ride.distance}
              passengerName={
                nearbyRide.GetNearByRide.ride!.passenger!.fullName!
              }
              passengerPhoto={
                nearbyRide.GetNearByRide.ride!.passenger!.profilePhoto!
              }
              acceptRideFn={acceptRideFn}
            />
          )}
        <Map ref={mapRef} />
      </Sidebar>
    </Container>
  );
};

export default HomePresenter;
