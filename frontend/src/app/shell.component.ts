import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from './icon.component';
import { SessionService } from './session.service';
import { SiteFooterComponent } from './site-footer.component';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, SiteFooterComponent],
  template: `
    <div class="app-shell">
      <header class="app-bar">
        <div class="app-bar-row">
          <a class="brand" routerLink="/dashboard">
            <span class="mark" aria-hidden="true">CT</span>
            <span>ComplyTrack</span>
          </a>
          <button class="icon-btn" type="button" (click)="menu = !menu" [attr.aria-expanded]="menu" [attr.aria-label]="menu ? 'Close menu' : 'Open menu'">
            <app-icon [name]="menu ? 'close' : 'menu'"/>
          </button>
          <nav class="desk-nav" aria-label="Primary">
            <a routerLink="/dashboard" routerLinkActive="active"><app-icon name="dashboard"/> Dashboard</a>
            <a routerLink="/businesses" routerLinkActive="active"><app-icon name="building"/> Businesses</a>
            <a routerLink="/rules" routerLinkActive="active"><app-icon name="scale"/> Rules</a>
            <a routerLink="/attention" routerLinkActive="active"><app-icon name="alert"/> Alerts</a>
            <a routerLink="/deadlines" routerLinkActive="active"><app-icon name="calendar"/> Deadlines</a>
          </nav>
          <div class="who">
            <span class="avatar" aria-hidden="true">{{ initial }}</span>
            <span class="who-name">{{ session.name() || session.email() || 'Account' }}</span>
            <button class="ghost" type="button" (click)="logout()"><app-icon name="logout"/> Sign out</button>
          </div>
        </div>
        @if (menu) {
          <nav class="mobile-nav" aria-label="Primary mobile">
            <a routerLink="/dashboard" routerLinkActive="active" (click)="menu = false"><app-icon name="dashboard"/> Dashboard</a>
            <a routerLink="/businesses" routerLinkActive="active" (click)="menu = false"><app-icon name="building"/> Businesses</a>
            <a routerLink="/rules" routerLinkActive="active" (click)="menu = false"><app-icon name="scale"/> Rules</a>
            <a routerLink="/attention" routerLinkActive="active" (click)="menu = false"><app-icon name="alert"/> Alerts</a>
            <a routerLink="/deadlines" routerLinkActive="active" (click)="menu = false"><app-icon name="calendar"/> Deadlines</a>
            <button type="button" (click)="logout()"><app-icon name="logout"/> Sign out</button>
          </nav>
        }
      </header>
      <main class="page">
        @if (workspace.error()) {
          <p class="error banner" role="alert">{{ workspace.error() }}</p>
        }
        <router-outlet/>
      </main>
      <app-site-footer [signedIn]="true"/>
    </div>
  `
})
export class ShellComponent {
  menu = false;
  session = inject(SessionService);
  workspace = inject(WorkspaceService);
  private readonly router = inject(Router);

  constructor() {
    this.workspace.load();
  }

  get initial(): string {
    const source = this.session.name() || this.session.email() || 'C';
    return source.trim().charAt(0).toUpperCase();
  }

  logout() {
    this.session.clear();
    this.menu = false;
    void this.router.navigateByUrl('/login');
  }
}
