import { Component } from '@angular/core';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  navItems: NavItem[] = [
    { path: '/club-management/dashboard', label: 'Dashboard', icon: '📊', color: '#667eea' },
    { path: '/club-management/clubs', label: 'Clubs', icon: '🏛️', color: '#f59e0b' },
    { path: '/club-management/members', label: 'Membres', icon: '👥', color: '#10b981' },
    { path: '/club-management/activities', label: 'Activités', icon: '🎪', color: '#ef4444' },
    { path: '/club-management/events', label: 'Événements', icon: '🎉', color: '#8b5cf6' },
    { path: '/club-management/participations', label: 'Participations', icon: '✅', color: '#ec489a' }
  ];

  isActive(path: string): boolean {
    return window.location.pathname.includes(path);
  }
  toggleTheme(): void {
    console.log('Toggle theme clicked');
  }
}