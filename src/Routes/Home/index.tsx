import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "././HomeContainer";
import { MAP_KEY } from "../../key";
export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(HomeContainer);
