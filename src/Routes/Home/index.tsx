import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "././HomeContainer";
import { MAP_KEY } from "../../sharedQueries.local";

export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(HomeContainer);
