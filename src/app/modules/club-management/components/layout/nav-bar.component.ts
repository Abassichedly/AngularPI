import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  navItems = [
    {
      label: 'Club Management',
      icon: '📊',
      expanded: false,
      children: [
        { path: '/club-management/dashboard', label: 'Dashboard Clubs', icon: '📊', color: '#667eea' },
        { path: '/club-management/clubs', label: 'Clubs', icon: '🏛️' },
        { path: '/club-management/members', label: 'Membres', icon: '👥' },
        { path: '/club-management/activities', label: 'Activités', icon: '🎪' },
        { path: '/club-management/events', label: 'Événements', icon: '🎉' },
        { path: '/club-management/participations', label: 'Participations', icon: '✅' }
      ]
    }
  ];

  toggleMenu(item: any) {
    item.expanded = !item.expanded;
  }

  isActive(path: string): boolean {
    return window.location.pathname.includes(path);
  }
}