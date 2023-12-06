import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth-module/register/register.component';
import { LoginComponent } from './auth-module/login/login.component';
import { LogoutComponent } from './auth-module/logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './middlewares/auth-guard.component';
import { PagePostComponent } from './pagepost/pagepost.component';
import { NewpostComponent } from './newpost/newpost.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PagePostComponent, canActivate: [AuthGuard] },
  { path: 'new', component: NewpostComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
