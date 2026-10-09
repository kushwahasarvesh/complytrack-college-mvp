import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Business, ComplianceRule, Dashboard, Deadline } from './api.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  summary = signal<Dashboard | undefined>(undefined);
  businesses = signal<Business[]>([]);
  rules = signal<ComplianceRule[]>([]);
  deadlines = signal<Deadline[]>([]);
  error = signal('');
  loading = signal(false);

  load() {
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      summary: this.api.dashboard(),
      businesses: this.api.businesses(),
      rules: this.api.rules(),
      deadlines: this.api.deadlines()
    }).subscribe({
      next: data => {
        this.summary.set(data.summary);
        this.businesses.set(data.businesses);
        this.rules.set(data.rules);
        this.deadlines.set(data.deadlines);
        this.loading.set(false);
      },
      error: err => this.fail(err)
    });
  }

  fail(err: { status?: number; error?: { detail?: string; message?: string } }) {
    this.loading.set(false);
    if (err?.status === 401) {
      this.session.clear();
      void this.router.navigateByUrl('/login');
      return;
    }
    this.error.set(err?.error?.detail || err?.error?.message || 'Could not load data. Check the API.');
  }
}
