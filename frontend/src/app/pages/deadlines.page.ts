import { Component, inject } from '@angular/core';
import { ApiService, Deadline } from '../api.service';
import { formatDue, statusLabel } from '../format';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-deadlines-page',
  standalone: true,
  imports: [IconComponent, PageHeadComponent],
  template: `
    <app-page-head
      kicker="Calendar"
      title="Deadlines"
      lede="Open items move from upcoming to due soon, then overdue, until you mark them complete."/>

    <div class="filters" role="tablist" aria-label="Filter deadlines">
      @for (option of filters; track option.id) {
        <button type="button" [class.active]="filter === option.id" (click)="filter = option.id">{{ option.label }}</button>
      }
    </div>

    <section class="stack">
      @if (!visible.length) {
        <p class="empty panel"><app-icon name="calendar"/> Nothing in this view. Generate a deadline from a compliance rule.</p>
      }
      @for (item of visible; track item.id) {
        <article class="rule-card">
          <span class="entity-icon"><app-icon [name]="item.status === 'COMPLETED' ? 'check' : 'calendar'"/></span>
          <div class="rule-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ businessName(item.businessId) }}</p>
            <p class="meta">Due {{ formatDue(item.dueDate) }}</p>
          </div>
          <div class="row-actions">
            <span class="pill" [class]="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
            @if (item.status !== 'COMPLETED') {
              <button class="ghost" type="button" [disabled]="busyId === item.id" (click)="complete(item)">
                <app-icon name="check"/> Mark complete
              </button>
            }
          </div>
        </article>
      }
    </section>
  `
})
export class DeadlinesPageComponent {
  private readonly api = inject(ApiService);
  workspace = inject(WorkspaceService);
  formatDue = formatDue;
  statusLabel = statusLabel;

  filter = 'ALL';
  busyId = '';
  filters = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'DUE_SOON', label: 'Due soon' },
    { id: 'OVERDUE', label: 'Overdue' },
    { id: 'COMPLETED', label: 'Completed' }
  ];

  get visible(): Deadline[] {
    const items = this.workspace.deadlines();
    if (this.filter === 'ALL') return items;
    return items.filter(item => item.status === this.filter);
  }

  businessName(id: string) {
    return this.workspace.businesses().find(business => business.id === id)?.name ?? 'Business';
  }

  statusClass(status: string) {
    return 'pill ' + status.toLowerCase().replace('_', '-');
  }

  complete(item: Deadline) {
    this.busyId = item.id;
    this.api.completeDeadline(item.id).subscribe({
      next: () => {
        this.busyId = '';
        this.workspace.load();
      },
      error: err => {
        this.busyId = '';
        this.workspace.fail(err);
      }
    });
  }
}
