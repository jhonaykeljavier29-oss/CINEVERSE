import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isRegister = false;
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.errorMessage = '';
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isRegister) {
      this.handleRegister();
    } else {
      this.handleLogin();
    }
  }

  private handleRegister(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Email no válido';
      return;
    }

    const success = this.authService.register(this.name, this.email, this.password);
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'El email ya está registrado';
    }
  }

  private handleLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email y contraseña son obligatorios';
      return;
    }

    const success = this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Email o contraseña incorrectos';
    }
  }
}