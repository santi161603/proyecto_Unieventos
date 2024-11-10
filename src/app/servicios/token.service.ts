import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Buffer } from "buffer";


const TOKEN_KEY = "AuthToken";


@Injectable({
 providedIn: 'root'
})
export class TokenService {
  private rolSubject = new BehaviorSubject<string>('');
  private isLoginSubject = new BehaviorSubject<boolean>(this.isLogged());
  constructor(private router: Router) {
    // Si ya hay un token almacenado, se decodifica y establece el rol actual
    const currentToken = this.getToken();
    if (currentToken) {
      const rol = this.decodeRoleFromToken(currentToken);
      this.rolSubject.next(rol);
      this.isLoginSubject.next(true);
    }
  }

 // Almacena el token en sessionStorage y actualiza el rol
 public setToken(token: string) {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.setItem(TOKEN_KEY, token);
  const rol = this.decodeRoleFromToken(token);
  this.rolSubject.next(rol);
  const isLogged = this.isLogged()
  this.isLoginSubject.next(true); // Actualiza el estado de login
}

public isLoggerObservable(): Observable<boolean> {
  return this.isLoginSubject.asObservable();
}

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }

  public login(token: string){
    this.setToken(token);
    this.isLoginSubject.next(true); // Asegura que isLogger esté en true después de iniciar sesión
    this.router.navigate(["/"]);
 }

 public logout() {
  window.sessionStorage.clear();
  this.isLoginSubject.next(false); // Actualiza el estado de login a false
  this.router.navigate(["/login"]);
}

private decodeRoleFromToken(token: string): string {
  const payload = token.split('.')[1];
  const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
  const values = JSON.parse(payloadDecoded);
  return values.rol || ''; // Devuelve el rol, o cadena vacía si no existe
}

private decodePayload(token: string): any {
  const payload = token!.split(".")[1];
  const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
  const values = JSON.parse(payloadDecoded);
  console.log("estoy en decode")
  return values;
}

//Revisar el backen
public getIDCuenta(): string {
  const token = this.getToken();
  if (token) {
    const values = this.decodePayload(token);
    return values.id;
  }
  return "";
 }

 public getRolObservable(): Observable<string> {
  return this.rolSubject.asObservable();
}

}

