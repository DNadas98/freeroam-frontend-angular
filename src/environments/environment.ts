export const environment = {
  production: false,
  MEDIA_BASE_URL: "/assets/media",
  HTML_BASE_URL: "/assets/html",
  SUMMITS_SERVICE_BASE_URL: "http://localhost:8080/api/summits",
  OVERPASS_API_URL: "https://overpass-api.de/api/interpreter",
  AUTH_CLIENT_ID: "freeroam_frontend",
  AUTH_ISSUER_URI: "http://localhost:8090/realms/freeroam",
  AUTH_TOKEN_URI: "http://localhost:8090/realms/freeroam/protocol/openid-connect/token",
  AUTH_SCOPES: "openid profile email",
  AUTH_REQUIRE_HTTPS: "false"
};
