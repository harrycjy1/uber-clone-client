import React from "react";
import { RouteComponentProps } from "react-router-dom";
import RidePresenter from "./RidePresenter";

interface IProps extends RouteComponentProps {}

class RideContainer extends React.Component<IProps> {
  public render() {
    return <RidePresenter />;
  }
}

export default RideContainer;
