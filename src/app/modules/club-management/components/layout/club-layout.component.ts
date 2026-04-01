import { Component } from '@angular/core';
@Component({
  selector: 'app-club-layout',
  template: `
    <div class="layout">
      <app-nav-bar></app-nav-bar>

      <div class="layout-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
    }

    .layout-content {
      flex: 1;
      padding: 20px;
      background: #f1f5f9;
      overflow-y: auto;
    }
  `]
})
export class ClubLayoutComponent {}