import { UserDto } from "@/core/dtos/user.dto";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, of, tap } from "rxjs";


@Injectable({providedIn: 'root'})
export class LoginService{
    private _currentUser = new BehaviorSubject<UserDto | null>(this.decodeToken());
  currentUser$ = this._currentUser.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  login(user: string, password: string) {
    
    return of(this.getUser(user, password)).pipe(
      tap((user) => {
        if (user) {
          this.saveToken(user);
          this._currentUser.next(user);
          this.router.navigateByUrl('/');
        } else {
          this.removeToken();
        }
      })
    );
  }

  logout() {
    this.removeToken();
    this._currentUser.next(null);
    this.router.navigateByUrl('/auth/login');
  }

  private saveToken(user: UserDto) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private removeToken() {
    localStorage.removeItem('userData');
  }

  private decodeToken() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  private getUser(user:string, password: string) : UserDto | null{
    const adminUser : UserDto = {
        id: 1, nombre: 'admin', userName: 'admin', password: '123', token:"32332"
    };
    if(adminUser.userName == user, adminUser.password == password) return adminUser;
    else return null;
    // return this.http.post<UserDto | null>('https://api.midominio.com/auth/login', {
    //   user,contrasenia,})
  }
}