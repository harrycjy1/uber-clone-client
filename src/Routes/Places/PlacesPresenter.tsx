import React from "react";
import Helmet from "react-helmet";
import { getPlaces } from "../../types/api";
import Header from "../../Components/Header";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Place from "../../Components/Place";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
  placeData: getPlaces;
  loading: boolean;
}
const PlacesPresenter: React.SFC<IProps> = ({
  placeData: { GetMyPlaces },
  loading
}) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Places | Uber</title>
      </Helmet>
      <Header backTo={"/"} title={"Places"} />
      <Container>
        {!loading &&
          GetMyPlaces.places &&
          GetMyPlaces.places.length === 0 &&
          "You have no Places"}
        {!loading &&
          GetMyPlaces.places &&
          GetMyPlaces.places.length !== 0 &&
          GetMyPlaces.places.map(place => (
            <Place
              key={place!.id}
              name={place!.name}
              fav={place!.isFav}
              address={place!.address}
            />
          ))}
        <SLink to={"/add-place"}>Add some places!</SLink>
      </Container>
    </React.Fragment>
  );
};

export default PlacesPresenter;
