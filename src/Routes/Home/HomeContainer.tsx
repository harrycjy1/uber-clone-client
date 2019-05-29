import React from "react";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router";
import { Query } from "react-apollo";
import { userProfile } from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";

interface IState {
  isMenuOpen: boolean;
}
interface IProps extends RouteComponentProps<any> {}

class ProfileQury extends Query<userProfile> {}

class HomeContatiner extends React.Component<IProps, IState> {
  public state = {
    isMenuOpen: false
  };
  public render() {
    const { isMenuOpen } = this.state;
    return (
      <ProfileQury query={USER_PROFILE}>
        <HomePresenter isMenuOpen={isMenuOpen} toggleMenu={this.toggleMenu} />
      </ProfileQury>
    );
  }

  //메뉴 토글식으로 열고 닫기
  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };
}

export default HomeContatiner;
