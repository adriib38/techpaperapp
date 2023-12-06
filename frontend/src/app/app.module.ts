import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth-module/login/login.component';
import { RegisterComponent } from './auth-module/register/register.component';
import { LogoutComponent } from './auth-module/logout/logout.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { PagePostComponent } from './pagepost/pagepost.component';
import { NewpostComponent } from './newpost/newpost.component';
import { PostComponentComponent } from './post-component/post-component.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LogoutComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    PagePostComponent,
    NewpostComponent,
    PostComponentComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
