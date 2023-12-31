import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { HomeComponent } from '../components/home/home.component';
import { QuizzesComponent } from '../components/quizzes/quizzes.component';
import { QuestionComponent } from '../components/question/question.component';
import { TeacherComponent } from '../components/teacher/teacher.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
      path: 'users',
      component: UserListComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Teacher] }
  },
  {
      path: 'login',
      component: LoginComponent
  },
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { roles: [Role.Teacher]} },
  { path: 'quizzes', component: QuizzesComponent, canActivate: [AuthGuard], data: { roles: [Role.Student]} },
  { path: 'restricted', component: RestrictedComponent },
  { path: 'question/:id', component: QuestionComponent, canActivate: [AuthGuard]},
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
