import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "././HomeContainer";
import { MAP_KEY } from "../../key";

const isDev = process.env.NODE_ENV === "development";

const REAL_KEY = isDev ? MAP_KEY : process.env.MAP_KEY;
export default GoogleApiWrapper({
  apiKey: REAL_KEY
})(HomeContainer);
