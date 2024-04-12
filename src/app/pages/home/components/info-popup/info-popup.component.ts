import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {GeoLocation} from "../../../../model/map/GeoLocation";

@Component({
  selector: "app-info-popup",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent
  ],
  templateUrl: "./info-popup.component.html",
  styleUrl: "./info-popup.component.scss"
})
export class InfoPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GeoLocation) {
  }
}
