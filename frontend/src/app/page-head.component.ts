import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-head',
  standalone: true,
  template: `
    <header class="page-intro">
      <div>
        <p class="eyebrow">{{ kicker }}</p>
        <h1>{{ title }}</h1>
        <p class="lede">{{ lede }}</p>
      </div>
      <img src="assets/compliance-banner.jpg" alt="Stone colonnade in warm afternoon light">
    </header>
  `
})
export class PageHeadComponent {
  @Input({ required: true }) kicker = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) lede = '';
}
