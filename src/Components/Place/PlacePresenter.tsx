import React from "react";
import styled from "../../typed-components";
import { editPlace, editPlaceVariables } from "../../types/api";
import { MutationFn } from "react-apollo-hooks";

const Place = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  & i {
    font-size: 12px;
  }
`;

const Container = styled.div`
  margin-left: 10px;
`;

const Name = styled.span`
  display: block;
`;

const Icon = styled.span`
  cursor: pointer;
`;

const Address = styled.span`
  color: ${props => props.theme.greyColor};
  font-size: 14px;
`;

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  onStarPress: MutationFn<editPlace, editPlaceVariables>;
}

const PlacePresenter: React.SFC<IProps> = ({
  fav,
  name,
  address,
  onStarPress
}) => (
  <Place>
    <Icon onClick={onStarPress as any}>{fav ? "★" : "✩"}</Icon>
    <Container>
      <Name>{name}</Name>
      <Address>{address}</Address>
    </Container>
  </Place>
);

export default PlacePresenter;