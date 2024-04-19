import {Injectable} from "@angular/core";
import {OAuthService, UserInfo} from "angular-oauth2-oidc";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserInfo | null>(null);

  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.events.subscribe(event => {
      if (event.type === "token_received" && this.userSubject.value === null) {
        this.loadUserProfile();
        this.router.navigate(["."], {queryParams: {}}).then();
      } else if (event.type === "discovery_document_loaded") {
        this.oauthService.tryLogin().then(result => {
          if (result && this.oauthService.hasValidAccessToken() && this.userSubject.value === null) {
            this.loadUserProfile();
          }
        });
      }
    });
  }

  register() {
    window.location.href = `${this.oauthService.issuer}/protocol/openid-connect/registrations?client_id=${this.oauthService.clientId}&response_type=code&scope=${this.oauthService.scope}&redirect_uri=${this.oauthService.redirectUri}`;
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.revokeTokenAndLogout().then();
    this.userSubject.next(null);
    this.router.navigate(["/home"], {queryParams: {}}).then();
  }

  openAccountPage() {
    window.open(`${this.oauthService.issuer}/account`, "_blank");
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  getUsername(): Observable<string> {
    return this.getUser().pipe(
      map(user => user?.["info"] ? user["info"]?.["preferred_username"] || user?.["info"]?.["name"] || user?.["info"]?.["email"] : "")
    );
  }

  private loadUserProfile(): void {
    this.oauthService.loadUserProfile().then((profile: any) => {
      this.userSubject.next(profile as UserInfo);
    }).catch(() => {
      this.userSubject.next(null);
    });
  }
}
