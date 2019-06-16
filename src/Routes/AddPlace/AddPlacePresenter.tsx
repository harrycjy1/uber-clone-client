import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import Input from "../../Components/Input";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Form from "../../Components/Form";
import Button from "../../Components/Button";
import { MutationFn } from "react-apollo-hooks";
import { addPlace, addPlaceVariables } from "../../types/api";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
  name: string;
  address: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn<addPlace, addPlaceVariables>;
  loading: boolean;
  pickedAddress: boolean;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  name,
  address,
  onInputChange,
  onSubmit,
  loading,
  pickedAddress
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Uber</title>
    </Helmet>
    <Header backTo={"/"} title={"Add Place"} />
    <Container>
      <Form submitFn={onSubmit}>
        <ExtendedInput
          type={"text"}
          placeholder={"Name"}
          onChange={onInputChange}
          value={name}
          name={"name"}
        />
        <ExtendedInput
          type={"text"}
          placeholder={"Address"}
          onChange={onInputChange}
          value={address}
          name={"address"}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>

        {pickedAddress && (
          <Button
            onClick={null}
            value={loading ? "Adding Place" : "Add Place"}
          />
        )}
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;
