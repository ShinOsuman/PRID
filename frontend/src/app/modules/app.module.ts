import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { AppRoutes } from '../routing/app.routing';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { QuizzesComponent } from '../components/quizzes/quizzes.component';
import { QuizListComponent } from '../components/quizzes/quiz-list.component';
import { QuestionComponent } from '../components/question/question.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { QuizClotureComponent } from '../components/quiz-cloture/quiz-cloture.component';
import { TeacherComponent } from '../components/teacher/teacher.component';
import { QuizEditComponent } from '../components/quiz-edit/quiz-edit.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { QuizDeleteComponent } from '../components/quiz-delete/quiz-delete.component';




@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    UnknownComponent,
    RestrictedComponent,
    HomeComponent,
    SetFocusDirective,
    QuizzesComponent,
    QuizListComponent,
    QuestionComponent,
    CodeEditorComponent,
    QuizClotureComponent,
    TeacherComponent,
    QuizEditComponent,
    QuizDeleteComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
