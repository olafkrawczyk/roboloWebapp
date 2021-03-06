import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import {VERSION, MatDialog, MatDialogRef} from '@angular/material';
import { ClientAddComponent } from '../clients/client-add/client-add.component';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  public isCollapsed = true;
  editModalRef: MatDialogRef<ClientAddComponent>;
  constructor(private router: Router, private authService: AuthService, private dialog: MatDialog) { }

  isUserLoggedIn() {
    return !this.authService.isTokenExpired();
  }

  showEditProjectDialog() {
    this.editModalRef = this.dialog.open(ClientAddComponent);
  }
}
