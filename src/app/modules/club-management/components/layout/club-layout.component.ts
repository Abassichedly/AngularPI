import { Component } from '@angular/core';

@Component({
  selector: 'app-club-layout',
  template: `
    <app-nav-bar></app-nav-bar>
    <div class="layout-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .layout-content {
      min-height: 100vh;
    }
  `]
})
export class ClubLayoutComponent {}