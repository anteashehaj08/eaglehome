import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <a routerLink="/" class="logo">
            <img src="https://i.postimg.cc/YSTsWCTh/logo-eagle-home.png" alt="Logo" class="logo-img">
          </a>
        </div>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-sub">Sign in to your account</p>

        <div class="error-alert" *ngIf="error">{{ error }}</div>

        <div class="field">
          <label>Email Address</label>
          <input type="email" [(ngModel)]="email" placeholder="you@example.com" (keyup.enter)="login()">
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()">
        </div>

        <button class="btn-primary btn-full" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>

        <p class="auth-footer">Don't have an account? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f2ede6; padding: 40px 16px; }
    .auth-card { background: #fff; padding: 48px 44px; width: 100%; max-width: 420px; box-shadow: var(--shadow-md); }
    .auth-brand { text-align: center; margin-bottom: 28px; }
    .logo-img {
      height: 45px;
      width: auto;
      object-fit: contain;
      justify-self: anchor-center;
    }
    .auth-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; text-align: center; margin-bottom: 6px; }
    .auth-sub { font-size: 13px; color: var(--text-light); text-align: center; margin-bottom: 28px; letter-spacing: 0.04em; }
    .error-alert { background: #fff0f0; border-left: 3px solid var(--accent); padding: 12px 14px; font-size: 13px; color: var(--accent); margin-bottom: 16px; }
    .btn-full { width: 100%; text-align: center; display: block; margin-top: 8px; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; font-size: 13px; color: var(--text-light); margin-top: 20px; }
    .auth-footer a { color: var(--accent); font-weight: 500; }
  `]
})
export class LoginComponent {
  email = ''; password = ''; loading = false; error = '';

  constructor(
      private authService: AuthService,
      private cartService: CartService,
      private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) { this.error = 'Please fill in all fields.'; return; }
    this.loading = true; this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Load cart AFTER auth token is stored, then navigate
        this.cartService.loadCart().subscribe();
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.message || 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}