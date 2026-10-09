import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AttentionPageComponent } from './pages/attention.page';
import { AuthPageComponent } from './pages/auth.page';
import { BusinessesPageComponent } from './pages/businesses.page';
import { CreateRulePageComponent } from './pages/create-rule.page';
import { DashboardPageComponent } from './pages/dashboard.page';
import { DeadlinesPageComponent } from './pages/deadlines.page';
import { RulesPageComponent } from './pages/rules.page';
import { ShellComponent } from './shell.component';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent, canActivate: [guestGuard] },
  { path: 'register', component: AuthPageComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'businesses', component: BusinessesPageComponent },
      { path: 'rules', component: RulesPageComponent },
      { path: 'rules/new', component: CreateRulePageComponent },
      { path: 'deadlines', component: DeadlinesPageComponent },
      { path: 'attention', component: AttentionPageComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
