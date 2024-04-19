import {Component} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";
import {AuthService} from "../../../service/auth/auth.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger,
    NgIf,
    AsyncPipe,
    RouterLink
  ],
  providers: [AuthService],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss"
})
export class ProfileComponent {
  constructor(public authService: AuthService) {
  }
}
