import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "././HomeContainer";

const MAP_KEY = process.env.MAP_KEY;
export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(HomeContainer);
