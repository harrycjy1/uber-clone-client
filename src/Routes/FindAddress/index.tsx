import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";
import { MAP_KEY } from "../../sharedQueries.local";

export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(FindAddressContainer);
