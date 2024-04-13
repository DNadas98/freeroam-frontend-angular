import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {DetailedGeoLocationDto} from "../../../../model/map/DetailedGeoLocationDto";
import {NgIf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";

@Component({
  selector: "app-info-popup",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    NgIf,
    MatDivider,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  templateUrl: "./info-popup.component.html",
  styleUrl: "./info-popup.component.scss"
})
export class InfoPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DetailedGeoLocationDto) {
  }
}
