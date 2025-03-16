// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // On utilise un BehaviorSubject pour avoir une valeur par défaut et pouvoir y souscrire.
  private usernameSubject = new BehaviorSubject<string>('');
  public username$ = this.usernameSubject.asObservable();

  setUsername(username: string): void {
    this.usernameSubject.next(username);
    // On peut aussi stocker dans le localStorage si besoin
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return this.usernameSubject.getValue();
  }

}
