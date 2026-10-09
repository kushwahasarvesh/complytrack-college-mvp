import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, ComplianceRule } from '../api.service';
import { formatDue } from '../format';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, PageHeadComponent],
  template: `
    <app-page-head
      kicker="Library"
      title="Compliance rules"
      lede="These demonstration rules show how a filing can become a deadline. Confirm real statutory dates before you rely on them."/>

    <section class="panel toolbar">
      <label>Apply deadlines to
        <select name="businessId" [ngModel]="businessId" (ngModelChange)="selectedId = $event" [disabled]="!workspace.businesses().length">
          @for (business of workspace.businesses(); track business.id) {
            <option [value]="business.id">{{ business.name }}</option>
          }
        </select>
      </label>
      <a class="primary" routerLink="/rules/new"><app-icon name="plus"/> Create rule</a>
      @if (!workspace.businesses().length) {
        <p class="hint">Add a business before generating a deadline.</p>
      }
    </section>

    <section class="stack">
      @for (rule of workspace.rules(); track rule.id) {
        <article class="rule-card">
          <span class="entity-icon"><app-icon name="scale"/></span>
          <div class="rule-copy">
            <h3>{{ rule.name }}</h3>
            <p>{{ rule.filingType }} · {{ rule.frequency }} · {{ rule.jurisdiction }}</p>
            <p class="meta">Next sample due {{ formatDue(rule.nextDueDate) }}</p>
          </div>
          <button class="primary" type="button" [disabled]="!businessId || busyId === rule.id" (click)="generate(rule)">
            <app-icon name="calendar"/> Generate deadline
          </button>
        </article>
      }
    </section>
    @if (message) {
      <p [class]="saved ? 'note' : 'error'" role="status">{{ message }}</p>
    }
  `
})
export class RulesPageComponent {
  private readonly api = inject(ApiService);
  workspace = inject(WorkspaceService);
  formatDue = formatDue;

  selectedId = '';
  busyId = '';
  message = '';
  saved = false;

  get businessId(): string {
    return this.selectedId || this.workspace.businesses()[0]?.id || '';
  }

  generate(rule: ComplianceRule) {
    if (!this.businessId) return;
    this.message = '';
    this.saved = false;
    this.busyId = rule.id;
    this.api.generateDeadline(this.businessId, rule.id).subscribe({
      next: () => {
        this.busyId = '';
        this.saved = true;
        this.message = 'Deadline created for ' + rule.name + '.';
        this.workspace.load();
      },
      error: err => {
        this.busyId = '';
        this.saved = false;
        this.workspace.fail(err);
        this.message = this.workspace.error();
      }
    });
  }
}
