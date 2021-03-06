import { ProjectService } from './../services/project.service';
import { ProjectStubTO } from './../../tos/project.stub.to';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import {VERSION, MatDialog, MatDialogRef} from '@angular/material';
import { ProjectEditComponent } from './../project-edit/project-edit.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {

  projects: ProjectStubTO[];
  editModalRef: MatDialogRef<ProjectEditComponent>;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.projectService.getAllProjectStubs().subscribe(
      (data: ProjectStubTO[]) => this.projects = data,
      (error) => {
        console.log(error);
        if (error.status == 401)  {
          console.log("Unauthorized!");
          this.router.navigate(['/login']);
        }
      }
    );
  }
  
  onOpenDialog() {
    this.editModalRef = this.dialog.open(ProjectEditComponent);
    this.editModalRef.afterClosed()
      .pipe(filter(projects => projects))
      .subscribe(projects => this.projects = projects);
  }
}
