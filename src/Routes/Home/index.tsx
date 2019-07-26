import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "././HomeContainer";

export default GoogleApiWrapper({
  apiKey: process.env.MAP_KEY
})(HomeContainer);
