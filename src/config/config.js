import defaults from "./config.json";
const config = {
  api_base: (process.env.REACT_APP_API_BASE || defaults.api_base).replace(
    /\/$/,
    ""
  ),
};
export default config;
