import React from "react";
import { RouteComponentProps } from "react-router";
import AddPlacePresenter from "./AddPlacePresenter";
import { addPlace, addPlaceVariables } from "../../types/api";
import { Mutation } from "react-apollo";
import { ADD_PLACE } from "./AddPlaceQueries";
import { GET_PLACES } from "../../sharedQueries";
import { toast } from "react-toastify";

interface IState {
  name: string;
  address: string;
  lat: number;
  lng: number;
}
interface IProps extends RouteComponentProps<any> {}

class AddPlaceMutation extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContatiner extends React.Component<IProps, IState> {
  public state = {
    name: "",
    address: "",
    lat: 12.345,
    lng: 13.345
  };

  public render() {
    const { name, address, lng, lat } = this.state;
    const { history } = this.props;
    return (
      <AddPlaceMutation
        mutation={ADD_PLACE}
        variables={{ name, address, lng, lat, isFav: false }}
        refetchQueries={[{ query: GET_PLACES }]}
        onCompleted={data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place Added!");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
      >
        {(addPlaceFn, { loading }) => (
          <AddPlacePresenter
            name={name}
            address={address}
            onInputChange={this.onInputChange}
            onSubmit={addPlaceFn as any}
            loading={loading}
          />
        )}
      </AddPlaceMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };
}

export default AddPlaceContatiner;
