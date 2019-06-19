import axios from "axios";
import { MAP_KEY } from "./key";
import { toast } from "react-toastify";

export const geoCode = async (address: string) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_KEY}`;

  const { data } = await axios(URL);

  if (!data.error_message) {
    const { results } = data;
    const {
      formatted_address,
      geometry: {
        location: { lat, lng }
      }
    } = results[0];

    return { formatted_address, lat, lng };
  } else {
    toast.error(data.error_message);
    return false;
  }
};

export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`;

  const { status, data } = await axios(URL);
  if (!data.error_message) {
    const { formatted_address } = data.results[0];
    return formatted_address;
  } else {
    toast.error(data.error_message);
    return false;
  }
};
