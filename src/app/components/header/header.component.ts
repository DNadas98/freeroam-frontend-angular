import {Component} from "@angular/core";
import {MatToolbar} from "@angular/material/toolbar";
import {ProfileComponent} from "../profile/profile/profile.component";
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    ProfileComponent,
    RouterLink,
    MatButton
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
