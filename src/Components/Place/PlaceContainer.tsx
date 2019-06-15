import React from "react";
import { Mutation } from "react-apollo";
import { editPlace, editPlaceVariables } from "../../types/api";
import { EDIT_PLACE } from "./PlaceQueries";
import PlacePresenter from "./PlacePresenter";
import { GET_PLACES } from "../../sharedQueries";

class FavMutation extends Mutation<editPlace, editPlaceVariables> {}

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  id: number;
}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { fav, name, address, id } = this.props;
    return (
      <FavMutation
        mutation={EDIT_PLACE}
        variables={{ isFav: !fav, placeId: id }}
        refetchQueries={[{ query: GET_PLACES }]}
      >
        {editPlaceFn => (
          <PlacePresenter
            onStarPress={editPlaceFn as any}
            fav={fav}
            name={name}
            address={address}
          />
        )}
      </FavMutation>
    );
  }
}

export default PlaceContainer;
