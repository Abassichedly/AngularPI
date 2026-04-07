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
      expanded: true,
      children: [
        { path: '/club-management/dashboard', label: 'Dashboard Clubs', icon: '📊', color: '#667eea' },
        { path: '/club-management/clubs', label: 'Clubs', icon: '🏛️', color: '#f59e0b' },
        { path: '/club-management/users', label: 'Utilisateurs', icon: '👥', color: '#10b981' },
        { path: '/club-management/activities', label: 'Activités', icon: '🎪', color: '#ef4444' },
        { path: '/club-management/events', label: 'Événements', icon: '🎉', color: '#8b5cf6' },
        { path: '/club-management/participations', label: 'Participations', icon: '✅', color: '#ec489a' }
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