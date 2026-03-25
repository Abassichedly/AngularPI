import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/club-management', pathMatch: 'full' },
  { path: 'club-management', loadChildren: () => import('./modules/club-management/club-management.module').then(m => m.ClubManagementModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }