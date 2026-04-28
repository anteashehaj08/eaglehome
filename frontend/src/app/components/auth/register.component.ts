import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="logo-eagle">EAGLE</span><span class="logo-fier">FIER</span>
        </div>
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-sub">Join EagleFier today</p>

        <div class="error-alert" *ngIf="error">{{ error }}</div>

        <div class="row-2">
          <div class="field"><label>First Name</label><input type="text" [(ngModel)]="firstName" placeholder="John"></div>
          <div class="field"><label>Last Name</label><input type="text" [(ngModel)]="lastName" placeholder="Doe"></div>
        </div>
        <div class="field"><label>Email Address</label><input type="email" [(ngModel)]="email" placeholder="you@example.com"></div>
        <div class="field"><label>Password</label><input type="password" [(ngModel)]="password" placeholder="Minimum 6 characters" (keyup.enter)="register()"></div>

        <button class="btn-primary btn-full" (click)="register()" [disabled]="loading">
          {{ loading ? 'Creating account…' : 'Create Account' }}
        </button>
        <p class="auth-footer">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f2ede6; padding: 40px 16px; }
    .auth-card { background: #fff; padding: 48px 44px; width: 100%; max-width: 460px; box-shadow: var(--shadow-md); }
    .auth-brand { text-align: center; margin-bottom: 28px; }
    .logo-eagle { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--text-dark); letter-spacing: 0.08em; }
    .logo-fier  { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--text-dark); letter-spacing: 0.08em; }
    .auth-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; text-align: center; margin-bottom: 6px; }
    .auth-sub { font-size: 13px; color: var(--text-light); text-align: center; margin-bottom: 28px; letter-spacing: 0.04em; }
    .error-alert { background: #fff0f0; border-left: 3px solid var(--accent); padding: 12px 14px; font-size: 13px; color: var(--accent); margin-bottom: 16px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .btn-full { width: 100%; text-align: center; display: block; margin-top: 8px; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; font-size: 13px; color: var(--text-light); margin-top: 20px; }
    .auth-footer a { color: var(--accent); font-weight: 500; }
  `]
})
export class RegisterComponent {
  firstName = ''; lastName = ''; email = ''; password = '';
  loading = false; error = '';

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {}

  register(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password) { this.error = 'Please fill in all fields.'; return; }
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters.'; return; }
    this.loading = true; this.error = '';
    this.authService.register({ firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password }).subscribe({
      next: () => { this.cartService.loadCart().subscribe(); this.router.navigate(['/']); },
      error: (err) => { this.error = err.error?.message || 'Registration failed. Please try again.'; this.loading = false; }
    });
  }
}
