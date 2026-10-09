import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-grid">
        <div>
          <p class="brand-lockup">ComplyTrack</p>
          <p>A workspace for filing dates, business profiles, and completion records.</p>
        </div>
        <nav aria-label="Footer">
          @if (signedIn) {
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/businesses">Businesses</a>
            <a routerLink="/rules">Rules</a>
            <a routerLink="/rules/new">Create rule</a>
            <a routerLink="/attention">Due soon & overdue</a>
            <a routerLink="/deadlines">Deadlines</a>
          } @else {
            <a routerLink="/login">Sign in</a>
            <a routerLink="/register">Create account</a>
          }
        </nav>
        <p class="fine">Demonstration rules only. Confirm statutory dates with an authoritative source before you rely on them.</p>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {
  @Input() signedIn = false;
}
