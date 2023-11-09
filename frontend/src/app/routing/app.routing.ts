import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from '../components/userlist/userlist.component';

const appRoutes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: '**', redirectTo: '' }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
