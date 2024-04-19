import {bootstrapApplication} from "@angular/platform-browser";
import {appConfig} from "./app/app.config";
import {AppComponent} from "./app/app.component";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./app/service/auth/auth.config";

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const oauthService = appRef.injector.get(OAuthService);
    oauthService.configure(authConfig);
    oauthService.setStorage(sessionStorage);
    oauthService.loadDiscoveryDocument().then();
  })
  .catch((err) => console.error(err));
