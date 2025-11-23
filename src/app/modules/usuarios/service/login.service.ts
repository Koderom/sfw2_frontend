
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from "rxjs";
import { UserDto } from "../dto/user.dto";
import { Apollo, gql } from 'apollo-angular';
import { LoginDto } from "../dto/login.dto";
import { Login } from "../components/login/login";


const GET_PACIENTES = gql`
  mutation Login($username: String!, $password: String!){
    login(nombreUsuario: $username, contrasena: $password){
      accessToken, refreshToken, expiresIn, usuario {
        _id nombreUsuario rol {
          _id descripcion
        }
      }
    }
  }
`;

@Injectable({providedIn: 'root'})
export class LoginService{
    private _currentUser = new BehaviorSubject<UserDto | null>(this.decodeToken());
  currentUser$ = this._currentUser.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);
  private apollo = inject(Apollo);

  login(user: string, password: string): Observable<void> {
  return this.getUser(user, password).pipe(
    map((login) => {
      if (login) {
        this.saveToken(login.usuario);
        this._currentUser.next(login.usuario);
        this.router.navigateByUrl('/');
      } else {
        this.removeToken();
      }
    }),
    catchError((error) => {
      console.error('Error en login:', error);
      this.removeToken();
      let userMessage = 'Error de autenticación';
      
      if (error.status === 401) {
        userMessage = 'Usuario o contraseña incorrectos';
      } else if (error.status === 0) {
        userMessage = 'No se puede conectar al servidor';
      }
      
      return throwError(() => new Error(userMessage));
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

  private getUser(user:string, password: string) : Observable<LoginDto>{
    return this.apollo.mutate<{login: LoginDto}>({
      mutation: GET_PACIENTES,
      variables: {
        username: user,
        password: password
      }
    }).pipe(
      map(result => result.data!.login as LoginDto)
    ); 
  }
}