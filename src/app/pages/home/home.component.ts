import { Component } from '@angular/core';
import {MapComponent} from "./components/map/map.component";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
