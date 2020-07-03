import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponentModule } from './hiroshimaadmin/adminlayout/adminlayout.module';
import { AuthLayoutModule } from './hiroshimaadmin/authlayout/authlayout.module';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: './hiroshimaadmin/adminlayout/adminlayout.module#AdminLayoutComponentModule'
      }
    ]
  },
  {
    path: '',
    children: [{
      path: 'login',
      loadChildren: './hiroshimaadmin/authlayout/authlayout.module#AuthLayoutModule'
    }]
  },
  { path: '**', redirectTo: '' },
];
