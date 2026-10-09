import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { IconComponent } from '../icon.component';
import { PageHeadComponent } from '../page-head.component';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-businesses-page',
  standalone: true,
  imports: [FormsModule, IconComponent, PageHeadComponent],
  template: `
    <app-page-head
      kicker="Profiles"
      title="Businesses"
      lede="Each deadline belongs to a business you own. Add the name, type, and state you want to track."/>

    <section class="panel">
      <h2>Add a business</h2>
      <form class="form-grid" (ngSubmit)="create()">
        <label>Business name
          <input name="businessName" [(ngModel)]="name" required maxlength="160">
        </label>
        <label>Business type
          <input name="businessType" [(ngModel)]="type" required maxlength="80" placeholder="Retail, Services">
        </label>
        <label>State
          <input name="state" [(ngModel)]="state" required maxlength="80">
        </label>
        <label>Registration number
          <input name="registrationNumber" [(ngModel)]="registration" maxlength="100">
        </label>
        <button class="primary" type="submit" [disabled]="busy"><app-icon name="plus"/> Add business</button>
      </form>
      @if (message) {
        <p class="error" role="alert">{{ message }}</p>
      }
    </section>

    <section class="cards">
      @if (!workspace.businesses().length) {
        <p class="empty panel"><app-icon name="building"/> No businesses yet. Add your first profile above.</p>
      }
      @for (business of workspace.businesses(); track business.id) {
        <article class="entity">
          <span class="entity-icon"><app-icon name="building"/></span>
          <div>
            <h3>{{ business.name }}</h3>
            <p>{{ business.businessType }} · {{ business.state }}</p>
            @if (business.registrationNumber) {
              <p class="meta">Reg. {{ business.registrationNumber }}</p>
            }
          </div>
        </article>
      }
    </section>
  `
})
export class BusinessesPageComponent {
  private readonly api = inject(ApiService);
  workspace = inject(WorkspaceService);

  name = '';
  type = 'Retail';
  state = '';
  registration = '';
  message = '';
  busy = false;

  create() {
    this.message = '';
    this.busy = true;
    this.api.createBusiness({
      name: this.name,
      businessType: this.type,
      state: this.state,
      registrationNumber: this.registration || undefined
    }).subscribe({
      next: () => {
        this.name = '';
        this.registration = '';
        this.busy = false;
        this.workspace.load();
      },
      error: err => {
        this.busy = false;
        this.workspace.fail(err);
        this.message = this.workspace.error();
      }
    });
  }
}
