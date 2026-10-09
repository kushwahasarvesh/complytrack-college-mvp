import { Injectable, signal } from '@angular/core';
import type { AuthResponse } from './api.service';

const ACTIVE_FLAG = 'complytrack_active';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly token = signal('');
  readonly name = signal('');
  readonly email = signal('');
  readonly signedOutReason = signal('');

  constructor() {
    localStorage.removeItem('complytrack_token');
    localStorage.removeItem('complytrack_name');
    localStorage.removeItem('complytrack_email');
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === 'reload' && sessionStorage.getItem(ACTIVE_FLAG) === '1') {
      this.signedOutReason.set('You were signed out because the page was refreshed.');
    }
    sessionStorage.removeItem(ACTIVE_FLAG);
  }

  save(response: AuthResponse) {
    this.token.set(response.token);
    this.name.set(response.fullName);
    this.email.set(response.email);
    this.signedOutReason.set('');
    sessionStorage.setItem(ACTIVE_FLAG, '1');
  }

  clear() {
    this.token.set('');
    this.name.set('');
    this.email.set('');
    sessionStorage.removeItem(ACTIVE_FLAG);
  }
}
