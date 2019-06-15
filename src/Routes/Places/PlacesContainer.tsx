import React from "react";
import { Query } from "react-apollo";
import { getPlaces } from "../../types/api";
import { GET_PLACES } from "../../sharedQueries";
import PlacesPresenter from "./PlacesPresenter";
import styled from "../../typed-components";
import { Link } from "react-router-dom";

class PlacesQuery extends Query<getPlaces> {
  Container = styled.div`
    padding: 0 40px;
  `;

  SLink = styled(Link)`
    text-decoration: underline;
  `;
}

class PlacesContainer extends React.Component {
  public render() {
    return (
      <PlacesQuery query={GET_PLACES}>
        {({ data: placeData, loading }) => {
          if (placeData) {
            return <PlacesPresenter placeData={placeData} loading={loading} />;
          } else {
            return;
          }
        }}
      </PlacesQuery>
    );
  }
}

export default PlacesContainer;
