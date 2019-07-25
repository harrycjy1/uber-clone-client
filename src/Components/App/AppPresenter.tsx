import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import AddPlace from "../../Routes/AddPlace";
import EditAccount from "../../Routes/EditAccount";
import Home from "../../Routes/Home";
import Login from "../../Routes/Login";
import PhoneLogin from "../../Routes/PhoneLogin";
import Places from "../../Routes/Places";
import Ride from "../../Routes/Ride";
import Settings from "../../Routes/Settings";
import VerifyPhone from "../../Routes/VerifyPhone";
import SocialLogin from "../../Routes/SocialLogin";
import FindAddress from "../../Routes/FindAddress";
import Chat from "../../Routes/Chat";

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />};
  </BrowserRouter>
);
//SFC = stateless functional component
const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Login} />
    <Route path={"/phone-login"} component={PhoneLogin} />
    <Route path={"/verify-phone"} component={VerifyPhone} />
    <Route path={"/social-login"} component={SocialLogin} />
    <Redirect from={"*"} to={"/"} />
    {/* redirect는 마지막에 작성해야함 (존재하는 경로를 검사후 리다이렉트 실행) */}
  </Switch>
);

const LoggedInRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Home} />
    <Route path={"/ride/:rideId"} exact={true} component={Ride} />
    <Route path={"/add-place"} exact={true} component={AddPlace} />
    <Route path={"/chat/:chatId"} exact={true} component={Chat} />
    <Route path={"/edit-account"} exact={true} component={EditAccount} />
    <Route path={"/places"} exact={true} component={Places} />
    <Route path={"/settings"} exact={true} component={Settings} />
    <Route path={"/find-address"} exact={true} component={FindAddress} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};
export default AppPresenter;
