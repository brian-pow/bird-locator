import axios from "axios";

export default axios.create({
  baseURL: "https://api.ebird.org/v2/",
  headers: {
    "X-eBirdApiToken": process.env.REACT_APP_EBIRD_API_KEY,
  },
});
