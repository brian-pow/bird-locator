import ebird from "../apis/api";
import states from "../apis/zipData.json";

//Set zip code (current location)
export const setZipCode = (zip) => {
  return {
    type: "SET_ZIP",
    payload: states[zip],
  };
};

//Get all possible sightings near current location (to help user select a realistic bird to continue with)
export const getPossibleSightings = (state) => async (dispatch) => {
  const response = await ebird.get(`data/obs/US-${state}/recent`);

  dispatch({ type: "ADD_POSSIBLE_SIGHTINGS", payload: response.data });
};

//Select a bird to be searched for
export const selectBird = (bird) => {
  return {
    type: "SELECT_BIRD",
    payload: bird,
  };
};

//Get sightings of selected bird in a specific area
export const getRecentSpeciesSightings = (speciesCode, zip, state) => async (
  dispatch
) => {
  const response = await ebird.get(
    `data/obs/US-${state}/recent/${speciesCode}`
  );

  let payload;

  //Only act on first 25 sightings
  if (response.data.length >= 26) {
    payload = response.data.slice(0, 25);
  } else {
    payload = response.data;
  }

  let destinations = [];
  payload.map((loc) => {
    destinations.push({ lat: loc.lat, lng: loc.lng });
  });

  const origin = zip;

  //Get driving distance to each sighting from current location
  window.googleMaps.getDistanceMatrix(
    {
      origins: [origin],
      destinations: destinations,
      travelMode: "DRIVING",
    },
    callback
  );

  const metersInMile = 1609.34;

  function callback(response, status) {
    for (let i = 0; i < payload.length; i++) {
      payload[i].distanceFromCurrentLocation =
        response.rows[0].elements[i].distance.value / metersInMile;
    }

    dispatch({
      type: "LIST_RECENT_SIGHTINGS",
      payload: payload,
    });
  }
};
