import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Component, inject } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { FormBuilder, ReactiveFormsModule, Validator } from '@angular/forms';
import { LoginService } from './loginService';

@Component({
  selector: 'app-login',
  imports: [
      ButtonModule, CheckboxModule, InputTextModule, 
      PasswordModule, FormsModule, RouterModule, 
      RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  _formBuilder = inject(FormBuilder);
  _loginService = inject(LoginService);

  form = this._formBuilder.group({
    email: this._formBuilder.control('', Validators.required),
    password: this._formBuilder.control('', Validators.required),
    checked: this._formBuilder.control(false, Validators.required),
  });

  login(){
    if(!this.form.valid) return;
    const user = this.form.value!.email!;
    const password = this.form.value!.password!;

    this._loginService.login(user, password).subscribe();
  }
}
