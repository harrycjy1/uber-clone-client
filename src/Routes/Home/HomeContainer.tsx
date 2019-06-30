import React from "react";
import ReactDOM from "react-dom";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router-dom";
import { Query, graphql, MutationFn } from "react-apollo";
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
  getDrivers
} from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";
import { geoCode } from "../../mapHelpers";
import { toast } from "react-toastify";
import { REPORT_LOCATION, GET_NEARBY_DRIVERS } from "./HomeQueries";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLng: number;
  toLat: number;
  distance?: string;
  duration?: string;
  price?: string;
}
interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQueries extends Query<getDrivers> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public toMarker: google.maps.Marker;
  public userMarker: google.maps.Marker;
  public drivers: google.maps.Marker[];
  public directions: google.maps.DirectionsRenderer;

  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "",
    toLng: 0,
    toLat: 0,
    distance: "",
    duration: "",
    price: ""
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoFail
    );
  }

  public render() {
    const { isMenuOpen, toAddress, price } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => {
          return (
            <NearbyQueries
              query={GET_NEARBY_DRIVERS}
              pollInterval={500}
              skip={
                (data &&
                  data.GetMyProfile &&
                  data.GetMyProfile.user &&
                  data.GetMyProfile.user.isDriving) ||
                false
              }
              onCompleted={this.handleNearbyDrivers}
            >
              {() => (
                <HomePresenter
                  loading={loading}
                  isMenuOpen={isMenuOpen}
                  toggleMenu={this.toggleMenu}
                  mapRef={this.mapRef}
                  toAddress={toAddress}
                  onInputChange={this.onInputChange}
                  price={price}
                  data={data}
                  onAddressSubmit={this.onAddressSubmit}
                  onKeyPress={this.keyPress}
                />
              )}
            </NearbyQueries>
          );
        }}
      </ProfileQuery>
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
    const { reportLocation } = this.props;

    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });

    reportLocation({
      variables: { lat: latitude, lng: longitude }
    });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result) {
      const { lat, lng, formatted_address } = result;
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: { lat, lng }
      };
      //다시검색할 경우 기존에 찍힌 마커는 제거
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);
      this.setState(
        {
          toLat: lat,
          toLng: lng,
          toAddress: formatted_address
        },
        this.createPath
      );
    } else {
      return;
    }
  };

  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    const { google } = this.props;
    if (this.directions) {
      this.directions.setMap(null);
    }

    const rendererOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: true
    };

    this.directions = new google.maps.DirectionsRenderer(rendererOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    directionsService.route(directionsOptions, this.handleDirectionsRequests);
  };

  public handleDirectionsRequests = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    const { google } = this.props;
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];

      this.directions.setDirections(result);
      this.directions.setMap(this.map);

      this.setState(
        {
          distance,
          duration
        },
        this.setPrice
      );
    } else {
      toast.error(status);
    }
  };

  public setPrice = () => {
    const { distance } = this.state;
    if (distance) {
      this.setState({
        price: Number(parseFloat(distance.replace(",", "")) * 1.1).toFixed(2)
      });
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

  public keyPress = e => {
    if (e.key === "Enter") {
      this.onAddressSubmit();
    } else {
      return;
    }
  };

  //메뉴 토글식으로 열고 닫기
  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };

  public handleNearbyDrivers = (data: getDrivers) => {
    const {
      GetNearbyDrivers: { ok, drivers }
    } = data;
    const { google } = this.props;

    if (ok && drivers) {
      drivers.map(driver => {
        if (driver && driver.lastLat && driver.lastLng) {
          const existingDrivers = this.drivers.find(
            (existingDriver: google.maps.Marker) => {
              const markerId = existingDriver.get("ID");
              return markerId === driver.id;
            }
          );

          if (existingDrivers) {
            existingDrivers.setPosition({
              lat: driver.lastLat,
              lng: driver.lastLng
            });

            existingDrivers.setMap(this.map);
          } else {
            const markerOptions: google.maps.MarkerOptions = {
              position: { lat: driver.lastLat, lng: driver.lastLng },
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 4
              }
            };
            const newMarker: google.maps.Marker = new google.maps.Marker(
              markerOptions
            );
            this.drivers.push(newMarker);

            newMarker.set("ID", driver.id);
            newMarker.setMap(this.map);
          }
        }
      });
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation"
  }
)(HomeContainer);
