import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {MatBadge} from "@angular/material/badge";
import {MatButton, MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatMenuTrigger,
    MatIcon,
    MatBadge,
    MatMenu,
    MatIconButton,
    MatButton,
    MatMenuItem,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
