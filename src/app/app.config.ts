import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {provideRouter} from "@angular/router";

import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {HttpClientModule} from "@angular/common/http";
import {OAuthModule, OAuthService} from "angular-oauth2-oidc";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule, OAuthModule.forRoot()),
    OAuthService
  ]
};
