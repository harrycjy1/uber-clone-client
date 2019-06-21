import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import AddressBar from "../../Components/AddressBar";

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Center = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 2;
  font-size: 30px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IProps {
  mapRef: any;
  address: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const { mapRef, address, onChange, onBlur } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Address | Uber</title>
        </Helmet>
        <AddressBar
          name={"address"}
          value={address}
          onChange={onChange}
          onBlur={onBlur}
        />
        <Center>📍</Center>
        <Map ref={mapRef} />
      </div>
    );
  }
}

export default FindAddressPresenter;
