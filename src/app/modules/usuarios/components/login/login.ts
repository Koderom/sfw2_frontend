import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { FormBuilder, ReactiveFormsModule, Validator } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  imports: [
      ButtonModule, CheckboxModule, InputTextModule, 
      PasswordModule, FormsModule, RouterModule, 
      RippleModule, AppFloatingConfigurator, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  _formBuilder = inject(FormBuilder);
  _loginService = inject(LoginService);

  // Mensaje de error proveniente del servidor (ej: GraphQL errors objeto.errors[].message)
  serverError: string | null = null;
  // Indicador de carga mientras se realiza la petición
  loading: boolean = false;

  form = this._formBuilder.group({
    email: this._formBuilder.control('', Validators.required),
    password: this._formBuilder.control('', Validators.required),
    checked: this._formBuilder.control(false, Validators.required),
  });

  login(){
    if(!this.form.valid) return;
    const user = this.form.value!.email!;
    const password = this.form.value!.password!;
    this.loading = true;

    this._loginService.login(user, password)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (res) => {
          this.serverError = null;
          console.log('Login success', res);
        },
        error: (err) => {
          console.error('Login error:', err);

          // Extraer mensajes si vienen en err.error.errors (GraphQL)
          if (err && err.error && Array.isArray(err.error.errors)) {
            this.serverError = err.error.errors.map((e: any) => e.message).join('; ');
            return;
          }

          this.serverError = err && err.message ? err.message : 'Error desconocido durante el login';
        }
      });
  }
}
