import React from "react";
import ReactDOM from "react-dom";
import FindAddressPresenter from "./FindAddressPresenter";
import { reverseGeoCode } from "../../mapHelpers";

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

    const reverseAddress = await reverseGeoCode(latitude, longitude);

    this.setState({
      lat: latitude,
      lng: longitude,
      address: reverseAddress
    });
    //현재 위치 센터로 설정
    this.loadMap(latitude, longitude);
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

    const reverseAddress = await reverseGeoCode(lat, lng);

    this.setState({
      lat,
      lng,
      address: reverseAddress
    });
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = () => {
    console.log("address updated");
  };
}

export default FindAddressContainer;
