import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../entities/user.entity';
import { UserService } from '../../service/user.service';
import { UserDetail } from '../user-detail/user-detail';
import { Table } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    UserDetail,
    ConfirmDialogModule,
    InputIconModule,
    IconFieldModule,
    ToolbarModule
  ],
  providers: [ConfirmationService],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTable implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  showDialog: boolean = false;
  selectedUser: User | null = null;

  @ViewChild('dt') table!: Table;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log("usuarios", users);
        
        this.users = users.data.map(userdto => new User(userdto));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }

  createUser() {
    this.selectedUser = null;
    this.showDialog = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.showDialog = true;
  }

  onHideDialog() {
    this.selectedUser = null;
    this.showDialog = false;
    this.loadUsers();
  }

  onSave(user: User) {
    this.showDialog = false;
    this.loadUsers();
  }

  hidePassword(password: string): string {
    return '•'.repeat(8);
  }
}
