import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router";
import { Query } from "react-apollo";
import { userProfile } from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
}
interface IProps extends RouteComponentProps<any> {
  google: any;
}

class ProfileQuery extends Query<userProfile> {}

class HomeContatiner extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoFail
    );
  }

  public handleGeoSuccess: PositionCallback = async (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;

    this.setState({
      lat: latitude,
      lng: longitude
    });
    //현재 위치 센터로 설정
    this.loadMap(latitude, longitude);
  };

  public handleGeoFail: PositionErrorCallback = () => {
    return;
  };

  public loadMap = (lat: number, lng: number) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      minZoom: 8,
      zoom: 15
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      position: { lat, lng },
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 4
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };

  public handleGeoWatchSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;

    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public render() {
    const { isMenuOpen } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ loading }) => (
          <HomePresenter
            isMenuOpen={isMenuOpen}
            toggleMenu={this.toggleMenu}
            loading={loading}
            mapRef={this.mapRef}
          />
        )}
      </ProfileQuery>
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
