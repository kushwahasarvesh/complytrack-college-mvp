import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-create-rule-page',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, PageHeadComponent],
  template: `
    <app-page-head
      kicker="Library"
      title="Create a rule"
      lede="Add a filing rule for this workspace. A past due date becomes overdue, and a date within seven days becomes due soon."/>

    <section class="panel">
      <div class="date-choices" role="group" aria-label="Suggested due dates">
        <button type="button" class="ghost" (click)="setDue(-10)">Overdue example</button>
        <button type="button" class="ghost" (click)="setDue(3)">Due soon example</button>
        <button type="button" class="ghost" (click)="setDue(30)">Upcoming example</button>
      </div>
      <form class="form-grid" (ngSubmit)="save()">
        <label>Rule name
          <input name="name" [(ngModel)]="name" required maxlength="160" placeholder="GST return">
        </label>
        <label>Filing type
          <input name="filingType" [(ngModel)]="filingType" required maxlength="80" placeholder="GST, TDS, License">
        </label>
        <label>Frequency
          <select name="frequency" [(ngModel)]="frequency" required>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>
        <label>Jurisdiction
          <input name="jurisdiction" [(ngModel)]="jurisdiction" required maxlength="80" placeholder="India (demo)">
        </label>
        <label>Day of month
          <input name="dayOfMonth" type="number" min="1" max="31" [(ngModel)]="dayOfMonth" placeholder="Optional">
        </label>
        <label>Next due date
          <input name="nextDueDate" type="date" [(ngModel)]="nextDueDate" required>
        </label>
        @if (workspace.businesses().length) {
          <label>Also create a deadline for
            <select name="businessId" [(ngModel)]="businessId" (ngModelChange)="businessTouched = true">
              <option value="">Do not create a deadline yet</option>
              @for (business of workspace.businesses(); track business.id) {
                <option [value]="business.id">{{ business.name }}</option>
              }
            </select>
          </label>
        } @else {
          <p class="hint">Save the rule now. Add a business before a deadline can be generated.</p>
        }
        <div class="row-actions">
          <button class="primary" type="submit" [disabled]="busy"><app-icon name="plus"/> Save rule</button>
          <a class="ghost" routerLink="/rules">Back to rules</a>
        </div>
      </form>
      @if (message) {
        <p class="error" role="alert">{{ message }}</p>
      }
    </section>
  `
})
export class CreateRulePageComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  workspace = inject(WorkspaceService);

  name = '';
  filingType = 'GST';
  frequency = 'MONTHLY';
  jurisdiction = 'India (demo)';
  dayOfMonth: number | null = null;
  nextDueDate = this.iso(30);
  businessId = '';
  businessTouched = false;
  message = '';
  busy = false;

  constructor() {
    effect(() => {
      const first = this.workspace.businesses()[0];
      if (!this.businessTouched && first) this.businessId = first.id;
    });
  }

  setDue(offsetDays: number) {
    this.nextDueDate = this.iso(offsetDays);
  }

  save() {
    this.message = '';
    this.busy = true;
    const day = this.dayOfMonth && this.dayOfMonth >= 1 ? this.dayOfMonth : undefined;
    this.api.createRule({
      name: this.name,
      filingType: this.filingType,
      frequency: this.frequency,
      jurisdiction: this.jurisdiction,
      dayOfMonth: day,
      nextDueDate: this.nextDueDate
    }).subscribe({
      next: rule => {
        if (!this.businessId) {
          this.busy = false;
          this.workspace.load();
          void this.router.navigateByUrl('/rules');
          return;
        }
        this.api.generateDeadline(this.businessId, rule.id).subscribe({
          next: () => {
            this.busy = false;
            this.workspace.load();
            void this.router.navigateByUrl('/attention');
          },
          error: err => this.fail(err)
        });
      },
      error: err => this.fail(err)
    });
  }

  private fail(err: { status?: number; error?: { detail?: string; message?: string } }) {
    this.busy = false;
    if (err?.status === 401) {
      this.workspace.fail(err);
      return;
    }
    this.message = err?.error?.detail || err?.error?.message || 'Could not save the rule.';
  }

  private iso(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
