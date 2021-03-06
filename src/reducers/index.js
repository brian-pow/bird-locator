import { combineReducers } from "redux";

const zipReducer = (state = null, action) => {
  if (action.type === "SET_ZIP") {
    if (action.payload !== undefined) {
      return action.payload;
    } else {
      return "INVALID";
    }
  }

  return state;
};

const possibleSightingsReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_POSSIBLE_SIGHTINGS":
      return action.payload;
    default:
      return state;
  }
};

const selectedBirdReducer = (state = null, action) => {
  switch (action.type) {
    case "SELECT_BIRD":
      return action.payload;
    default:
      return state;
  }
};

const recentSightingsReducer = (state = [], action) => {
  switch (action.type) {
    case "LIST_RECENT_SIGHTINGS":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  zip: zipReducer,
  possibleSightings: possibleSightingsReducer,
  selectedBird: selectedBirdReducer,
  recentSightings: recentSightingsReducer,
});
