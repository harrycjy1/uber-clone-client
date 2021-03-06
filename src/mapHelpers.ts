import axios from "axios";

import { toast } from "react-toastify";
import { MAP_KEY } from "./sharedQueries.local";

export const geoCode = async (address: string) => {
  try {
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
      toast.error(data);
      return false;
    }
  } catch (error) {
    toast.error("Cannot find place!");
    return false;
  }
};

export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`;

  const { data } = await axios(URL);
  if (!data.error_message) {
    const { formatted_address } = data.results[0];
    return formatted_address;
  } else {
    toast.error(data.error_message);
    return false;
  }
};
