import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { IconComponent } from '../icon.component';
import { SessionService } from '../session.service';
import { SiteFooterComponent } from '../site-footer.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, SiteFooterComponent],
  template: `
    <div class="auth-shell">
      <header class="auth-bar">
        <a class="brand" routerLink="/login">
          <span class="mark" aria-hidden="true">CT</span>
          <span>ComplyTrack</span>
        </a>
        <a class="ghost" [routerLink]="mode === 'login' ? '/register' : '/login'">
          {{ mode === 'login' ? 'Create account' : 'Sign in' }}
        </a>
      </header>

      <main class="auth-main">
        <section class="hero">
          <p class="eyebrow">Compliance, handled</p>
          <h1>{{ mode === 'login' ? 'Every filing date, in one place.' : 'Open a workspace for your filings.' }}</h1>
          <p class="lede">
            {{ mode === 'login'
              ? 'Sign in to see upcoming, due-soon, and overdue items across the businesses you track.'
              : 'Create an account to keep business profiles, demonstration rules, and deadline records together.' }}
          </p>
          <figure class="hero-frame">
            <img src="assets/login-hero.jpg" alt="Folder, pen, and calendar on a quiet desk">
            <div class="float-card">
              <app-icon name="shield"/>
              <div>
                <strong>Filings stay visible</strong>
                <span>Upcoming, due soon, overdue, completed</span>
              </div>
            </div>
          </figure>
          <ul class="points">
            <li><app-icon name="calendar"/> Deadline lifecycle</li>
            <li><app-icon name="building"/> Business profiles</li>
            <li><app-icon name="file"/> Completion records</li>
          </ul>
        </section>

        <section class="auth-card">
          <p class="card-kicker">{{ mode === 'login' ? 'Welcome back' : 'New workspace' }}</p>
          <h2>{{ mode === 'login' ? 'Sign in' : 'Create account' }}</h2>
          @if (signedOutReason) {
            <p class="notice" role="status">{{ signedOutReason }}</p>
          }
          <form (ngSubmit)="submit()">
            @if (mode === 'register') {
              <label>Full name
                <input name="fullName" [(ngModel)]="fullName" required maxlength="120" autocomplete="name">
              </label>
            }
            <label>Email
              <input name="email" type="email" [(ngModel)]="email" required autocomplete="email">
            </label>
            <label>Password
              <input name="password" type="password" [(ngModel)]="password" required minlength="8" maxlength="72" autocomplete="{{ mode === 'login' ? 'current-password' : 'new-password' }}">
            </label>
            @if (mode === 'register') {
              <p class="hint">Use at least 8 characters.</p>
            }
            <button class="primary" type="submit" [disabled]="busy">
              {{ mode === 'login' ? 'Sign in' : 'Create account' }}
            </button>
          </form>
          <p class="switch">
            @if (mode === 'login') {
              New here? <a routerLink="/register">Create an account</a>
            } @else {
              Already registered? <a routerLink="/login">Sign in</a>
            }
          </p>
          @if (message) {
            <p class="error" role="alert">{{ message }}</p>
          }
        </section>
      </main>
      <app-site-footer/>
    </div>
  `
})
export class AuthPageComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  message = '';
  busy = false;

  get signedOutReason(): string {
    return this.session.signedOutReason();
  }

  get mode(): 'login' | 'register' {
    return this.router.url.startsWith('/register') ? 'register' : 'login';
  }

  submit() {
    this.message = '';
    this.busy = true;
    const call = this.mode === 'register'
      ? this.api.register(this.fullName, this.email, this.password)
      : this.api.login(this.email, this.password);
    call.subscribe({
      next: response => {
        this.session.save(response);
        this.busy = false;
        void this.router.navigateByUrl('/dashboard');
      },
      error: err => {
        this.busy = false;
        this.message = err?.error?.detail || err?.error?.message || 'Authentication failed. Check the backend and credentials.';
      }
    });
  }
}
