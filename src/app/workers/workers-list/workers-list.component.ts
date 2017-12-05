import { WorkerTO } from './../../tos/worker.to';
import { WorkersService } from './../services/worker.service';
import { WorkerEditComponent } from './../worker-edit/worker-edit.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.css']
})
export class WorkersListComponent implements OnInit {

  workers: WorkerTO[];
  editModalRef: MatDialogRef<WorkerEditComponent>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private workerService: WorkersService) { }

  ngOnInit() {
    this.workerService.getAllWorkers().subscribe(
      data => {
        this.workers = data;
        console.log(data);
      },
      error => console.log(error)
    );
  }

  onOpenDialog() {
    this.editModalRef = this.dialog.open(WorkerEditComponent);
    this.editModalRef.afterClosed().subscribe(
      e => this.getWorkers()
    );
  }

  getWorkers() {
    this.workerService.getAllWorkers().subscribe(
      data => {
        this.workers = data;
        console.log(data);
      },
      error => console.log(error)
    );
  }
}
