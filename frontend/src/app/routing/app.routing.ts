import { Routes, RouterModule } from '@angular/router';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { HomeComponent } from '../components/home/home.component';
import { QuizzesComponent } from '../components/quizzes/quizzes.component';
import { QuestionComponent } from '../components/question/question.component';
import { TeacherComponent } from '../components/teacher/teacher.component';
import { QuizEditComponent } from '../components/quiz-edit/quiz-edit.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
      path: 'login',
      component: LoginComponent
  },
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { roles: [Role.Teacher]} },
  { path: 'quizzes', component: QuizzesComponent, canActivate: [AuthGuard], data: { roles: [Role.Student]} },
  { path: 'quizedition/:id', component: QuizEditComponent, canActivate: [AuthGuard], data: { roles: [Role.Teacher]} },
  { path: 'question/:id', component: QuestionComponent, canActivate: [AuthGuard]},
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
