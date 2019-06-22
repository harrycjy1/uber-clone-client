import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router";
import { Query } from "react-apollo";
import { userProfile } from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";
import { geoCode } from "../../mapHelpers";
import { MapViewBase } from "react-native";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLng: number;
  toLat: number;
}
interface IProps extends RouteComponentProps<any> {
  google: any;
}

class ProfileQuery extends Query<userProfile> {}

class HomeContatiner extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public toMarker: google.maps.Marker;
  public userMarker: google.maps.Marker;
  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "",
    toLng: 0,
    toLat: 0
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
            onAddressSubmit={this.onAddressSubmit}
            toAddress={this.state.toAddress}
            onInputChange={this.onInputChange}
          />
        )}
      </ProfileQuery>
    );
  }

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result) {
      const { lat, lng, formatted_address } = result;
      this.setState({
        toLat: lat,
        toLng: lng,
        toAddress: formatted_address
      });
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: { lat, lng }
      };
      //다시검색할 경우 기존에 찍힌 마커는 제거
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
    } else {
      return;
    }
  };

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = e;

    this.setState({
      [name]: value
    } as any);
  };

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
