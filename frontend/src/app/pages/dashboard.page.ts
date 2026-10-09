import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { SessionService } from '../session.service';
import { WorkspaceService } from '../workspace.service';
import { formatDue, statusLabel } from '../format';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, IconComponent, PageHeadComponent],
  template: `
    <app-page-head
      kicker="Overview"
      title="Dashboard"
      [lede]="'Hello' + (session.name() ? ', ' + session.name() : '') + '. Here is the filing picture for your businesses.'"/>

    <section class="metrics" aria-label="Deadline counts">
      @for (item of metrics; track item.label) {
        <article class="metric" [attr.data-tone]="item.tone">
          <app-icon [name]="item.icon"/>
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      }
    </section>

    <p class="hint"><a routerLink="/attention">Review due soon and overdue</a></p>

    <section class="split">
      <article class="panel">
        <div class="section-head">
          <h2>Open deadlines</h2>
          <a routerLink="/deadlines">View all</a>
        </div>
        @if (!openDeadlines.length) {
          <p class="empty"><app-icon name="calendar"/> No open deadlines yet. Generate one from a rule.</p>
        }
        @for (item of openDeadlines; track item.id) {
          <div class="row">
            <div>
              <strong>{{ item.title }}</strong>
              <span>Due {{ formatDue(item.dueDate) }}</span>
            </div>
            <span class="pill" [class]="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
          </div>
        }
      </article>
      <article class="panel">
        <div class="section-head">
          <h2>Businesses</h2>
          <a routerLink="/businesses">Manage</a>
        </div>
        @if (!workspace.businesses().length) {
          <p class="empty"><app-icon name="building"/> Add a business before you generate deadlines.</p>
        }
        @for (business of workspace.businesses().slice(0, 4); track business.id) {
          <div class="row">
            <div>
              <strong>{{ business.name }}</strong>
              <span>{{ business.businessType }} · {{ business.state }}</span>
            </div>
            <app-icon name="building"/>
          </div>
        }
      </article>
    </section>
  `
})
export class DashboardPageComponent {
  session = inject(SessionService);
  workspace = inject(WorkspaceService);
  formatDue = formatDue;
  statusLabel = statusLabel;

  get metrics() {
    const summary = this.workspace.summary();
    return [
      { label: 'Total', value: summary?.total ?? 0, icon: 'file', tone: 'navy' },
      { label: 'Upcoming', value: summary?.upcoming ?? 0, icon: 'calendar', tone: 'ink' },
      { label: 'Due soon', value: summary?.dueSoon ?? 0, icon: 'clock', tone: 'gold' },
      { label: 'Overdue', value: summary?.overdue ?? 0, icon: 'alert', tone: 'danger' },
      { label: 'Completed', value: summary?.completed ?? 0, icon: 'check', tone: 'ok' }
    ];
  }

  get openDeadlines() {
    return this.workspace.deadlines().filter(item => item.status !== 'COMPLETED').slice(0, 5);
  }

  statusClass(status: string) {
    return 'pill ' + status.toLowerCase().replace('_', '-');
  }
}
