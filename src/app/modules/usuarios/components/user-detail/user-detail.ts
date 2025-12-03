import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol, User } from '../../entities/user.entity';
import { UserService } from '../../service/user.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { CreateUserDto } from '../../dto/create-user.dto';
import { from } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    CheckboxModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnChanges {
  @Input() visible: boolean = false;
  @Input() user: User | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<User>();

  form: FormGroup;
  loading: boolean = false;
  roles:Rol[] = [];
  

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(){
    this.loadRoles();
  }

  loadRoles(){
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles.data.map( roldto => new Rol(roldto));
        console.log('Roles loaded:', this.roles);
      },
      error: (error) => {
        this.roles = [];
        console.error('Error loading roles:', error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('user -> dialog:', this.user);
    if (changes['user'] && this.user) {
      this.form.patchValue({
        username: this.user.username,
        contrasena: this.user.contrasena,
        rolId: this.user.rol.id,
        correo: this.user.email,
        telefono: this.user.telefono,
        estado: this.user.estado,
        notificar_email: this.user.notificarEmail,
        notificar_whatsapp: this.user.notificarWhatsapp
      });
    } else if (changes['user'] && !this.user) {
      this.form.reset({
        username: '',
        contrasena: '',
        rolId: '',
        correo: '',
        telefono: '',
        estado: true,
        notificar_email: true,
        notificar_whatsapp: true
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      rolId: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: [true],
      notificar_email: [true],
      notificar_whatsapp: [true],
    });
  }

  onSubmit() {
    console.log( 'Form Value:', this.form.value );
    if (this.form.invalid) return;

    this.loading = true;
    const formValue = this.form.value;
    
    const userData : CreateUserDto = {
      id: this.user ? this.user.id : undefined,
      username: formValue.username,
      contrasena: formValue.contrasena,
      nombre: formValue.username,
      fecha_login: new Date().toDateString(),
      estado: formValue.estado,
      email: formValue.correo,
      telefono: formValue.telefono,
      notificar_email: formValue.notificar_email,
      notificar_whatsapp: formValue.notificar_whatsapp,
      idRol:  formValue.rolId,
    };

    const operation = this.user 
      ? this.userService.updateUser(this.user.id!, userData)
      : this.userService.createUser(userData);

    operation.subscribe({
      next: (savedUser) => {
        this.loading = false;
        this.save.emit(new User(savedUser.data));
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.loading = false;
      }
    });
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
