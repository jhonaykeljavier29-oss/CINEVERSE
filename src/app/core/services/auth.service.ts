import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    console.log('🔧 AuthService inicializado');
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('cineverse-user');
    console.log('Cargando usuario de storage:', savedUser);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        console.log('✅ Usuario cargado:', user);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }

  register(name: string, email: string, password: string): boolean {
    console.log('📝 Registrando usuario:', { name, email });
    
    const users = this.getUsers();
    
    if (users.some(u => u.email === email)) {
      console.log('❌ Email ya registrado');
      return false;
    }

    const newUser: User = {
      id: 'user_' + Date.now().toString(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=b146f0&color=fff&bold=true`
    };

    users.push({ ...newUser, password });
    localStorage.setItem('cineverse-users', JSON.stringify(users));
    console.log('✅ Usuario registrado:', newUser);
    
    this.login(email, password);
    return true;
  }

  login(email: string, password: string): boolean {
    console.log('🔑 Intentando login:', email);
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUserSubject.next(userWithoutPassword);
      localStorage.setItem('cineverse-user', JSON.stringify(userWithoutPassword));
      console.log('✅ Login exitoso:', userWithoutPassword);
      return true;
    }
    
    console.log('❌ Login fallido');
    return false;
  }

  logout(): void {
    console.log('👋 Logout');
    this.currentUserSubject.next(null);
    localStorage.removeItem('cineverse-user');
  }

  isLoggedIn(): boolean {
    const loggedIn = this.currentUserSubject.value !== null;
    console.log('🔍 isLoggedIn:', loggedIn);
    return loggedIn;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUsers(): any[] {
    const users = localStorage.getItem('cineverse-users');
    return users ? JSON.parse(users) : [];
  }
}