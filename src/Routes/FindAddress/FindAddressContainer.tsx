import React from "react";
import ReactDOM from "react-dom";
import FindAddressPresenter from "./FindAddressPresenter";
import { reverseGeoCode, geoCode } from "../../mapHelpers";

interface IState {
  lat: number;
  lng: number;
  address: string;
}

class FindAddressContainer extends React.Component<any, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public state = {
    lat: 0,
    lng: 0,
    address: ""
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

  public render() {
    return (
      <FindAddressPresenter
        mapRef={this.mapRef}
        address={this.state.address}
        onBlur={this.onInputBlur}
        onChange={this.onInputChange}
      />
    );
  }

  public handleGeoSuccess = async (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;

    this.setState({
      lat: latitude,
      lng: longitude
    });
    //현재 위치 센터로 설정
    this.loadMap(latitude, longitude);
    this.reverseGeocoding(latitude, longitude);
  };

  public handleGeoFail = () => {
    return;
  };

  public loadMap = (lat, lng) => {
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
    this.map.addListener("dragend", this.handleDragEnd);
  };

  //드래그가끝나면 해당 화면 센터의 위치가 스테이트로 저장
  public handleDragEnd = async () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    this.setState({
      lat,
      lng
    });
    this.reverseGeocoding(lat, lng);
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = async () => {
    const result = await geoCode(this.state.address);
    if (result) {
      const { lat, lng, formatted_address } = result;
      this.setState({
        lat,
        lng,
        address: formatted_address
      });
      this.map.panTo({ lat, lng });
    } else {
      return;
    }
  };

  public reverseGeocoding = async (lat: number, lng: number) => {
    const reverseAddress = await reverseGeoCode(lat, lng);

    if (reverseAddress) {
      this.setState({
        address: reverseAddress
      });
    }
  };
}

export default FindAddressContainer;
