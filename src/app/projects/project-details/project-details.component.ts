import { ClientsService } from './../../clients/service/clients.service';
import { AddWorkerDialogComponent } from './../add-worker-dialog/add-worker-dialog.component';
import { TaskAddComponent } from './../task-add/task-add.component';
import { TaskTO } from './../../tos/task.to';
import { ProjectEditDetailsComponent } from './../project-edit-details/project-edit-details.component';
import { ProjectService } from './../services/project.service';
import { ProjectTo } from './../../tos/project.to';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { ClientTO } from '../../tos/client.to';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: ProjectTo;

  tasksToDo: TaskTO[];
  tasksInProgress: TaskTO[];
  tasksDone: TaskTO[];
  clients: ClientTO[];

  progress = 0;
  selectedClient;

  editModalRef: MatDialogRef<ProjectEditDetailsComponent>;
  addTaskModalRef: MatDialogRef<TaskAddComponent>;
  setWorkerModalRef: MatDialogRef<AddWorkerDialogComponent>;

  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService,
    private dialog: MatDialog, private router: Router, private clientsService: ClientsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (param: Params) => {
        this.projectService.getProjectDetails(param['id']).subscribe(
          (data: ProjectTo) => {
            console.log(data);
            this.project = data;
            this.getProjectTasks();
          },
          (error) => console.log(error)
        );
      }
    );
    this.clientsService.getAllClients().subscribe(
      (data) => {this.clients = data; },
      (error) => console.log(error)
    );
  }

  onOpenEditDialog() {
    this.editModalRef = this.dialog.open(ProjectEditDetailsComponent, {hasBackdrop: true,
      data: {project: this.project}});
    this.editModalRef.afterClosed()
      .subscribe(project => {
        if (project != null) {
          this.project = project;
        }
      });
  }

  onAddTaskDialog() {
    this.addTaskModalRef = this.dialog.open(TaskAddComponent, {hasBackdrop: true, data: {projectId: this.project.id}});
    this.addTaskModalRef.afterClosed()
      .subscribe(
        e => this.getProjectTasks()
      );
  }

  getProjectTasks() {
    this.projectService.getAllTasks(this.project.id).subscribe(
      (data) => {
        console.log(data);
        this.tasksToDo = data[0];
        this.tasksInProgress = data[1];
        this.tasksDone = data[2];
        
        if (data === []) {
          this.tasksToDo = [];
          this.tasksInProgress = [];
          this.tasksDone = [];
        }

        this.progress = ((this.tasksDone.length) / (this.tasksInProgress.length + this.tasksToDo.length + this.tasksDone.length)) * 100;
      },
      error => console.log(error)
    );
  }

  onDeleteProject() {
    if (!confirm('Delete project?')) {
      return;
    }
    this.projectService.deleteProject(this.project.id).subscribe(
      data => {
        this.router.navigate(['/']);
      },
      error => console.log(error)
    );
  }

  setTaskDone(taskId) {
    this.projectService.setTaskDone(this.project.id, taskId).subscribe(
      data => {
        console.log(data);
        this.getProjectTasks();
      },
      error => console.log(error)
    );
  }

  setTaskToDo(taskId) {
    this.projectService.setTaskToDo(this.project.id, taskId).subscribe(
      data => {
        console.log(data);
        this.getProjectTasks();
      },
      error => console.log(error)
    );
  }

  setTaskInProgress(taskId) {
    this.projectService.setTaskInProgress(this.project.id, taskId).subscribe(
      data => {
        console.log(data);
        this.getProjectTasks();
      },
      error => console.log(error)
    );
  }

  deleteTask(taskId) {
    if (!confirm('Delete task?')) {
      return;
    }
    this.projectService.deleteTask(this.project.id, taskId).subscribe(
      data => {
        console.log(data);
        this.getProjectTasks();
      },
      error => console.log(error)
    );
  }

  onSetWorker(task) {
    this.setWorkerModalRef = this.dialog.open(AddWorkerDialogComponent, {data: {project: this.project, task: task}});
    this.setWorkerModalRef.afterClosed().subscribe(
      e => this.getProjectTasks()
    );
  }

  onSetClient() {
    if (!confirm('Change client?')) {
      return;
    }
    this.projectService.setClient(this.project.id, this.selectedClient).subscribe(
      data => this.project = data,
      error => console.log(error)
    );
  }

}
