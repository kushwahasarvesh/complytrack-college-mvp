import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Deadline } from '../api.service';
import { formatDue, statusLabel } from '../format';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-attention-page',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, PageHeadComponent, NgTemplateOutlet],
  template: `
    <app-page-head
      kicker="Needs attention"
      title="Due soon and overdue"
      lede="Items due within seven days sit here beside anything already past its date. Sample rules are included so a new account can fill both lists."/>

    <section class="panel toolbar">
      <label>Business
        <select name="businessId" [ngModel]="businessId" (ngModelChange)="selectedId = $event" [disabled]="!workspace.businesses().length">
          @for (business of workspace.businesses(); track business.id) {
            <option [value]="business.id">{{ business.name }}</option>
          }
        </select>
      </label>
      <button class="primary" type="button" [disabled]="!businessId || busy" (click)="addSamples()">
        <app-icon name="plus"/> Add sample overdue and due soon
      </button>
    </section>
    @if (!workspace.businesses().length) {
      <p class="hint">Add a business before sample deadlines can be created. <a routerLink="/businesses">Go to businesses</a></p>
    }
    @if (message) {
      <p [class]="saved ? 'note' : 'error'" role="status">{{ message }}</p>
    }

    <section class="split">
      <article class="panel">
        <div class="section-head">
          <h2>Overdue</h2>
          <span class="pill overdue">{{ overdue.length }}</span>
        </div>
        @if (!overdue.length) {
          <p class="empty"><app-icon name="alert"/> No overdue deadlines yet.</p>
        }
        @for (item of overdue; track item.id) {
          <ng-container *ngTemplateOutlet="row; context: { $implicit: item }"/>
        }
      </article>
      <article class="panel">
        <div class="section-head">
          <h2>Due soon</h2>
          <span class="pill due-soon">{{ dueSoon.length }}</span>
        </div>
        @if (!dueSoon.length) {
          <p class="empty"><app-icon name="clock"/> Nothing is due in the next seven days.</p>
        }
        @for (item of dueSoon; track item.id) {
          <ng-container *ngTemplateOutlet="row; context: { $implicit: item }"/>
        }
      </article>
    </section>

    <ng-template #row let-item>
      <div class="row">
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ businessName(item.businessId) }} · Due {{ formatDue(item.dueDate) }}</span>
        </div>
        <div class="row-actions">
          <span class="pill" [class]="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
          <button class="ghost" type="button" [disabled]="busyId === item.id" (click)="complete(item)">
            <app-icon name="check"/> Mark complete
          </button>
        </div>
      </div>
    </ng-template>

    <p class="hint">Need a different filing? <a routerLink="/rules/new">Create a rule</a> and choose an overdue or due soon date.</p>
  `
})
export class AttentionPageComponent {
  private readonly api = inject(ApiService);
  workspace = inject(WorkspaceService);
  formatDue = formatDue;
  statusLabel = statusLabel;

  selectedId = '';
  message = '';
  saved = false;
  busy = false;
  busyId = '';

  get businessId(): string {
    return this.selectedId || this.workspace.businesses()[0]?.id || '';
  }

  get overdue(): Deadline[] {
    return this.workspace.deadlines().filter(item => item.status === 'OVERDUE');
  }

  get dueSoon(): Deadline[] {
    return this.workspace.deadlines().filter(item => item.status === 'DUE_SOON');
  }

  businessName(id: string) {
    return this.workspace.businesses().find(business => business.id === id)?.name ?? 'Business';
  }

  statusClass(status: string) {
    return 'pill ' + status.toLowerCase().replace('_', '-');
  }

  addSamples() {
    if (!this.businessId) return;
    this.message = '';
    this.busy = true;
    this.api.addSampleDeadlines(this.businessId).subscribe({
      next: created => {
        this.busy = false;
        this.saved = true;
        this.message = created.length
          ? 'Added ' + created.length + ' sample deadline' + (created.length === 1 ? '' : 's') + '.'
          : 'Sample overdue and due soon deadlines are already on this business.';
        this.workspace.load();
      },
      error: err => {
        this.busy = false;
        this.saved = false;
        if (err?.status === 401) {
          this.workspace.fail(err);
          return;
        }
        this.message = err?.error?.detail || err?.error?.message || 'Could not add sample deadlines.';
      }
    });
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
