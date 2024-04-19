import {AuthConfig} from "angular-oauth2-oidc";
import {environment} from "../../../environments/environment";

export const authConfig: AuthConfig = {
  requireHttps: environment.AUTH_REQUIRE_HTTPS === "true",
  issuer: environment.AUTH_ISSUER_URI,
  redirectUri: window.location.origin,
  clientId: environment.AUTH_CLIENT_ID,
  responseType: "code",
  scope: environment.AUTH_SCOPES,
  showDebugInformation: true,
  clearHashAfterLogin: true
};
