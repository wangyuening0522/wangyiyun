const BASE_URL = "http://localhost:3000";
async function request(url, options = {}) {
  // const cookieValue = encodeURIComponent(
  //   "00Ox-uWGcp_CTYiK0TFlQuD99WYdjUAAAGFzhwY7A"
  // );
  options.headers = options.headers || {};
  options.headers["Content-Type"] = "application/json";
  options.credentials = "include";
  // options.headers["Cookie"] = `${cookieValue}`;
  options.mode = "cors";
  url = BASE_URL + url;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
export default request;
