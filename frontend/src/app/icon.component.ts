import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (name) {
        @case ('dashboard') {
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        }
        @case ('building') {
          <path d="M4 21h16"/>
          <path d="M6 21V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21"/>
          <path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M10 21v-3h4v3"/>
        }
        @case ('scale') {
          <path d="M12 3v18"/>
          <path d="M8 21h8"/>
          <path d="M12 6h7l-2.2 5.2a3.2 3.2 0 0 1-6 0L12 6z"/>
          <path d="M12 6H5l2.2 5.2a3.2 3.2 0 0 0 6 0L12 6z"/>
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2"/>
          <path d="M3 10h18"/>
          <path d="M8 3v4M16 3v4"/>
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5"/>
        }
        @case ('alert') {
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
          <path d="M10.3 4.8 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.8a2 2 0 0 0-3.4 0z"/>
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8"/>
          <path d="M12 8v5l3 2"/>
        }
        @case ('shield') {
          <path d="M12 3 19 6.2V12c0 4.6-3 7-7 8.5C8 19 5 16.6 5 12V6.2L12 3z"/>
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14"/>
        }
        @case ('user') {
          <circle cx="12" cy="8" r="3"/>
          <path d="M5.5 19.2a6.5 6.5 0 0 1 13 0"/>
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16"/>
        }
        @case ('close') {
          <path d="M6 6l12 12M18 6 6 18"/>
        }
        @case ('logout') {
          <path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>
          <path d="M14 16l4-4-4-4"/>
          <path d="M18 12H9"/>
        }
        @case ('file') {
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
          <path d="M14 3v5h5M8 13h8M8 17h5"/>
        }
      }
    </svg>
  `,
  styles: [`:host{display:inline-flex;line-height:0}svg{width:1.15em;height:1.15em}`]
})
export class IconComponent {
  @Input({ required: true }) name!: string;
}
